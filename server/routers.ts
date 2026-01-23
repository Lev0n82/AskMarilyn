import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { submitScore, getTopScores, awardBadge, getUserBadges, createForumPost, getForumPosts, getForumPostById, createForumReply, getPostReplies, recordActivity, getUserStreak, recordQuizAttempt, getQuizAttempts, upsertCourseProgress, getCourseProgress, upsertTopicProgress, getTopicProgress, getQuizStats, issueCertificate, getUserCertificates, getCertificateByNumber, addToSpacedRepetition, getDueReviews, markReviewComplete, getSpacedRepetitionStats, updateCommunityStats, getCommunityStats, getUserRankInCourse, getAllGraceModules, getGraceModulesByTrack, getGraceModuleByNumber, createGraceModule, updateGraceModule, getGraceQuizQuestions, createGraceQuizQuestion, getGraceCrucibleChallenge, createGraceCrucibleChallenge, getGraceUserProgress, getAllGraceUserProgress, markGraceSectionComplete, createGraceQuizAttempt, createGraceCrucibleSubmission, getGraceCrucibleSubmissions, getAllGraceCrucibleSubmissions, updateGraceCrucibleSubmission, getGraceUserCertificates, checkAndAwardGraceCertificates, verifyGraceCertificate, getAllGraceUsers } from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leaderboard: router({
    // Get top scores for a game type
    getTopScores: publicProcedure
      .input(z.object({
        gameType: z.enum(["refactoring", "boss"]),
        limit: z.number().min(1).max(100).default(10),
      }))
      .query(async ({ input }) => {
        const scores = await getTopScores(input.gameType, input.limit);
        return scores;
      }),

    // Submit a score (requires authentication)
    submitScore: protectedProcedure
      .input(z.object({
        gameType: z.enum(["refactoring", "boss"]),
        score: z.number().min(0),
        maxScore: z.number().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await submitScore({
          userId: ctx.user.id,
          userName: ctx.user.name || "Anonymous",
          gameType: input.gameType,
          score: input.score,
          maxScore: input.maxScore,
        });
        return { success: true, result };
      }),
  }),

  badges: router({
    // Get user's badges
    getUserBadges: protectedProcedure.query(async ({ ctx }) => {
      const userBadges = await getUserBadges(ctx.user.id);
      return userBadges;
    }),

    // Award a badge to the current user
    awardBadge: protectedProcedure
      .input(z.object({
        badgeType: z.enum([
          "perfect_quiz",
          "perfect_refactoring",
          "perfect_boss",
          "first_attempt",
          "speed_runner",
          "master_logician",
          "early_adopter",
          "completionist",
          "streak_master",
          "abt_fundamentals_complete",
          "coding_style_complete",
          "commenting_complete",
          "technical_writing_complete",
          "all_courses_complete"
        ]),
        courseId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await awardBadge({
          userId: ctx.user.id,
          badgeType: input.badgeType,
          courseId: input.courseId,
        });
        return { success: true, result };
      }),
  }),

  forum: router({
    // Get all posts
    getPosts: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(50),
      }).optional())
      .query(async ({ input }) => {
        const posts = await getForumPosts(input?.limit || 50);
        return posts;
      }),

    // Get a single post with replies
    getPost: publicProcedure
      .input(z.object({
        postId: z.number(),
      }))
      .query(async ({ input }) => {
        const post = await getForumPostById(input.postId);
        if (!post) return null;
        const replies = await getPostReplies(input.postId);
        return { post, replies };
      }),

    // Create a new post (requires authentication)
    createPost: protectedProcedure
      .input(z.object({
        title: z.string().min(5).max(500),
        content: z.string().min(10).max(10000),
        category: z.enum(["question", "example", "discussion"]).default("question"),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await createForumPost({
          userId: ctx.user.id,
          userName: ctx.user.name || "Anonymous",
          title: input.title,
          content: input.content,
          category: input.category,
        });
        return { success: true, result };
      }),

    // Add a reply to a post (requires authentication)
    addReply: protectedProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string().min(1).max(5000),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get the original post to notify the author
        const post = await getForumPostById(input.postId);
        
        const result = await createForumReply({
          postId: input.postId,
          userId: ctx.user.id,
          userName: ctx.user.name || "Anonymous",
          content: input.content,
        });

        // Send notification to the post author (if not replying to own post)
        // Note: notifyOwner sends to the project owner, not individual users
        // For user-specific notifications, we log the event
        if (post && post.userId !== ctx.user.id) {
          console.log(`[Forum] ${ctx.user.name || "Someone"} replied to post "${post.title}" by user ${post.userId}`);
        }

        return { success: true, result };
      }),
  }),

  streaks: router({
    // Record daily activity and update streak
    recordActivity: protectedProcedure.mutation(async ({ ctx }) => {
      const result = await recordActivity(ctx.user.id);
      
      // Award streak_master badge if user reaches 7-day streak
      if (result && result.currentStreak >= 7) {
        try {
          await awardBadge({
            userId: ctx.user.id,
            badgeType: "streak_master",
          });
        } catch (error) {
          // Badge may already be awarded
        }
      }

      return result;
    }),

    // Get user's current streak
    getStreak: protectedProcedure.query(async ({ ctx }) => {
      const streak = await getUserStreak(ctx.user.id);
      return streak || { currentStreak: 0, longestStreak: 0 };
    }),
  }),

  // Feedback submission
  feedback: router({
    submit: protectedProcedure
      .input(z.object({
        content: z.string().min(10).max(5000),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          await notifyOwner({
            title: "📝 Course Feedback",
            content: `Feedback from ${ctx.user.name || "Anonymous"}:\n\n${input.content}`,
          });
          return { success: true };
        } catch (error) {
          console.warn("[Notification] Failed to send feedback:", error);
          return { success: true }; // Still return success
        }
      }),
  }),

  // Course completion notification
  courseCompletion: router({
    sendCompletionEmail: protectedProcedure
      .input(z.object({
        quizScore: z.number(),
        totalModules: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Send congratulatory notification to project owner about course completion
        try {
          await notifyOwner({
            title: "🎉 Course Completion!",
            content: `${ctx.user.name || "A user"} has completed all ${input.totalModules} modules and scored ${input.quizScore}/5 on the final assessment!`,
          });
          return { success: true };
        } catch (error) {
          console.warn("[Notification] Failed to send completion notification:", error);
          return { success: true }; // Still return success as the course is completed
        }
      }),
  }),

  // Quiz tracking routes
  quiz: router({
    // Record a quiz attempt
    recordAttempt: protectedProcedure
      .input(z.object({
        courseId: z.string(),
        topicId: z.string(),
        questionId: z.string(),
        selectedAnswer: z.string(),
        isCorrect: z.number().min(0).max(1),
        attemptNumber: z.number().min(1).default(1),
        usedSimplifiedExplanation: z.number().min(0).max(1).default(0),
        timeSpentSeconds: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await recordQuizAttempt({
          userId: ctx.user.id,
          ...input,
        });
        
        // Update topic progress
        await upsertTopicProgress({
          userId: ctx.user.id,
          courseId: input.courseId,
          topicId: input.topicId,
          status: input.isCorrect === 1 ? "completed" : "quiz_failed",
          quizScore: input.isCorrect === 1 ? 100 : 0,
          quizAttempts: input.attemptNumber,
          usedEli5: input.usedSimplifiedExplanation,
          completedAt: input.isCorrect === 1 ? new Date() : undefined,
        });

        return { success: true, result };
      }),

    // Get quiz attempts for current user
    getAttempts: protectedProcedure
      .input(z.object({
        courseId: z.string().optional(),
        topicId: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        const attempts = await getQuizAttempts(
          ctx.user.id,
          input?.courseId,
          input?.topicId
        );
        return attempts;
      }),

    // Get quiz statistics
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const stats = await getQuizStats(ctx.user.id);
      return stats;
    }),
  }),

  // Certificate routes
  certificates: router({
    // Issue a certificate for completing a course
    issue: protectedProcedure
      .input(z.object({
        courseId: z.string(),
        courseName: z.string(),
        topicsCompleted: z.number(),
        quizzesPassed: z.number(),
        averageScore: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Generate unique certificate number
        const certNumber = `ABT-${input.courseId.toUpperCase().slice(0, 3)}-${ctx.user.id}-${Date.now().toString(36).toUpperCase()}`;
        
        const result = await issueCertificate({
          userId: ctx.user.id,
          courseId: input.courseId,
          userName: ctx.user.name || "Anonymous",
          courseName: input.courseName,
          certificateNumber: certNumber,
          topicsCompleted: input.topicsCompleted,
          quizzesPassed: input.quizzesPassed,
          averageScore: input.averageScore,
        });
        
        return result;
      }),

    // Get user's certificates
    getUserCertificates: protectedProcedure.query(async ({ ctx }) => {
      const certificates = await getUserCertificates(ctx.user.id);
      return certificates;
    }),

    // Verify a certificate by number (public)
    verify: publicProcedure
      .input(z.object({
        certificateNumber: z.string(),
      }))
      .query(async ({ input }) => {
        const certificate = await getCertificateByNumber(input.certificateNumber);
        return certificate || null;
      }),
  }),

  // Spaced repetition routes
  spacedRepetition: router({
    // Add a failed question to the review queue
    addToQueue: protectedProcedure
      .input(z.object({
        courseId: z.string(),
        topicId: z.string(),
        questionId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + 1); // First review tomorrow
        
        const result = await addToSpacedRepetition({
          userId: ctx.user.id,
          courseId: input.courseId,
          topicId: input.topicId,
          questionId: input.questionId,
          nextReviewAt: nextReview,
          status: 'due',
        });
        
        return result;
      }),

    // Get questions due for review
    getDueReviews: protectedProcedure.query(async ({ ctx }) => {
      const dueReviews = await getDueReviews(ctx.user.id);
      return dueReviews;
    }),

    // Mark a review as complete
    markComplete: protectedProcedure
      .input(z.object({
        itemId: z.number(),
        wasCorrect: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        const result = await markReviewComplete(input.itemId, input.wasCorrect);
        return result;
      }),

    // Get spaced repetition statistics
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const stats = await getSpacedRepetitionStats(ctx.user.id);
      return stats;
    }),
  }),

  // Community statistics routes
  community: router({
    // Get community stats for a course/topic
    getStats: publicProcedure
      .input(z.object({
        courseId: z.string().optional(),
        topicId: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const stats = await getCommunityStats(input?.courseId, input?.topicId);
        return stats;
      }),

    // Get user's rank in a course
    getUserRank: protectedProcedure
      .input(z.object({
        courseId: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        const rank = await getUserRankInCourse(ctx.user.id, input.courseId);
        return rank;
      }),

    // Trigger stats update (called after quiz completion)
    updateStats: protectedProcedure
      .input(z.object({
        courseId: z.string(),
        topicId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const stats = await updateCommunityStats(input.courseId, input.topicId || null);
        return stats;
      }),
  }),

  // Course progress routes
  progress: router({
    // Get all course progress for current user
    getCourseProgress: protectedProcedure
      .input(z.object({
        courseId: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        const progress = await getCourseProgress(ctx.user.id, input?.courseId);
        return progress;
      }),

    // Get topic progress for a course
    getTopicProgress: protectedProcedure
      .input(z.object({
        courseId: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        const progress = await getTopicProgress(ctx.user.id, input.courseId);
        return progress;
      }),

    // Update course progress
    updateCourseProgress: protectedProcedure
      .input(z.object({
        courseId: z.string(),
        topicsCompleted: z.number(),
        totalTopics: z.number(),
        quizzesPassed: z.number(),
        quizzesFailed: z.number(),
        totalQuizAttempts: z.number(),
        eli5ExplanationsUsed: z.number(),
        averageScore: z.number().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await upsertCourseProgress({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true, result };
      }),
  }),

  // ============ GRACE ACADEMY ROUTES ============
  graceAcademy: router({
    // Module routes
    modules: router({
      getAll: publicProcedure.query(async () => {
        return getAllGraceModules();
      }),
      
      getByTrack: publicProcedure
        .input(z.object({ track: z.enum(['foundation', 'intermediate', 'advanced']) }))
        .query(async ({ input }) => {
          return getGraceModulesByTrack(input.track);
        }),
      
      getByNumber: publicProcedure
        .input(z.object({ moduleNumber: z.number() }))
        .query(async ({ input }) => {
          const module = await getGraceModuleByNumber(input.moduleNumber);
          const questions = await getGraceQuizQuestions(input.moduleNumber);
          const crucible = await getGraceCrucibleChallenge(input.moduleNumber);
          return { module, questions, crucible };
        }),
      
      create: protectedProcedure
        .input(z.object({
          moduleNumber: z.number(),
          track: z.enum(['foundation', 'intermediate', 'advanced']),
          title: z.string(),
          subtitle: z.string().optional(),
          sparkContent: z.string().optional(),
          imprintContent: z.string().optional(),
          visualAidUrl: z.string().optional(),
          visualAidDescription: z.string().optional(),
          estimatedMinutes: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') throw new Error('Admin access required');
          await createGraceModule(input);
          return { success: true };
        }),
      
      update: protectedProcedure
        .input(z.object({
          moduleNumber: z.number(),
          data: z.object({
            title: z.string().optional(),
            subtitle: z.string().optional(),
            sparkContent: z.string().optional(),
            imprintContent: z.string().optional(),
            visualAidUrl: z.string().optional(),
            visualAidDescription: z.string().optional(),
            estimatedMinutes: z.number().optional(),
          }),
        }))
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') throw new Error('Admin access required');
          await updateGraceModule(input.moduleNumber, input.data);
          return { success: true };
        }),
    }),
    
    // Quiz routes
    quiz: router({
      getQuestions: publicProcedure
        .input(z.object({ moduleId: z.number() }))
        .query(async ({ input }) => {
          const questions = await getGraceQuizQuestions(input.moduleId);
          return questions.map(q => ({
            ...q,
            options: JSON.parse(q.options),
          }));
        }),
      
      submit: protectedProcedure
        .input(z.object({
          moduleId: z.number(),
          answers: z.array(z.number()),
          timeTaken: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const questions = await getGraceQuizQuestions(input.moduleId);
          let score = 0;
          const results = input.answers.map((answer, idx) => {
            const correct = questions[idx]?.correctAnswer === answer;
            if (correct) score++;
            return { questionId: questions[idx]?.id, correct, correctAnswer: questions[idx]?.correctAnswer };
          });
          
          await createGraceQuizAttempt({
            userId: ctx.user.id,
            moduleId: input.moduleId,
            score,
            answers: JSON.stringify(input.answers),
            timeTaken: input.timeTaken,
          });
          
          const certificatesAwarded = await checkAndAwardGraceCertificates(ctx.user.id);
          
          return {
            score,
            total: 5,
            passed: score >= 3,
            results,
            certificatesAwarded,
          };
        }),
      
      createQuestion: protectedProcedure
        .input(z.object({
          moduleId: z.number(),
          questionNumber: z.number(),
          question: z.string(),
          options: z.array(z.string()),
          correctAnswer: z.number(),
          explanation: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') throw new Error('Admin access required');
          await createGraceQuizQuestion({
            ...input,
            options: JSON.stringify(input.options),
          });
          return { success: true };
        }),
    }),
    
    // Crucible routes
    crucible: router({
      getChallenge: publicProcedure
        .input(z.object({ moduleId: z.number() }))
        .query(async ({ input }) => {
          return getGraceCrucibleChallenge(input.moduleId);
        }),
      
      submit: protectedProcedure
        .input(z.object({
          moduleId: z.number(),
          submission: z.string().min(50),
        }))
        .mutation(async ({ ctx, input }) => {
          await createGraceCrucibleSubmission({
            userId: ctx.user.id,
            moduleId: input.moduleId,
            submission: input.submission,
          });
          
          const certificatesAwarded = await checkAndAwardGraceCertificates(ctx.user.id);
          return { success: true, certificatesAwarded };
        }),
      
      getSubmissions: protectedProcedure.query(async ({ ctx }) => {
        return getGraceCrucibleSubmissions(ctx.user.id);
      }),
      
      getAllSubmissions: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Admin access required');
        return getAllGraceCrucibleSubmissions();
      }),
      
      review: protectedProcedure
        .input(z.object({
          submissionId: z.number(),
          status: z.enum(['pending', 'approved', 'needs_revision']),
          feedback: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') throw new Error('Admin access required');
          await updateGraceCrucibleSubmission(input.submissionId, {
            status: input.status,
            adminFeedback: input.feedback,
            reviewedBy: ctx.user.id,
          });
          return { success: true };
        }),
    }),
    
    // Progress routes
    progress: router({
      forModule: protectedProcedure
        .input(z.object({ moduleId: z.number() }))
        .query(async ({ ctx, input }) => {
          return getGraceUserProgress(ctx.user.id, input.moduleId);
        }),
      
      getAll: protectedProcedure.query(async ({ ctx }) => {
        return getAllGraceUserProgress(ctx.user.id);
      }),
      
      markComplete: protectedProcedure
        .input(z.object({
          moduleId: z.number(),
          section: z.enum(['spark', 'gauntlet', 'crucible', 'imprint']),
        }))
        .mutation(async ({ ctx, input }) => {
          await markGraceSectionComplete(ctx.user.id, input.moduleId, input.section);
          const certificatesAwarded = await checkAndAwardGraceCertificates(ctx.user.id);
          return { success: true, certificatesAwarded };
        }),
      
      getDashboard: protectedProcedure.query(async ({ ctx }) => {
        const progress = await getAllGraceUserProgress(ctx.user.id);
        const certificates = await getGraceUserCertificates(ctx.user.id);
        
        const completedModules = progress.filter(p => p.moduleCompleted).length;
        const foundationComplete = progress.filter(p => p.moduleCompleted && p.moduleId >= 1 && p.moduleId <= 10).length;
        const intermediateComplete = progress.filter(p => p.moduleCompleted && p.moduleId >= 11 && p.moduleId <= 20).length;
        const advancedComplete = progress.filter(p => p.moduleCompleted && p.moduleId >= 21 && p.moduleId <= 30).length;
        
        const avgScore = progress.length > 0 
          ? progress.reduce((sum, p) => sum + (p.bestQuizScore || 0), 0) / progress.length 
          : 0;
        
        return {
          totalModules: 30,
          completedModules,
          foundationProgress: foundationComplete,
          intermediateProgress: intermediateComplete,
          advancedProgress: advancedComplete,
          averageScore: Math.round(avgScore),
          certificates,
          progress,
        };
      }),
    }),
    
    // Certificate routes
    certificates: router({
      getAll: protectedProcedure.query(async ({ ctx }) => {
        return getGraceUserCertificates(ctx.user.id);
      }),
      
      verify: publicProcedure
        .input(z.object({ code: z.string() }))
        .query(async ({ input }) => {
          return verifyGraceCertificate(input.code);
        }),
    }),
    
    // Admin routes
    admin: router({
      getUsers: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Admin access required');
        return getAllGraceUsers();
      }),
      
      getUserProgress: protectedProcedure
        .input(z.object({ userId: z.number() }))
        .query(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') throw new Error('Admin access required');
          return getAllGraceUserProgress(input.userId);
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
