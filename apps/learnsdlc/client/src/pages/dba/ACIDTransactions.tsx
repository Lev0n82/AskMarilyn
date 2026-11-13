import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Database } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function ACIDTransactions() {
  usePageMeta({
    title: "DBA Course - ACID Transactions",
    description: "Educational module on ACID transaction properties in database management. Part of GRACE Academy curriculum.",
    keywords: "ACID transactions education, database reliability, DBA training course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/database-administrator" className="hover:text-primary">Database Administrator</Link>
          <span>/</span>
          <span className="text-foreground">Module 1: ACID Transactions</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary flex items-center gap-3">
            <Database className="w-10 h-10" />
            ACID Transactions: The Foundation of Data Integrity
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~18 min read
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              4 quizzes
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
                I've been working with databases for years, but I still get confused about ACID properties. My manager keeps asking about "transaction isolation levels" and "consistency guarantees," and I just nod along. Can you explain ACID in a way that actually makes sense?
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">A</span>CID isn't just a chemistry term—it's the contract that databases make with you about how they'll protect your data. Think of it as the four promises every reliable database makes. Let me break down each one with examples that will make you the expert in your next meeting.
            </p>
          </div>
        </section>

        {/* The Spark: Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding ACID
          </h2>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">A - Atomicity: All or Nothing</h3>
            <p className="font-sans leading-relaxed">
              Atomicity means a transaction is indivisible—either all operations succeed, or none do. There's no partial execution.
            </p>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-bold mb-3">Real-World Example: Bank Transfer</h4>
                <p className="text-sm mb-4">
                  Transferring $100 from Account A to Account B involves two operations:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Debit $100 from Account A</li>
                  <li>Credit $100 to Account B</li>
                </ol>
                <p className="text-sm mt-4 text-muted-foreground">
                  Without atomicity, a crash after step 1 would lose $100 forever. Atomicity ensures both happen or neither does.
                </p>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="dba"
              topicId="acid-transactions"
              question="What happens if a system crash occurs in the middle of an atomic transaction?"
              options={[
                "The partial changes are saved",
                "The entire transaction is rolled back",
                "Only the first operation is saved",
                "The database becomes corrupted"
              ]}
              correctAnswer={1}
              explanation="Atomicity guarantees that if any part of a transaction fails, the entire transaction is rolled back. The database returns to its state before the transaction began."
              eli5Explanation="It's like sending a package. Either the whole package arrives, or none of it does. You can't receive half a birthday cake—it's all or nothing!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">C - Consistency: Rules Are Rules</h3>
            <p className="font-sans leading-relaxed">
              Consistency ensures that every transaction moves the database from one valid state to another. All defined rules, constraints, and triggers must be satisfied.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Constraint Type</th>
                    <th className="border border-border p-3 text-left">Example</th>
                    <th className="border border-border p-3 text-left">Violation Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3">Primary Key</td>
                    <td className="border border-border p-3">user_id must be unique</td>
                    <td className="border border-border p-3">Transaction rejected</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Foreign Key</td>
                    <td className="border border-border p-3">order.user_id must exist in users</td>
                    <td className="border border-border p-3">Transaction rejected</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Check Constraint</td>
                    <td className="border border-border p-3">balance {'>='} 0</td>
                    <td className="border border-border p-3">Transaction rejected</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Trigger</td>
                    <td className="border border-border p-3">Update audit log on change</td>
                    <td className="border border-border p-3">Trigger executes atomically</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="dba"
              topicId="acid-transactions"
              question="If a transaction would result in a negative bank balance (violating a CHECK constraint), what happens?"
              options={[
                "The balance goes negative anyway",
                "The entire transaction is rejected",
                "Only the offending operation is skipped",
                "The constraint is temporarily disabled"
              ]}
              correctAnswer={1}
              explanation="Consistency means the database will reject any transaction that would violate defined constraints. The transaction fails entirely, maintaining data integrity."
              eli5Explanation="Think of it like a bouncer at a club. If you don't meet the dress code (the rules), you don't get in. The database is the bouncer for your data!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">I - Isolation: No Peeking</h3>
            <p className="font-sans leading-relaxed">
              Isolation ensures that concurrent transactions don't interfere with each other. Each transaction should appear to run in complete isolation, even when many run simultaneously.
            </p>

            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <CardContent className="p-6">
                <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-3">Isolation Levels (Weakest to Strongest):</h4>
                <ul className="space-y-3 text-amber-800 dark:text-amber-200">
                  <li><strong>Read Uncommitted:</strong> Can see uncommitted changes (dirty reads)</li>
                  <li><strong>Read Committed:</strong> Only sees committed data, but may see different data on re-read</li>
                  <li><strong>Repeatable Read:</strong> Same query returns same results within a transaction</li>
                  <li><strong>Serializable:</strong> Transactions execute as if they were serial (one at a time)</li>
                </ul>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="dba"
              topicId="acid-transactions"
              question="Which isolation level provides the strongest guarantees but potentially the lowest performance?"
              options={[
                "Read Uncommitted",
                "Read Committed",
                "Repeatable Read",
                "Serializable"
              ]}
              correctAnswer={3}
              explanation="Serializable is the strongest isolation level—transactions behave as if executed one at a time. This prevents all anomalies but requires more locking, reducing concurrency."
              eli5Explanation="Imagine a bathroom with one toilet. Serializable means only one person can use it at a time—very safe, but there might be a line! Lower isolation levels are like having stalls—faster, but you might hear your neighbor."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">D - Durability: Written in Stone</h3>
            <p className="font-sans leading-relaxed">
              Durability guarantees that once a transaction is committed, it survives any subsequent failure—power outage, crash, or hardware failure.
            </p>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <h4 className="font-bold">How Databases Achieve Durability:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm mt-2">
                  <li><strong>Write-Ahead Logging (WAL):</strong> Changes written to log before data files</li>
                  <li><strong>Checkpointing:</strong> Periodic snapshots of database state</li>
                  <li><strong>Replication:</strong> Data copied to multiple servers</li>
                  <li><strong>fsync:</strong> Forces OS to flush data to physical disk</li>
                </ul>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="dba"
              topicId="acid-transactions"
              question="What is the primary purpose of Write-Ahead Logging (WAL)?"
              options={[
                "To speed up read queries",
                "To ensure committed transactions survive crashes",
                "To reduce disk space usage",
                "To improve query optimization"
              ]}
              correctAnswer={1}
              explanation="WAL writes changes to a log file before modifying the actual data. If a crash occurs, the database can replay the log to recover committed transactions."
              eli5Explanation="It's like writing down your grocery list before going shopping. If you forget what you bought, you can check the list. WAL is the database's shopping list for changes!"
            />
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/database-administrator">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </Button>
          </Link>
          <Link href="/database-administrator/vector-databases">
            <Button className="gap-2">
              Next: Vector Databases
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </Layout>
  );
}
