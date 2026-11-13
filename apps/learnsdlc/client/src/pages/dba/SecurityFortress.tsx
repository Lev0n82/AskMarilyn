import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Shield } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function SecurityFortress() {
  usePageMeta({
    title: "DBA Course - Database Security",
    description: "Educational module on database security best practices and defensive strategies. Part of GRACE Academy curriculum.",
    keywords: "database security education, data protection training, DBA security course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/database-administrator" className="hover:text-primary">Database Administrator</Link>
          <span>/</span>
          <span className="text-foreground">Module 3: Security Fortress</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary flex items-center gap-3">
            <Shield className="w-10 h-10" />
            Security Fortress: Protecting Your Data Kingdom
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~22 min read
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
                I just read about another massive data breach. As a DBA, I'm terrified that I'm missing something obvious. What are the essential security measures I should implement, and how do I prioritize them?
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">D</span>atabase security is like defending a castle—you need multiple layers of protection. A single wall can be breached, but an attacker facing walls, moats, guards, and locked vaults will likely give up or be caught. Let me show you how to build your fortress.
            </p>
          </div>
        </section>

        {/* The Spark: Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Defense in Depth
          </h2>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Layer 1: Authentication</h3>
            <p className="font-sans leading-relaxed">
              Authentication answers: "Who are you?" It's your first line of defense.
            </p>

            <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <CardContent className="p-6">
                <h4 className="font-bold text-red-700 dark:text-red-300 mb-3">Common Authentication Mistakes:</h4>
                <ul className="list-disc list-inside space-y-2 text-red-800 dark:text-red-200">
                  <li>Using default credentials (sa/sa, root/root)</li>
                  <li>Sharing service account passwords</li>
                  <li>Storing passwords in connection strings</li>
                  <li>No password rotation policy</li>
                  <li>Allowing remote root/sa login</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h4 className="font-bold text-green-700 dark:text-green-300 mb-3">Best Practices:</h4>
                <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200">
                  <li>Use certificate-based authentication where possible</li>
                  <li>Implement multi-factor authentication for admin access</li>
                  <li>Use secrets management (HashiCorp Vault, AWS Secrets Manager)</li>
                  <li>Rotate credentials automatically</li>
                  <li>Disable or rename default accounts</li>
                </ul>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="dba"
              topicId="security-fortress"
              question="What is the most secure way to manage database credentials for applications?"
              options={[
                "Store them in environment variables",
                "Hardcode them in the application",
                "Use a secrets management system like HashiCorp Vault",
                "Store them in a config file with restricted permissions"
              ]}
              correctAnswer={2}
              explanation="Secrets management systems provide encryption, access control, audit logging, and automatic rotation—all essential for secure credential management."
              eli5Explanation="It's like having a professional safe company manage your valuables instead of hiding money under your mattress. They have better locks, alarms, and know when someone tries to break in!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Layer 2: Authorization (RBAC)</h3>
            <p className="font-sans leading-relaxed">
              Authorization answers: "What are you allowed to do?" Use the principle of least privilege.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Role</th>
                    <th className="border border-border p-3 text-left">Permissions</th>
                    <th className="border border-border p-3 text-left">Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-bold">read_only</td>
                    <td className="border border-border p-3">SELECT</td>
                    <td className="border border-border p-3">Reporting, analytics</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">app_user</td>
                    <td className="border border-border p-3">SELECT, INSERT, UPDATE, DELETE</td>
                    <td className="border border-border p-3">Application service accounts</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">schema_admin</td>
                    <td className="border border-border p-3">+ CREATE, ALTER, DROP</td>
                    <td className="border border-border p-3">Migration scripts</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">dba</td>
                    <td className="border border-border p-3">Full administrative access</td>
                    <td className="border border-border p-3">Database administrators only</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="dba"
              topicId="security-fortress"
              question="What permission level should a typical application service account have?"
              options={[
                "Full administrative access",
                "SELECT, INSERT, UPDATE, DELETE only",
                "SELECT only",
                "No direct database access"
              ]}
              correctAnswer={1}
              explanation="Applications typically need CRUD operations but should never have schema modification or administrative privileges. This limits damage if the application is compromised."
              eli5Explanation="It's like giving a cashier access to the register but not the safe. They can do their job, but if someone steals their keys, they can't empty the vault!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Layer 3: Encryption</h3>
            <p className="font-sans leading-relaxed">
              Encryption protects data even if other defenses fail. Implement it at multiple levels:
            </p>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Encryption in Transit (TLS)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    All connections to the database should use TLS. This prevents eavesdropping on the network. Enforce minimum TLS 1.2, preferably 1.3.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Encryption at Rest (TDE)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Transparent Data Encryption encrypts data files on disk. If someone steals the hard drive, they can't read the data without the encryption key.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">Column-Level Encryption</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    For highly sensitive data (SSN, credit cards), encrypt specific columns. Even DBAs can't read the plaintext without the application key.
                  </p>
                </CardContent>
              </Card>
            </div>

            <MicroQuiz
              courseId="dba"
              topicId="security-fortress"
              question="What does TDE (Transparent Data Encryption) protect against?"
              options={[
                "SQL injection attacks",
                "Physical theft of storage media",
                "Network eavesdropping",
                "Unauthorized application access"
              ]}
              correctAnswer={1}
              explanation="TDE encrypts data files on disk. If someone physically steals the hard drive or backup tapes, they cannot read the data without the encryption key."
              eli5Explanation="TDE is like writing your diary in a secret code. If someone steals your diary, they just see gibberish. But you can still read it easily because you know the code!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Layer 4: Auditing</h3>
            <p className="font-sans leading-relaxed">
              You can't protect what you can't see. Comprehensive auditing catches attacks and proves compliance.
            </p>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-bold mb-3">What to Audit:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Authentication events:</strong> Successful and failed logins</li>
                  <li><strong>Privilege changes:</strong> GRANT, REVOKE, role modifications</li>
                  <li><strong>Schema changes:</strong> CREATE, ALTER, DROP statements</li>
                  <li><strong>Data access:</strong> SELECT on sensitive tables</li>
                  <li><strong>Data modifications:</strong> INSERT, UPDATE, DELETE on critical data</li>
                </ul>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="dba"
              topicId="security-fortress"
              question="Why is it important to audit failed login attempts?"
              options={[
                "To improve database performance",
                "To detect brute-force attacks",
                "To reduce storage costs",
                "To comply with naming conventions"
              ]}
              correctAnswer={1}
              explanation="Multiple failed login attempts often indicate a brute-force attack. Auditing these events allows you to detect and respond to attacks in progress."
              eli5Explanation="It's like having a doorbell camera. If someone keeps trying wrong keys at your door, you want to know about it before they find the right one!"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Layer 5: Network Security</h3>
            <p className="font-sans leading-relaxed">
              Your database should never be directly accessible from the internet.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Control</th>
                    <th className="border border-border p-3 text-left">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-bold">Private Subnet</td>
                    <td className="border border-border p-3">No public IP, only internal access</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Security Groups</td>
                    <td className="border border-border p-3">Allow only specific IPs/ports</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Bastion Host</td>
                    <td className="border border-border p-3">Single audited entry point for admin access</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">VPN/Private Link</td>
                    <td className="border border-border p-3">Encrypted tunnel for remote access</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="dba"
              topicId="security-fortress"
              question="What is the purpose of a bastion host for database access?"
              options={[
                "To improve query performance",
                "To provide a single, audited entry point for administrative access",
                "To store database backups",
                "To load balance database connections"
              ]}
              correctAnswer={1}
              explanation="A bastion host is a hardened server that serves as the only entry point to your private network. All admin access goes through it, making auditing and security monitoring easier."
              eli5Explanation="It's like having one guarded gate to enter a castle instead of many doors. Everyone has to go through the same checkpoint, so you know exactly who came in and when!"
            />
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/database-administrator/vector-databases">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: Vector Databases
            </Button>
          </Link>
          <Link href="/database-administrator">
            <Button className="gap-2">
              Back to Course Overview
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </Layout>
  );
}
