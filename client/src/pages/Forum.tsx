import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { MessageSquare, Plus, User, Clock, HelpCircle, Lightbulb, MessageCircle, Loader2, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";

function getCategoryIcon(category: string) {
  switch (category) {
    case "question":
      return <HelpCircle className="h-4 w-4 text-blue-500" />;
    case "example":
      return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    case "discussion":
      return <MessageCircle className="h-4 w-4 text-green-500" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
}

function getCategoryLabel(category: string) {
  switch (category) {
    case "question":
      return "Question";
    case "example":
      return "Example";
    case "discussion":
      return "Discussion";
    default:
      return category;
  }
}

function NewPostDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"question" | "example" | "discussion">("question");

  const createPostMutation = trpc.forum.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post created successfully!");
      setOpen(false);
      setTitle("");
      setContent("");
      setCategory("question");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create post");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate({ title, content, category });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-serif">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">Create a New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={(v) => setCategory(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="example">Example</SelectItem>
                <SelectItem value="discussion">Discussion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question or topic?"
              required
              minLength={5}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide details, context, or your example..."
              rows={5}
              required
              minLength={10}
            />
          </div>
          <Button type="submit" className="w-full" disabled={createPostMutation.isPending}>
            {createPostMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PostDetail({ postId, onBack }: { postId: number; onBack: () => void }) {
  const { isAuthenticated } = useAuth();
  const [replyContent, setReplyContent] = useState("");
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.forum.getPost.useQuery({ postId });

  const addReplyMutation = trpc.forum.addReply.useMutation({
    onSuccess: () => {
      toast.success("Reply added!");
      setReplyContent("");
      utils.forum.getPost.invalidate({ postId });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add reply");
    },
  });

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    addReplyMutation.mutate({ postId, content: replyContent });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Post not found.</p>
        <Button variant="ghost" onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>
      </div>
    );
  }

  const { post, replies } = data;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Forum
      </Button>

      <Card className="border-border paper-shadow">
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            {getCategoryIcon(post.category)}
            <span>{getCategoryLabel(post.category)}</span>
          </div>
          <CardTitle className="font-serif text-xl">{post.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {post.userName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{post.content}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg">
          {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
        </h3>

        {replies.map((reply) => (
          <Card key={reply.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {reply.userName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(reply.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{reply.content}</p>
            </CardContent>
          </Card>
        ))}

        {isAuthenticated ? (
          <form onSubmit={handleReply} className="space-y-4">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              rows={3}
              required
            />
            <Button type="submit" disabled={addReplyMutation.isPending || !replyContent.trim()}>
              {addReplyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Reply"
              )}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Sign in to reply to this post.
          </p>
        )}
      </div>
    </div>
  );
}

export default function Forum() {
  const { isAuthenticated } = useAuth();
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const utils = trpc.useUtils();

  const { data: posts, isLoading } = trpc.forum.getPosts.useQuery({});

  // Filter posts based on search query
  const filteredPosts = posts?.filter((post) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  });

  if (selectedPostId !== null) {
    return (
      <Layout>
        <PostDetail postId={selectedPostId} onBack={() => setSelectedPostId(null)} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Discussion Forum</h1>
            <p className="text-muted-foreground mt-1">
              Ask questions, share examples, and discuss ABT concepts.
            </p>
          </div>
          {isAuthenticated && (
            <NewPostDialog onSuccess={() => utils.forum.getPosts.invalidate()} />
          )}
        </section>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts by title, content, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !filteredPosts || filteredPosts.length === 0 ? (
          <Card className="border-border paper-shadow">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-serif">
                No posts yet. Be the first to start a discussion!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="border-border paper-shadow cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedPostId(post.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        {getCategoryIcon(post.category)}
                        <span>{getCategoryLabel(post.category)}</span>
                      </div>
                      <h3 className="font-serif font-semibold hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
