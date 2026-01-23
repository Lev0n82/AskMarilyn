import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { 
  Users, 
  BookOpen, 
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

export default function GraceAdmin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: users, isLoading: usersLoading } = trpc.graceAcademy.admin.getUsers.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === 'admin' }
  );
  const { data: submissions, isLoading: submissionsLoading, refetch: refetchSubmissions } = trpc.graceAcademy.crucible.getAllSubmissions.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === 'admin' }
  );
  const { data: modules } = trpc.graceAcademy.modules.getAll.useQuery();
  
  const reviewSubmission = trpc.graceAcademy.crucible.review.useMutation();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { data: userProgress } = trpc.graceAcademy.admin.getUserProgress.useQuery(
    { userId: selectedUser! },
    { enabled: !!selectedUser && isAuthenticated && user?.role === 'admin' }
  );

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    
    if (user?.role !== 'admin') {
      window.location.href = '/grace-academy';
    }
  }, [isAuthenticated, authLoading, user]);

  const handleReview = async (submissionId: number, status: 'approved' | 'needs_revision', feedback?: string) => {
    try {
      await reviewSubmission.mutateAsync({
        submissionId,
        status,
        feedback,
      });
      toast.success(`Submission ${status === 'approved' ? 'approved' : 'marked for revision'}`);
      refetchSubmissions();
    } catch (error) {
      toast.error('Failed to review submission');
    }
  };

  if (authLoading || usersLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  const pendingSubmissions = submissions?.filter(s => s.status === 'pending') || [];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">GRACE Academy</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">Admin Panel</h1>
          </div>
          <Link href="/grace-academy">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academy
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{users?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{modules?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Total Modules</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold">{submissions?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="submissions">
          <TabsList>
            <TabsTrigger value="submissions">Crucible Submissions</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-4">
            <h2 className="text-xl font-serif font-bold">Pending Reviews ({pendingSubmissions.length})</h2>
            
            {pendingSubmissions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>All submissions have been reviewed!</p>
                </CardContent>
              </Card>
            ) : (
              pendingSubmissions.map((submission: any) => (
                <Card key={submission.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Module {submission.moduleId} • Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">User ID: {submission.userId}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-600">
                        Pending
                      </span>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <p className="text-sm whitespace-pre-wrap">{submission.submission}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleReview(submission.id, 'approved')}
                        disabled={reviewSubmission.isPending}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReview(submission.id, 'needs_revision', 'Please revise your response.')}
                        disabled={reviewSubmission.isPending}
                      >
                        <XCircle className="mr-2 h-4 w-4" /> Request Revision
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <h2 className="text-xl font-serif font-bold">Students ({users?.length || 0})</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {users?.map((u: any) => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedUser(u.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedUser === u.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="font-medium">{u.name || 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(u.createdAt).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedUser ? (
                    userProgress ? (
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-3xl font-bold">
                            {userProgress.filter((p: any) => p.moduleCompleted).length}/30
                          </div>
                          <p className="text-sm text-muted-foreground">Modules Completed</p>
                        </div>
                        
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {[...Array(30)].map((_, idx) => {
                            const moduleNum = idx + 1;
                            const progress = userProgress.find((p: any) => p.moduleId === moduleNum);
                            return (
                              <div key={moduleNum} className="flex items-center justify-between p-2 border rounded">
                                <span>Module {moduleNum}</span>
                                {progress?.moduleCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    {progress ? 'In Progress' : 'Not Started'}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading progress...
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Select a student to view their progress
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <h2 className="text-xl font-serif font-bold">Module Content</h2>
            
            <div className="grid gap-4">
              {modules?.map((module: any) => (
                <Card key={module.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          module.track === 'foundation' ? 'bg-blue-500/20 text-blue-600' :
                          module.track === 'intermediate' ? 'bg-amber-500/20 text-amber-600' :
                          'bg-purple-500/20 text-purple-600'
                        }`}>
                          {module.track}
                        </span>
                        <h3 className="font-medium mt-2">Module {module.moduleNumber}: {module.title}</h3>
                        {module.subtitle && (
                          <p className="text-sm text-muted-foreground">{module.subtitle}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {module.sparkContent ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>Content</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
