import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function PlatformEngineering() {
  usePageMeta({
    title: "Systems Architecture - Platform Engineering",
    description: "Educational module on platform engineering principles. Part of GRACE Academy curriculum.",
    keywords: "platform engineering education, DevOps training, systems architecture course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/systems-architect" className="hover:text-primary">Systems Architect</Link>
          <span>/</span>
          <span className="text-foreground">Module 2</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary">
            Platform Engineering: Building the Golden Path
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~25 min read
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              5 quizzes
            </span>
          </div>
        </header>

        {/* Reader's Dilemma */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Reader's Dilemma
          </h2>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                Our developers spend more time fighting with infrastructure than writing code. Every team has their own way of deploying, their own CI/CD pipelines, their own monitoring setup. It's chaos. I've heard about "Platform Engineering" but isn't that just DevOps with a new name?
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">D</span>evOps was about breaking down silos between development and operations. Platform Engineering is about building the road those teams travel on. The difference is profound: DevOps is a culture, Platform Engineering is a product.
            </p>
            <p className="font-sans leading-relaxed">
              Think of it this way: DevOps says "developers and ops should collaborate." Platform Engineering says "let's build a self-service platform so developers don't need to collaborate on routine tasks—they can just do them."
            </p>
          </div>
        </section>

        {/* The Spark: Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding Platform Engineering
          </h2>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">The Internal Developer Platform (IDP)</h3>
            <p className="font-sans leading-relaxed">
              At the heart of Platform Engineering is the <strong>Internal Developer Platform (IDP)</strong>—a self-service layer that abstracts away infrastructure complexity:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Layer</th>
                    <th className="border border-border p-3 text-left">Purpose</th>
                    <th className="border border-border p-3 text-left">Examples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-bold">Developer Portal</td>
                    <td className="border border-border p-3">Single entry point for all platform services</td>
                    <td className="border border-border p-3">Backstage, Port, Cortex</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Service Catalog</td>
                    <td className="border border-border p-3">Registry of all services, owners, and dependencies</td>
                    <td className="border border-border p-3">API docs, runbooks, SLOs</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Self-Service Actions</td>
                    <td className="border border-border p-3">Automated workflows for common tasks</td>
                    <td className="border border-border p-3">Create repo, deploy service, provision database</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Infrastructure Abstraction</td>
                    <td className="border border-border p-3">Hide complexity behind simple interfaces</td>
                    <td className="border border-border p-3">Terraform modules, Crossplane, Pulumi</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="systems-architect"
              topicId="platform-engineering"
              question="What is the primary purpose of an Internal Developer Platform (IDP)?"
              options={[
                "To replace the operations team entirely",
                "To provide self-service capabilities that abstract infrastructure complexity",
                "To enforce strict control over what developers can do",
                "To reduce the number of developers needed"
              ]}
              correctAnswer={1}
              explanation="An IDP provides self-service capabilities that abstract away infrastructure complexity, allowing developers to focus on writing code rather than managing infrastructure."
              eli5Explanation="Imagine a restaurant kitchen where chefs had to grow their own vegetables, raise their own chickens, and build their own ovens. An IDP is like having a fully stocked kitchen with all the tools ready—chefs just cook!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">The Golden Path</h3>
            <p className="font-sans leading-relaxed">
              The <strong>Golden Path</strong> is a pre-paved, opinionated way to build and deploy applications. It's not mandatory, but it's the path of least resistance:
            </p>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-bold mb-3">Golden Path Characteristics:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Opinionated but not enforced:</strong> Teams can deviate if they have good reasons</li>
                  <li><strong>Well-documented:</strong> Clear guides, templates, and examples</li>
                  <li><strong>Automated:</strong> One-click or minimal-click setup</li>
                  <li><strong>Maintained:</strong> Platform team keeps it updated and secure</li>
                  <li><strong>Observable:</strong> Built-in monitoring, logging, and alerting</li>
                </ul>
              </CardContent>
            </Card>

            <p className="font-sans leading-relaxed">
              The key insight is that <strong>constraints enable creativity</strong>. When developers don't have to think about infrastructure, they can focus entirely on solving business problems.
            </p>

            <MicroQuiz
              courseId="systems-architect"
              topicId="platform-engineering"
              question="What makes a 'Golden Path' different from a mandatory standard?"
              options={[
                "Golden Paths are more expensive to implement",
                "Golden Paths are opinionated but not enforced—teams can deviate with good reasons",
                "Golden Paths only work for small teams",
                "Golden Paths require special hardware"
              ]}
              correctAnswer={1}
              explanation="A Golden Path is the recommended, well-supported way to do things, but teams can deviate if they have valid reasons. It's about making the right thing easy, not making the wrong thing impossible."
              eli5Explanation="It's like a hiking trail in a park. The marked trail is the easiest, safest way to get to the viewpoint. You CAN go off-trail if you're experienced and have a reason, but most people happily take the nice, maintained path."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Platform as a Product</h3>
            <p className="font-sans leading-relaxed">
              The most important mindset shift in Platform Engineering is treating the platform as a <strong>product</strong> with developers as <strong>customers</strong>:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-destructive">
                <CardContent className="p-4">
                  <h4 className="font-bold text-destructive">Old Mindset ❌</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                    <li>"Developers must use our tools"</li>
                    <li>"We know what's best for them"</li>
                    <li>"File a ticket and wait"</li>
                    <li>"Read the documentation"</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold text-green-600">Product Mindset ✓</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                    <li>"How can we make their lives easier?"</li>
                    <li>"What do they actually need?"</li>
                    <li>"Self-service in minutes"</li>
                    <li>"Intuitive UX, docs as backup"</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <MicroQuiz
              courseId="systems-architect"
              topicId="platform-engineering"
              question="Why should platform teams treat their platform as a 'product'?"
              options={[
                "So they can charge developers for using it",
                "Because it forces them to focus on developer experience and adoption",
                "Because products are more profitable",
                "To compete with external cloud providers"
              ]}
              correctAnswer={1}
              explanation="Treating the platform as a product forces the team to focus on developer experience, gather feedback, iterate on features, and drive adoption—just like any successful product."
              eli5Explanation="If you're making a toy and nobody wants to play with it, you've failed. Platform teams need to think the same way: if developers don't WANT to use the platform, it doesn't matter how technically impressive it is."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Key Platform Engineering Patterns</h3>

            <div className="space-y-4">
              <Card className="border-border">
                <CardContent className="p-4">
                  <h4 className="font-bold">1. Template-Based Scaffolding</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Provide project templates that include CI/CD, monitoring, security scanning, and deployment configs out of the box. Developers run one command and get a production-ready starting point.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4">
                  <h4 className="font-bold">2. GitOps for Everything</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    All infrastructure and application state is declared in Git. Changes are made via pull requests, reviewed, and automatically applied. No manual kubectl or terraform commands.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4">
                  <h4 className="font-bold">3. Composable Infrastructure</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Instead of monolithic infrastructure, provide building blocks (database, cache, queue, storage) that developers can compose. Think Lego, not pre-built models.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4">
                  <h4 className="font-bold">4. Paved Road Security</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Security is built into the Golden Path by default. Developers don't need to think about secrets management, network policies, or vulnerability scanning—it's automatic.
                  </p>
                </CardContent>
              </Card>
            </div>

            <MicroQuiz
              courseId="systems-architect"
              topicId="platform-engineering"
              question="What is the benefit of 'GitOps for Everything' in platform engineering?"
              options={[
                "It makes Git repositories larger",
                "All changes are version-controlled, reviewable, and automatically applied",
                "It eliminates the need for Git",
                "It only works for small projects"
              ]}
              correctAnswer={1}
              explanation="GitOps ensures all infrastructure and application changes go through Git, providing version control, code review, audit trails, and automated deployment."
              eli5Explanation="Imagine if every change to your house had to be written down, approved by your family, and then a robot would make the change exactly as specified. That's GitOps—no surprises, everything documented, easy to undo mistakes."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Measuring Platform Success</h3>
            <p className="font-sans leading-relaxed">
              How do you know if your platform is successful? Track these metrics:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Metric</th>
                    <th className="border border-border p-3 text-left">What It Measures</th>
                    <th className="border border-border p-3 text-left">Target</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-bold">Time to First Deploy</td>
                    <td className="border border-border p-3">How long from "new project" to "running in production"</td>
                    <td className="border border-border p-3">&lt; 1 day</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Developer NPS</td>
                    <td className="border border-border p-3">Would developers recommend the platform?</td>
                    <td className="border border-border p-3">&gt; 50</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Golden Path Adoption</td>
                    <td className="border border-border p-3">% of services using the recommended path</td>
                    <td className="border border-border p-3">&gt; 80%</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Self-Service Rate</td>
                    <td className="border border-border p-3">% of requests handled without platform team involvement</td>
                    <td className="border border-border p-3">&gt; 90%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="systems-architect"
              topicId="platform-engineering"
              question="Why is 'Developer NPS' an important metric for platform teams?"
              options={[
                "It determines the platform team's budget",
                "It measures whether developers actually want to use the platform",
                "It's required by compliance regulations",
                "It measures how fast the platform runs"
              ]}
              correctAnswer={1}
              explanation="Developer NPS (Net Promoter Score) measures satisfaction and willingness to recommend. A platform that developers don't want to use will fail regardless of its technical capabilities."
              eli5Explanation="If you ask kids 'Would you tell your friends about this playground?' and they all say 'No way!', you know you need to fix the playground. Developer NPS is the same question for your platform."
            />
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/systems-architect/agentic-ai">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: Agentic AI
            </Button>
          </Link>
          <Link href="/systems-architect/green-computing">
            <Button className="gap-2">
              Next: Green Computing
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </Layout>
  );
}
