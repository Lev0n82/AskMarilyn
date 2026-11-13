import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function AgenticAI() {
  usePageMeta({
    title: "Systems Architecture - Agentic AI",
    description: "Educational module on agentic AI systems architecture. Part of GRACE Academy curriculum.",
    keywords: "agentic AI education, AI architecture training, systems design course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/systems-architect" className="hover:text-primary">Systems Architect</Link>
          <span>/</span>
          <span className="text-foreground">Module 1</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary">
            Agentic AI Patterns: The Autonomous Workforce
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~20 min read
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              5 quizzes
            </span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
          <img 
            src="https://private-us-east-1.manuscdn.com/sessionFile/RxwaLFayIQR6GE8u9S69uF/sandbox/x0V79wguIvf70RcKZIWAdw-img-2_1770154328000_na1fn_c3lzdGVtcy1hcmNoaXRlY3QtYWdlbnRpYy1haQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUnh3YUxGYXlJUVI2R0U4dTlTNjl1Ri9zYW5kYm94L3gwVjc5d2d1SXZmNzBSY0taSVdBZHctaW1nLTJfMTc3MDE1NDMyODAwMF9uYTFmbl9jM2x6ZEdWdGN5MWhjbU5vYVhSbFkzUXRZV2RsYm5ScFl5MWhhUS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=MzgbhczwrP8g6-4NKYFKg3wcKRB-xt-14JDpne2VJPyvDLJkz~KGSOBiJzn8UHC8YBXLJ8kwNMIdKkJKl9U6ztHKfrYop2u6eHsOna7ym1UP8F557VkGqIxJ8M~dgRR5nQ2fIRLoeMDdVtzNH-7xEY2usuan9H5NZ2qgpPjG8mDkoojqEPwWIzHLdzrbzlEjeZ7F2s5ot-bLla21piG5dpBawZaa0xTWDxLJw3x1NmdgifjtJkZCGnFUpIrLz0b1b8jgq08DKUr-SS-38FBWyyTDueXZF6yooTo8LQlfXQsJ2ugkeVHmx~RrLTid0tjZkr5DS6SBpkbhYfqdLTp4uQ__" 
            alt="Agentic AI - Autonomous agents planning and executing complex workflows"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Reader's Dilemma */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Reader's Dilemma
          </h2>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="font-sans text-card-foreground leading-relaxed">
                <span className="font-bold block mb-2">Dear Marilyn,</span>
                Everyone is talking about "AI Agents" now. I understand chatbots and simple automation, but what makes an agent different? And how do I design systems that can actually leverage these autonomous AI workers without creating chaos?
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">T</span>he difference between a chatbot and an agent is like the difference between a calculator and a mathematician. A calculator performs operations you specify. A mathematician understands the problem, plans an approach, executes steps, and adjusts based on results.
            </p>
            <p className="font-sans leading-relaxed">
              Agentic AI represents a paradigm shift from <strong>reactive</strong> to <strong>proactive</strong> systems. Let's explore the patterns that make this possible.
            </p>
          </div>
        </section>

        {/* The Spark: Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding Agentic AI
          </h2>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">What Makes an Agent "Agentic"?</h3>
            <p className="font-sans leading-relaxed">
              An AI agent possesses four fundamental capabilities that distinguish it from traditional automation:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Capability</th>
                    <th className="border border-border p-3 text-left">Description</th>
                    <th className="border border-border p-3 text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-bold">Perception</td>
                    <td className="border border-border p-3">Ability to observe and interpret the environment</td>
                    <td className="border border-border p-3">Reading emails, parsing documents, monitoring systems</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Reasoning</td>
                    <td className="border border-border p-3">Ability to analyze information and make decisions</td>
                    <td className="border border-border p-3">Determining priority, identifying patterns, planning steps</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Action</td>
                    <td className="border border-border p-3">Ability to execute tasks and interact with systems</td>
                    <td className="border border-border p-3">Calling APIs, writing code, sending messages</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Learning</td>
                    <td className="border border-border p-3">Ability to improve from experience and feedback</td>
                    <td className="border border-border p-3">Refining approaches, remembering preferences, adapting strategies</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="systems-architect"
              topicId="agentic-ai"
              question="What distinguishes an AI agent from a simple chatbot?"
              options={[
                "Agents use more powerful language models",
                "Agents can perceive, reason, act, and learn autonomously",
                "Agents have better user interfaces",
                "Agents are always connected to the internet"
              ]}
              correctAnswer={1}
              explanation="AI agents are distinguished by their ability to autonomously perceive their environment, reason about information, take actions, and learn from experience - unlike chatbots which simply respond to inputs."
              eli5Explanation="Think of it like this: a chatbot is like a vending machine - you press a button, you get a specific response. An agent is like a personal assistant who can observe what's happening, think about what needs to be done, take action, and learn from the results to do better next time."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">The ReAct Pattern: Reasoning + Acting</h3>
            <p className="font-sans leading-relaxed">
              The <strong>ReAct (Reasoning and Acting)</strong> pattern is the foundation of most agentic systems. It interleaves thinking with doing:
            </p>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`# ReAct Loop Pseudocode
while task_not_complete:
    # THOUGHT: Reason about the current state
    thought = llm.think(f"""
        Task: {task}
        Observations: {observations}
        What should I do next and why?
    """)
    
    # ACTION: Choose and execute an action
    action = llm.decide_action(thought, available_tools)
    result = execute_action(action)
    
    # OBSERVE: Update understanding based on result
    observations.append(result)
    
    # REFLECT: Determine if task is complete
    if is_task_complete(observations):
        break`}
                </pre>
              </CardContent>
            </Card>

            <p className="font-sans leading-relaxed">
              This pattern prevents the agent from blindly executing a predetermined plan. Instead, it continuously adapts based on what it observes.
            </p>

            <MicroQuiz
              courseId="systems-architect"
              topicId="agentic-ai"
              question="In the ReAct pattern, what happens after an agent executes an action?"
              options={[
                "The agent immediately executes the next action",
                "The agent terminates the loop",
                "The agent observes the result and reasons about what to do next",
                "The agent waits for human approval"
              ]}
              correctAnswer={2}
              explanation="The ReAct pattern interleaves reasoning and acting - after each action, the agent observes the result and reasons about what to do next, enabling adaptive behavior."
              eli5Explanation="ReAct is like cooking while tasting. You don't just follow the recipe blindly - you taste after each step, think about whether it needs more salt, add it if needed, taste again. The agent does the same: act, observe, think, repeat."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Tool Use: Extending Agent Capabilities</h3>
            <p className="font-sans leading-relaxed">
              Agents become truly powerful when they can use <strong>tools</strong>. Tools are functions or APIs that extend what an agent can do:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-border">
                <CardContent className="p-4">
                  <h4 className="font-bold mb-2">Information Tools</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Web search</li>
                    <li>Database queries</li>
                    <li>API calls</li>
                    <li>File reading</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <h4 className="font-bold mb-2">Action Tools</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Code execution</li>
                    <li>Email sending</li>
                    <li>File writing</li>
                    <li>System commands</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`# Tool Definition Example
tools = [
    {
        "name": "search_web",
        "description": "Search the web for information",
        "parameters": {
            "query": "string - the search query"
        }
    },
    {
        "name": "execute_sql",
        "description": "Execute a SQL query on the database",
        "parameters": {
            "query": "string - the SQL query to execute"
        }
    },
    {
        "name": "send_email",
        "description": "Send an email to a recipient",
        "parameters": {
            "to": "string - recipient email",
            "subject": "string - email subject",
            "body": "string - email body"
        }
    }
]`}
                </pre>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="systems-architect"
              topicId="agentic-ai"
              question="Why are tools essential for agentic AI systems?"
              options={[
                "Tools make the AI faster",
                "Tools allow agents to interact with the real world beyond text generation",
                "Tools are required by law",
                "Tools reduce the cost of running AI models"
              ]}
              correctAnswer={1}
              explanation="Tools extend an agent's capabilities beyond text generation, allowing it to search the web, execute code, send emails, and interact with external systems."
              eli5Explanation="An AI without tools is like a person locked in a room who can only talk. They might be brilliant, but they can't actually DO anything. Tools are like giving them a phone, a computer, and access to the outside world - now they can actually accomplish tasks."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Multi-Agent Orchestration</h3>
            <p className="font-sans leading-relaxed">
              Complex tasks often require multiple specialized agents working together. This is where <strong>orchestration patterns</strong> become crucial:
            </p>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <h4 className="font-bold">Supervisor Pattern</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    A "manager" agent delegates tasks to specialized worker agents and coordinates their outputs. Best for hierarchical workflows with clear task decomposition.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary">
                <CardContent className="p-4">
                  <h4 className="font-bold">Swarm Pattern</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Agents communicate peer-to-peer without central coordination. Best for emergent behavior and parallel exploration of solution spaces.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-4">
                  <h4 className="font-bold">Pipeline Pattern</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Each agent processes output from the previous agent in a chain. Best for sequential workflows where each step transforms the data.
                  </p>
                </CardContent>
              </Card>
            </div>

            <MicroQuiz
              courseId="systems-architect"
              topicId="agentic-ai"
              question="Which orchestration pattern would be best for a code review system where code is analyzed, then tested, then documented?"
              options={[
                "Supervisor Pattern - because it needs a manager",
                "Swarm Pattern - because agents should work independently",
                "Pipeline Pattern - because each step transforms the output sequentially",
                "No pattern - a single agent should handle everything"
              ]}
              correctAnswer={2}
              explanation="The Pipeline Pattern is ideal for sequential workflows where each step transforms the data before passing it to the next stage."
              eli5Explanation="Think of it like an assembly line in a factory. The code goes to the analyzer first, then the output goes to the tester, then that output goes to the documenter. Each station does one job and passes it along - that's a pipeline!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Safety and Guardrails</h3>
            <p className="font-sans leading-relaxed">
              Autonomous agents require careful safety considerations. Key guardrail patterns include:
            </p>

            <ul className="list-disc list-inside space-y-2">
              <li><strong>Human-in-the-Loop:</strong> Require human approval for high-stakes actions</li>
              <li><strong>Sandboxing:</strong> Limit what tools and resources an agent can access</li>
              <li><strong>Rate Limiting:</strong> Prevent runaway loops or excessive resource consumption</li>
              <li><strong>Audit Logging:</strong> Record all agent decisions and actions for review</li>
              <li><strong>Kill Switches:</strong> Ability to immediately halt agent execution</li>
            </ul>

            <MicroQuiz
              courseId="systems-architect"
              topicId="agentic-ai"
              question="What is the purpose of 'Human-in-the-Loop' in agentic AI systems?"
              options={[
                "To make the AI work faster",
                "To require human approval for high-stakes or irreversible actions",
                "To train the AI model",
                "To reduce costs"
              ]}
              correctAnswer={1}
              explanation="Human-in-the-Loop is a safety guardrail that requires human approval before the agent executes high-stakes or irreversible actions."
              eli5Explanation="It's like a self-driving car that can handle most driving but asks you to take the wheel when approaching a complex intersection. For important decisions (like sending money or deleting data), the AI pauses and asks a human to confirm before proceeding."
            />
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/systems-architect">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </Button>
          </Link>
          <Link href="/systems-architect/platform-engineering">
            <Button className="gap-2">
              Next: Platform Engineering
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </Layout>
  );
}
