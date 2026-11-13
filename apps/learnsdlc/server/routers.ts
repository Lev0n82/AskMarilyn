import { evidenceDeskRouter } from "./evidence/router";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { submitScore, getTopScores, awardBadge, getUserBadges, createForumPost, getForumPosts, getForumPostById, createForumReply, getPostReplies, recordActivity, getUserStreak, recordQuizAttempt, getQuizAttempts, upsertCourseProgress, getCourseProgress, upsertTopicProgress, getTopicProgress, getQuizStats, issueCertificate, getUserCertificates, getCertificateByNumber, addToSpacedRepetition, getDueReviews, markReviewComplete, getSpacedRepetitionStats, updateCommunityStats, getCommunityStats, getUserRankInCourse, recordSectionCompletion, getSectionCompletions, getUserPoints } from "./db";
import { notifyOwner } from "./_core/notification";
import {
  getAllStfModules, getStfModulesByTrack, getStfModuleByNumber,
  createStfModule, updateStfModule,
  getStfQuizQuestions, createStfQuizQuestion,
  getStfUserProgress, getAllStfUserProgress, markStfSectionComplete,
  createStfQuizAttempt, createStfGameScore, getStfGameScores,
  createStfExamAttempt, getStfExamAttempts,
  getStfUserCertificates, checkAndAwardStfCertificates, verifyStfCertificate,
  getStfDashboard,
} from "./stf-db";
import {
  getAllCmakeModules, getCmakeModulesByTrack, getCmakeModuleByNumber,
  createCmakeModule, updateCmakeModule,
  getCmakeQuizQuestions, createCmakeQuizQuestion,
  getCmakeUserProgress, getAllCmakeUserProgress, markCmakeSectionComplete,
  createCmakeQuizAttempt, createCmakeCrucibleSubmission,
  getCmakeUserCertificates, checkAndAwardCmakeCertificates, verifyCmakeCertificate,
  getCmakeDashboard,
} from "./cmake-db";

export const appRouter = router({
  evidenceDesk: evidenceDeskRouter,
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

  // Section completion and points tracking
  sections: router({
    // Record completing a section
    complete: protectedProcedure
      .input(z.object({
        courseId: z.string(),
        sectionPath: z.string(),
        sectionType: z.enum(["lesson", "game", "quiz", "exam", "challenge"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await recordSectionCompletion({
          userId: ctx.user.id,
          courseId: input.courseId,
          sectionPath: input.sectionPath,
          sectionType: input.sectionType,
        });
        return result;
      }),

    // Get user's section completions
    getCompletions: protectedProcedure
      .input(z.object({
        courseId: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        const completions = await getSectionCompletions(ctx.user.id, input?.courseId);
        return completions;
      }),

    // Get user's points summary
    getPoints: protectedProcedure.query(async ({ ctx }) => {
      const points = await getUserPoints(ctx.user.id);
      return points || {
        totalPoints: 0,
        lessonsCompleted: 0,
        gamesCompleted: 0,
        quizzesCompleted: 0,
        examsCompleted: 0,
        challengesCompleted: 0,
      };
    }),
   }),

  // CMake Mastery course
  cmakeMastery: router({
    modules: router({
      getAll: publicProcedure.query(async () => {
        return getAllCmakeModules();
      }),
      getByTrack: publicProcedure
        .input(z.object({ track: z.enum(['foundations', 'build_system', 'advanced', 'tools']) }))
        .query(async ({ input }) => {
          return getCmakeModulesByTrack(input.track);
        }),
      getByNumber: publicProcedure
        .input(z.object({ moduleNumber: z.number() }))
        .query(async ({ input }) => {
          return getCmakeModuleByNumber(input.moduleNumber);
        }),
      create: protectedProcedure
        .input(z.object({
          moduleNumber: z.number(),
          track: z.enum(['foundations', 'build_system', 'advanced', 'tools']),
          title: z.string(),
          subtitle: z.string().optional(),
          sparkContent: z.string().optional(),
          imprintContent: z.string().optional(),
          cruciblePrompt: z.string().optional(),
          crucibleSample: z.string().optional(),
          visualAidUrl: z.string().optional(),
          shockImageUrl: z.string().optional(),
          estimatedMinutes: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') throw new Error('Admin access required');
          await createCmakeModule(input);
          return { success: true };
        }),
      update: protectedProcedure
        .input(z.object({
          moduleNumber: z.number(),
          data: z.object({
            sparkContent: z.string().optional(),
            imprintContent: z.string().optional(),
            cruciblePrompt: z.string().optional(),
            crucibleSample: z.string().optional(),
            visualAidUrl: z.string().optional(),
            shockImageUrl: z.string().optional(),
          }),
        }))
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') throw new Error('Admin access required');
          await updateCmakeModule(input.moduleNumber, input.data);
          return { success: true };
        }),
    }),
    quiz: router({
      getQuestions: publicProcedure
        .input(z.object({ moduleId: z.number() }))
        .query(async ({ input }) => {
          const questions = await getCmakeQuizQuestions(input.moduleId);
          return questions.map(q => ({
            ...q,
            options: JSON.parse(q.options) as string[],
          }));
        }),
      submit: protectedProcedure
        .input(z.object({
          moduleId: z.number(),
          answers: z.array(z.number()),
          timeTaken: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const questions = await getCmakeQuizQuestions(input.moduleId);
          let score = 0;
          const results = questions.map((q, i) => {
            const correct = input.answers[i] === q.correctAnswer;
            if (correct) score++;
            return {
              questionNumber: q.questionNumber,
              question: q.question,
              selectedAnswer: input.answers[i],
              correctAnswer: q.correctAnswer,
              correct,
              explanation: q.explanation,
              options: JSON.parse(q.options) as string[],
            };
          });
          await createCmakeQuizAttempt({
            userId: ctx.user.id,
            moduleId: input.moduleId,
            score,
            answers: JSON.stringify(input.answers),
            timeTaken: input.timeTaken,
          });
          const total = questions.length;
          const passed = score >= Math.ceil(total * 0.6);
          const certificatesAwarded = passed ? await checkAndAwardCmakeCertificates(ctx.user.id) : [];
          return { score, total, passed, results, certificatesAwarded };
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
          await createCmakeQuizQuestion({
            ...input,
            options: JSON.stringify(input.options),
          });
          return { success: true };
        }),
    }),
    progress: router({
      getModule: protectedProcedure
        .input(z.object({ moduleId: z.number() }))
        .query(async ({ ctx, input }) => {
          return getCmakeUserProgress(ctx.user.id, input.moduleId);
        }),
      getAll: protectedProcedure.query(async ({ ctx }) => {
        return getAllCmakeUserProgress(ctx.user.id);
      }),
      getDashboard: protectedProcedure.query(async ({ ctx }) => {
        return getCmakeDashboard(ctx.user.id);
      }),
      markComplete: protectedProcedure
        .input(z.object({
          moduleId: z.number(),
          section: z.enum(['spark', 'gauntlet', 'crucible', 'imprint']),
        }))
        .mutation(async ({ ctx, input }) => {
          await markCmakeSectionComplete(ctx.user.id, input.moduleId, input.section);
          const certificatesAwarded = await checkAndAwardCmakeCertificates(ctx.user.id);
          return { success: true, certificatesAwarded };
        }),
      submitCrucible: protectedProcedure
        .input(z.object({
          moduleId: z.number(),
          submission: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
          await createCmakeCrucibleSubmission({
            userId: ctx.user.id,
            moduleId: input.moduleId,
            submission: input.submission,
          });
          const certificatesAwarded = await checkAndAwardCmakeCertificates(ctx.user.id);
          return { success: true, certificatesAwarded };
        }),
    }),
    certificates: router({
      getAll: protectedProcedure.query(async ({ ctx }) => {
        return getCmakeUserCertificates(ctx.user.id);
      }),
      verify: publicProcedure
        .input(z.object({ code: z.string() }))
        .query(async ({ input }) => {
          return verifyCmakeCertificate(input.code);
        }),
    }),
  }),

  // Software Testing Fundamentals course
  stf: router({
    modules: router({
      getAll: publicProcedure.query(async () => {
        return getAllStfModules();
      }),
      getByTrack: publicProcedure
        .input(z.object({ track: z.enum(['foundations', 'sdlc_models', 'methodologies', 'techniques', 'professional_practice']) }))
        .query(async ({ input }) => {
          return getStfModulesByTrack(input.track);
        }),
      getByNumber: publicProcedure
        .input(z.object({ moduleNumber: z.number() }))
        .query(async ({ input }) => {
          return getStfModuleByNumber(input.moduleNumber);
        }),
    }),
    quiz: router({
      getQuestions: publicProcedure
        .input(z.object({ moduleId: z.number() }))
        .query(async ({ input }) => {
          const questions = await getStfQuizQuestions(input.moduleId);
          return questions.map(q => ({
            ...q,
            options: JSON.parse(q.options) as string[],
          }));
        }),
      submit: protectedProcedure
        .input(z.object({
          moduleId: z.number(),
          answers: z.array(z.number()),
          timeTaken: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const questions = await getStfQuizQuestions(input.moduleId);
          let score = 0;
          const results = questions.map((q, i) => {
            const correct = input.answers[i] === q.correctAnswer;
            if (correct) score++;
            return {
              questionNumber: q.questionNumber,
              question: q.question,
              selectedAnswer: input.answers[i],
              correctAnswer: q.correctAnswer,
              correct,
              explanation: q.explanation,
              options: JSON.parse(q.options) as string[],
            };
          });
          await createStfQuizAttempt({
            userId: ctx.user.id,
            moduleId: input.moduleId,
            score,
            answers: JSON.stringify(input.answers),
            timeTaken: input.timeTaken,
          });
          const total = questions.length;
          const passed = score >= Math.ceil(total * 0.6);
          const certificatesAwarded = passed ? await checkAndAwardStfCertificates(ctx.user.id) : [];
          return { score, total, passed, results, certificatesAwarded };
        }),
    }),
    game: router({
      submitScore: protectedProcedure
        .input(z.object({
          moduleId: z.number(),
          gameName: z.string(),
          score: z.number(),
          maxScore: z.number(),
          timeTaken: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          await createStfGameScore({
            userId: ctx.user.id,
            moduleId: input.moduleId,
            gameName: input.gameName,
            score: input.score,
            maxScore: input.maxScore,
            timeTaken: input.timeTaken,
          });
          const passed = Math.round((input.score / input.maxScore) * 100) >= 60;
          const certificatesAwarded = passed ? await checkAndAwardStfCertificates(ctx.user.id) : [];
          return { success: true, passed, certificatesAwarded };
        }),
      getScores: protectedProcedure
        .input(z.object({ moduleId: z.number().optional() }).optional())
        .query(async ({ ctx, input }) => {
          return getStfGameScores(ctx.user.id, input?.moduleId);
        }),
    }),
    exam: router({
      submit: protectedProcedure
        .input(z.object({
          answers: z.array(z.number()),
          timeTaken: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          // Get 2 random questions from each of the 15 modules = 30 questions
          const allModules = await getAllStfModules();
          const allQuestions: any[] = [];
          for (const mod of allModules) {
            const qs = await getStfQuizQuestions(mod.moduleNumber);
            // Pick 2 random questions from each module
            const shuffled = qs.sort(() => Math.random() - 0.5).slice(0, 2);
            allQuestions.push(...shuffled);
          }
          let score = 0;
          const results = allQuestions.map((q, i) => {
            const correct = input.answers[i] === q.correctAnswer;
            if (correct) score++;
            return {
              moduleId: q.moduleId,
              question: q.question,
              selectedAnswer: input.answers[i],
              correctAnswer: q.correctAnswer,
              correct,
              explanation: q.explanation,
              options: JSON.parse(q.options) as string[],
            };
          });
          const passed = score >= 21; // 70% of 30
          await createStfExamAttempt({
            userId: ctx.user.id,
            score,
            answers: JSON.stringify(input.answers),
            passed: passed ? 1 : 0,
            timeTaken: input.timeTaken,
          });
          if (passed) {
            await checkAndAwardStfCertificates(ctx.user.id);
          }
          return { score, total: 30, passed, results };
        }),
      getExamQuestions: protectedProcedure.query(async () => {
        // Get 2 random questions from each of the 15 modules = 30 questions
        const allModules = await getAllStfModules();
        const examQuestions: any[] = [];
        for (const mod of allModules) {
          const qs = await getStfQuizQuestions(mod.moduleNumber);
          const shuffled = qs.sort(() => Math.random() - 0.5).slice(0, 2);
          examQuestions.push(...shuffled.map(q => ({
            ...q,
            options: JSON.parse(q.options) as string[],
          })));
        }
        return examQuestions;
      }),
      getAttempts: protectedProcedure.query(async ({ ctx }) => {
        return getStfExamAttempts(ctx.user.id);
      }),
    }),
    progress: router({
      getModule: protectedProcedure
        .input(z.object({ moduleId: z.number() }))
        .query(async ({ ctx, input }) => {
          return getStfUserProgress(ctx.user.id, input.moduleId);
        }),
      getAll: protectedProcedure.query(async ({ ctx }) => {
        return getAllStfUserProgress(ctx.user.id);
      }),
      getDashboard: protectedProcedure.query(async ({ ctx }) => {
        return getStfDashboard(ctx.user.id);
      }),
      markComplete: protectedProcedure
        .input(z.object({
          moduleId: z.number(),
          section: z.enum(['spark', 'gauntlet', 'crucible', 'imprint']),
        }))
        .mutation(async ({ ctx, input }) => {
          await markStfSectionComplete(ctx.user.id, input.moduleId, input.section);
          const certificatesAwarded = await checkAndAwardStfCertificates(ctx.user.id);
          return { success: true, certificatesAwarded };
        }),
    }),
    certificates: router({
      getAll: protectedProcedure.query(async ({ ctx }) => {
        return getStfUserCertificates(ctx.user.id);
      }),
      verify: publicProcedure
        .input(z.object({ code: z.string() }))
        .query(async ({ input }) => {
          return verifyStfCertificate(input.code);
        }),
    }),
  }),
});
export type AppRouter = typeof appRouter;
