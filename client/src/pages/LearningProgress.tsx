import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { 
  Trophy, Target, Brain, Zap, CheckCircle, XCircle, 
  TrendingUp, Award, BookOpen, FileCode, MessageSquareText, PenTool,
  ArrowRight, Baby, Users, Clock, BarChart3, Medal
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  topics: string[];
  color: string;
}

const COURSES: CourseInfo[] = [
  {
    id: "coding-style",
    name: "C# Coding Style Guide",
    icon: <FileCode className="w-5 h-5" />,
    path: "/coding-style-guide",
    topics: ["file-organization", "indentation", "naming-conventions", "statements", "white-space"],
    color: "coral"
  },
  {
    id: "commenting",
    name: "The Fine Art of Commenting",
    icon: <MessageSquareText className="w-5 h-5" />,
    path: "/commenting-guide",
    topics: ["case-against", "comment-types", "style-guidelines", "xml-comments"],
    color: "teal"
  },
  {
    id: "technical-writing",
    name: "Technical Writing Made Easier",
    icon: <PenTool className="w-5 h-5" />,
    path: "/technical-writing-guide",
    topics: ["three-pillars", "readability", "comprehensibility", "style", "structure"],
    color: "amber"
  }
];

export default function LearningProgress() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: quizStats } = trpc.quiz.getStats.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: quizAttempts } = trpc.quiz.getAttempts.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: spacedRepStats } = trpc.spacedRepetition.getStats.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: dueReviews } = trpc.spacedRepetition.getDueReviews.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: communityStats } = trpc.community.getStats.useQuery(undefined, {
    enabled: !!user,
  });

  // Get user rank for each course
  const { data: codingStyleRank } = trpc.community.getUserRank.useQuery(
    { courseId: "coding-style" },
    { enabled: !!user }
  );
  const { data: commentingRank } = trpc.community.getUserRank.useQuery(
    { courseId: "commenting" },
    { enabled: !!user }
  );
  const { data: technicalWritingRank } = trpc.community.getUserRank.useQuery(
    { courseId: "technical-writing" },
    { enabled: !!user }
  );

  const courseRanks: Record<string, any> = {
    "coding-style": codingStyleRank,
    "commenting": commentingRank,
    "technical-writing": technicalWritingRank,
  };

  // Calculate per-course stats
  const getCourseStats = (courseId: string) => {
    if (!quizAttempts) return { completed: 0, total: 0, passed: 0, failed: 0, eli5Used: 0 };
    
    const courseAttempts = quizAttempts.filter(a => a.courseId === courseId);
    const passedTopics = new Set(
      courseAttempts.filter(a => a.isCorrect === 1).map(a => a.topicId)
    );
    const eli5Topics = courseAttempts.filter(a => a.usedSimplifiedExplanation === 1);
    
    const course = COURSES.find(c => c.id === courseId);
    const totalTopics = course?.topics.length || 0;
    
    return {
      completed: passedTopics.size,
      total: totalTopics,
      passed: courseAttempts.filter(a => a.isCorrect === 1).length,
      failed: courseAttempts.filter(a => a.isCorrect === 0).length,
      eli5Used: eli5Topics.length,
    };
  };

  // Get community stats for a course
  const getCommunityStatsForCourse = (courseId: string) => {
    if (!communityStats) return null;
    return communityStats.find(s => s.courseId === courseId && !s.topicId);
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold mb-4">Track Your Learning Progress</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to track your quiz results, see your progress across courses, and earn achievements.
          </p>
          <Button asChild>
            <a href="/api/auth/login">Sign In to Get Started</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Learning Progress</h1>
          <p className="text-muted-foreground">
            Track your journey through the bonus courses. Complete quizzes to demonstrate mastery.
          </p>
        </header>

        {/* Spaced Repetition Alert */}
        {dueReviews && dueReviews.length > 0 && (
          <Card className="mb-6 border-amber-400 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-800">Reviews Due!</h3>
                    <p className="text-sm text-amber-700">
                      You have {dueReviews.length} question{dueReviews.length !== 1 ? 's' : ''} ready for spaced repetition review.
                    </p>
                  </div>
                </div>
                <Link href={`/${COURSES.find(c => c.id === dueReviews[0]?.courseId)?.path.slice(1) || 'coding-style-guide'}`}>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Start Review
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{quizStats?.totalAttempts || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{quizStats?.correctAttempts || 0}</p>
                  <p className="text-xs text-muted-foreground">Correct Answers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{quizStats?.accuracy || 0}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Baby className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{quizStats?.eli5Used || 0}</p>
                  <p className="text-xs text-muted-foreground">ELI5 Used</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spaced Repetition Stats */}
        {spacedRepStats && spacedRepStats.totalItems > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Spaced Repetition Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-2xl font-bold text-amber-600">{spacedRepStats.dueCount}</p>
                  <p className="text-xs text-amber-700">Due Now</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">{spacedRepStats.pendingCount}</p>
                  <p className="text-xs text-blue-700">Pending Review</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-600">{spacedRepStats.masteredCount}</p>
                  <p className="text-xs text-green-700">Mastered</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-2xl font-bold text-slate-600">{spacedRepStats.totalItems}</p>
                  <p className="text-xs text-slate-700">Total Items</p>
                </div>
              </div>
              {spacedRepStats.totalItems > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Mastery Progress</span>
                    <span className="font-medium">
                      {Math.round((spacedRepStats.masteredCount / spacedRepStats.totalItems) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(spacedRepStats.masteredCount / spacedRepStats.totalItems) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Course Progress Cards with Peer Comparison */}
        <h2 className="font-display text-2xl font-bold mb-4">Course Progress</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {COURSES.map((course) => {
            const stats = getCourseStats(course.id);
            const progressPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
            const communityData = getCommunityStatsForCourse(course.id);
            const userRank = courseRanks[course.id];
            
            return (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {course.icon}
                    </div>
                    <span className="text-lg">{course.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Topics Completed</span>
                        <span className="font-medium">{stats.completed} / {stats.total}</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-muted/30 rounded">
                        <p className="text-lg font-bold text-teal">{stats.passed}</p>
                        <p className="text-xs text-muted-foreground">Passed</p>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <p className="text-lg font-bold text-coral">{stats.failed}</p>
                        <p className="text-xs text-muted-foreground">Failed</p>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <p className="text-lg font-bold text-amber-500">{stats.eli5Used}</p>
                        <p className="text-xs text-muted-foreground">ELI5</p>
                      </div>
                    </div>

                    {/* Peer Comparison Section */}
                    {(communityData || userRank) && (
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">Compare with Peers</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          {communityData && (
                            <div className="p-2 bg-white/50 rounded">
                              <p className="text-sm font-bold text-blue-600">{communityData.averageAccuracy}%</p>
                              <p className="text-xs text-blue-700">Community Avg</p>
                            </div>
                          )}
                          {userRank && userRank.rank > 0 && (
                            <div className="p-2 bg-white/50 rounded">
                              <p className="text-sm font-bold text-indigo-600">Top {100 - userRank.percentile}%</p>
                              <p className="text-xs text-indigo-700">Your Rank</p>
                            </div>
                          )}
                        </div>
                        {userRank && userRank.userAccuracy > 0 && communityData && (
                          <div className="mt-2 text-center">
                            <span className={`text-xs font-medium ${userRank.userAccuracy >= communityData.averageAccuracy ? 'text-green-600' : 'text-amber-600'}`}>
                              {userRank.userAccuracy >= communityData.averageAccuracy 
                                ? `🎉 You're ${userRank.userAccuracy - communityData.averageAccuracy}% above average!`
                                : `📈 ${communityData.averageAccuracy - userRank.userAccuracy}% to reach average`
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <Link href={course.path}>
                      <Button variant="outline" className="w-full gap-2">
                        {stats.completed === 0 ? "Start Course" : "Continue Learning"}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Community Leaderboard Preview */}
        {communityStats && communityStats.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Community Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {COURSES.map(course => {
                  const stats = getCommunityStatsForCourse(course.id);
                  if (!stats) return null;
                  
                  return (
                    <div key={course.id} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        {course.icon}
                        <span className="font-medium text-sm">{course.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                          <p className="text-lg font-bold">{stats.totalUsers}</p>
                          <p className="text-xs text-muted-foreground">Learners</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{stats.averageAccuracy}%</p>
                          <p className="text-xs text-muted-foreground">Avg Accuracy</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{stats.eli5UsageRate}%</p>
                          <p className="text-xs text-muted-foreground">ELI5 Rate</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{stats.averageAttemptsToPass}</p>
                          <p className="text-xs text-muted-foreground">Avg Attempts</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Quiz Activity */}
        <h2 className="font-display text-2xl font-bold mb-4">Recent Quiz Activity</h2>
        <Card>
          <CardContent className="pt-6">
            {!quizAttempts || quizAttempts.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No quiz attempts yet. Start a course to begin tracking your progress!
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/coding-style-guide">
                    <Button variant="outline">Start Coding Style Guide</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {quizAttempts.slice(0, 10).map((attempt, index) => {
                  const course = COURSES.find(c => c.id === attempt.courseId);
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {attempt.isCorrect === 1 ? (
                          <CheckCircle className="w-5 h-5 text-teal" />
                        ) : (
                          <XCircle className="w-5 h-5 text-coral" />
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {course?.name || attempt.courseId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Topic: {attempt.topicId.replace(/-/g, ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {attempt.usedSimplifiedExplanation === 1 && (
                          <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-1 rounded">
                            ELI5 Used
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Attempt #{attempt.attemptNumber}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievement Hints */}
        <h2 className="font-display text-2xl font-bold mt-8 mb-4">Achievements</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={`${(quizStats?.totalAttempts || 0) >= 1 ? 'border-teal/50 bg-teal/5' : 'opacity-50'}`}>
            <CardContent className="pt-6 text-center">
              <Award className={`w-10 h-10 mx-auto mb-2 ${(quizStats?.totalAttempts || 0) >= 1 ? 'text-teal' : 'text-muted-foreground'}`} />
              <p className="font-bold">First Steps</p>
              <p className="text-xs text-muted-foreground">Complete your first quiz</p>
            </CardContent>
          </Card>

          <Card className={`${(quizStats?.accuracy || 0) >= 80 && (quizStats?.totalAttempts || 0) >= 5 ? 'border-teal/50 bg-teal/5' : 'opacity-50'}`}>
            <CardContent className="pt-6 text-center">
              <Trophy className={`w-10 h-10 mx-auto mb-2 ${(quizStats?.accuracy || 0) >= 80 && (quizStats?.totalAttempts || 0) >= 5 ? 'text-teal' : 'text-muted-foreground'}`} />
              <p className="font-bold">Sharp Mind</p>
              <p className="text-xs text-muted-foreground">80%+ accuracy (5+ attempts)</p>
            </CardContent>
          </Card>

          <Card className={`${(quizStats?.uniqueTopics || 0) >= 10 ? 'border-teal/50 bg-teal/5' : 'opacity-50'}`}>
            <CardContent className="pt-6 text-center">
              <Zap className={`w-10 h-10 mx-auto mb-2 ${(quizStats?.uniqueTopics || 0) >= 10 ? 'text-teal' : 'text-muted-foreground'}`} />
              <p className="font-bold">Explorer</p>
              <p className="text-xs text-muted-foreground">Complete 10 different topics</p>
            </CardContent>
          </Card>

          <Card className={`${(quizStats?.eli5Used || 0) >= 3 ? 'border-amber-500/50 bg-amber-500/5' : 'opacity-50'}`}>
            <CardContent className="pt-6 text-center">
              <Baby className={`w-10 h-10 mx-auto mb-2 ${(quizStats?.eli5Used || 0) >= 3 ? 'text-amber-500' : 'text-muted-foreground'}`} />
              <p className="font-bold">Humble Learner</p>
              <p className="text-xs text-muted-foreground">Use ELI5 explanations 3 times</p>
            </CardContent>
          </Card>

          <Card className={`${spacedRepStats && spacedRepStats.masteredCount >= 5 ? 'border-green-500/50 bg-green-500/5' : 'opacity-50'}`}>
            <CardContent className="pt-6 text-center">
              <Medal className={`w-10 h-10 mx-auto mb-2 ${spacedRepStats && spacedRepStats.masteredCount >= 5 ? 'text-green-500' : 'text-muted-foreground'}`} />
              <p className="font-bold">Memory Master</p>
              <p className="text-xs text-muted-foreground">Master 5 items via spaced repetition</p>
            </CardContent>
          </Card>
        </div>

        {/* Certificate Link */}
        <div className="mt-8 text-center">
          <Link href="/course-certificate">
            <Button variant="outline" size="lg" className="gap-2">
              <Award className="w-5 h-5" />
              View Your Certificates
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
