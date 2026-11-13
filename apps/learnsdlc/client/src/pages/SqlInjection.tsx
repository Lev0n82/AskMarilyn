import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Terminal, Database, Lock, Search, AlertTriangle, GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { SqlSimulator } from "@/components/SqlSimulator";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function SqlInjection() {
  const [activeTab, setActiveTab] = useState("intro");

  usePageMeta({
    title: "Defensive Security Education - SQL Vulnerability Awareness",
    description: "Educational course module teaching software developers to identify and prevent SQL injection vulnerabilities. Part of GRACE Academy's defensive security curriculum. All exercises use sandboxed educational simulators with no connection to real systems.",
    keywords: "security education, defensive coding, vulnerability prevention, secure software development, OWASP education, developer security training, GRACE Academy, educational simulator, application security course"
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Educational Context Banner - Prominent at top */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4">
          <GraduationCap className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-bold text-blue-900 text-lg mb-1">GRACE Academy - Defensive Security Education</h2>
            <p className="text-blue-800 text-sm leading-relaxed">
              This is an <strong>educational course module</strong> designed to teach software developers how to identify and prevent common security vulnerabilities. 
              Understanding how vulnerabilities work is essential for building secure applications. This content follows 
              <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer" className="underline font-medium"> OWASP Top 10</a> educational guidelines 
              and is part of GRACE Academy's accredited professional development curriculum.
            </p>
          </div>
        </div>

        {/* Hero Section with Ask Marilyn Style Image */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border mb-8">
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/YkPivZMXzevdKtkY.jpg" 
            alt="GRACE Academy Defensive Security Education - Vintage illustration of database security concepts for developer training"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-300" />
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-md">Defensive Security Awareness</h1>
                <p className="text-blue-200 text-sm mt-1">Understanding Vulnerabilities to Build Secure Applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <p className="text-xl text-muted-foreground font-serif italic">
            "To build a fortress, you must first understand the siege."
          </p>
          
          {/* Educational Purpose Notice */}
          <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Educational Purpose - Defensive Security Training</AlertTitle>
            <AlertDescription>
              This course teaches developers to <strong>identify and prevent</strong> security vulnerabilities in their own applications. 
              All examples demonstrate <strong>what NOT to do</strong> and <strong>how to fix it</strong>. The interactive simulator below 
              is a completely sandboxed educational tool with no connection to any real database or system. This curriculum aligns with 
              OWASP Secure Coding Practices and is intended for professional development.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Responsible Disclosure Reminder</AlertTitle>
            <AlertDescription>
              The techniques discussed in this educational module should <strong>never</strong> be used against systems without explicit written authorization. 
              Always follow your organization's responsible disclosure policy and applicable laws. This content is provided solely for 
              defensive awareness and secure development education.
            </AlertDescription>
          </Alert>
        </div>

        {/* Learning Objectives */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" /> Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
              <li>Understand how input validation failures create security vulnerabilities in web applications</li>
              <li>Learn to identify vulnerable code patterns during code review</li>
              <li>Practice secure coding techniques including parameterized queries and prepared statements</li>
              <li>Recognize common vulnerability patterns as defined by OWASP Top 10 (A03:2021 - Injection)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="intro" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="intro">Vulnerability Overview</TabsTrigger>
            <TabsTrigger value="anatomy">Code Analysis</TabsTrigger>
            <TabsTrigger value="inference">Detection Methods</TabsTrigger>
            <TabsTrigger value="practice">Educational Simulator</TabsTrigger>
          </TabsList>

          {/* Tab 1: Introduction */}
          <TabsContent value="intro" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>What is an Injection Vulnerability?</CardTitle>
                <CardDescription>Understanding OWASP A03:2021 - Injection flaws in application security education.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  An injection vulnerability occurs when untrusted user input is concatenated directly into a database query without proper sanitization or parameterization. This is one of the most common and dangerous security flaws in web applications, ranked as <strong>OWASP Top 10 A03:2021</strong>.
                </p>
                
                <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                  <p className="text-sm font-bold text-red-700 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" /> Vulnerable Code Pattern (What NOT to Do)
                  </p>
                  <div className="bg-white p-3 rounded border font-mono text-sm">
                    <p className="text-red-600">// WARNING: This code is VULNERABLE - never use string concatenation for queries</p>
                    <p>query = "SELECT * FROM users WHERE name = '" + <span className="text-red-500">userInput</span> + "'";</p>
                  </div>
                </div>

                <p>
                  When user input is not properly validated, a specially crafted input string can alter the query's logic. For educational purposes, consider this example input: <code className="bg-muted px-1 rounded text-red-600">' OR '1'='1</code>
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-sm">
                  <p className="text-muted-foreground">// The resulting query returns all records instead of one:</p>
                  <p>SELECT * FROM users WHERE name = '' OR '1'='1'</p>
                </div>
                <p>
                  Since the condition <code className="font-mono">'1'='1'</code> is always true, the database returns <strong>all records</strong> — a classic authentication bypass vulnerability.
                </p>

                <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                  <p className="text-sm font-bold text-green-700 mb-2 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2" /> Secure Code Pattern (The Correct Approach)
                  </p>
                  <div className="bg-white p-3 rounded border font-mono text-sm">
                    <p className="text-green-600">// SECURE: Always use parameterized queries / prepared statements</p>
                    <p>query = "SELECT * FROM users WHERE name = ?";</p>
                    <p>db.execute(query, [userInput]);</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Anatomy of a Vulnerability */}
          <TabsContent value="anatomy" className="space-y-6 mt-6">
            {/* Anatomy Section Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border mb-6">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/jMLcARSqbnJANCVF.jpg" 
                alt="GRACE Academy educational diagram - Analyzing vulnerable code patterns for developer security awareness training"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Terminal className="w-5 h-5 mr-2" /> Vulnerable Input Patterns</CardTitle>
                  <CardDescription>Learn to recognize these patterns during code review</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    During code review, look for input strings that could alter query structure. A vulnerable input typically consists of three parts:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Prefix:</strong> Closes the existing statement delimiter (e.g., <code className="font-mono">'</code> or <code className="font-mono">")</code>).</li>
                    <li><strong>Payload:</strong> The additional condition that alters query logic (e.g., <code className="font-mono">OR 1=1</code>).</li>
                    <li><strong>Suffix:</strong> Comments out the remainder of the original query (e.g., <code className="font-mono">--</code> or <code className="font-mono">#</code>).</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Database className="w-5 h-5 mr-2" /> Vulnerability Impact Assessment</CardTitle>
                  <CardDescription>Understanding risk levels for security review</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Understanding the potential impact helps prioritize security fixes during development:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Authentication Bypass:</strong> Unauthorized access without valid credentials.</li>
                    <li><strong>Data Exposure:</strong> Using <code className="font-mono">UNION SELECT</code> patterns to access unintended data.</li>
                    <li><strong>Blind Detection:</strong> Inferring database structure through application response timing or error messages.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 3: Detection Methods */}
          <TabsContent value="inference" className="space-y-6 mt-6">
            {/* Inference Section Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border mb-6">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/nlcEHjmxBMRbOwFi.jpg" 
                alt="GRACE Academy educational illustration - Security testing methodologies for identifying application vulnerabilities"
                className="w-full h-full object-cover"
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>How Security Testers Identify Vulnerabilities</CardTitle>
                <CardDescription>Authorized penetration testing techniques used by security professionals during application security assessments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  During authorized security assessments, testers systematically probe applications to identify vulnerabilities <strong>before</strong> they can be exploited. Understanding these techniques helps developers build more resilient applications.
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-bold text-sm">1. Column Enumeration (Security Testing Technique)</h4>
                    <p className="text-sm text-muted-foreground">
                      Security testers use <code className="font-mono">ORDER BY</code> clauses with incrementing values to determine query structure. When the application returns an error, it reveals the column boundary. <strong>Prevention:</strong> Use parameterized queries and avoid exposing database errors to users.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-sm">2. Type Detection (Security Testing Technique)</h4>
                    <p className="text-sm text-muted-foreground">
                      Testers use <code className="font-mono">UNION SELECT</code> with mixed types to identify column data types. <strong>Prevention:</strong> Implement strict input validation, use ORMs with parameterized queries, and never return raw database errors.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-500 pl-4">
                    <h4 className="font-bold text-sm">3. Schema Discovery (Security Testing Technique)</h4>
                    <p className="text-sm text-muted-foreground">
                      Querying the information schema reveals database structure. <strong>Prevention:</strong> Apply principle of least privilege to database accounts, restrict access to system tables, and use application-level access controls.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Defense Section Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border mt-6">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/MzSEpzkuBTGVceQr.jpg" 
                alt="GRACE Academy educational illustration - Building secure application architecture and defense-in-depth strategies"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-serif text-lg">
                  "The best defense is understanding the offense — then building walls that cannot be breached."
                </p>
              </div>
            </div>

            {/* Prevention Best Practices */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <ShieldCheck className="w-5 h-5 mr-2" /> Prevention Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-green-900">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Always use parameterized queries</strong> or prepared statements — never concatenate user input into queries</li>
                  <li><strong>Implement input validation</strong> — whitelist acceptable characters and reject unexpected input</li>
                  <li><strong>Apply least privilege</strong> — database accounts should only have permissions they need</li>
                  <li><strong>Use an ORM</strong> — frameworks like Drizzle, Prisma, or Sequelize handle parameterization automatically</li>
                  <li><strong>Enable WAF rules</strong> — Web Application Firewalls can detect and block common injection patterns</li>
                  <li><strong>Regular security testing</strong> — include SAST/DAST tools in your CI/CD pipeline</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Educational Simulator */}
          <TabsContent value="practice" className="space-y-6 mt-6">
            {/* Simulator Educational Context */}
            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <GraduationCap className="h-4 w-4" />
              <AlertTitle>Sandboxed Educational Simulator</AlertTitle>
              <AlertDescription>
                This is a <strong>completely isolated educational simulator</strong> running entirely in your browser. 
                It uses mock data with no connection to any real database, server, or external system. 
                The purpose is to help developers understand why input validation is critical by demonstrating 
                what happens when it is missing.
              </AlertDescription>
            </Alert>
            <SqlSimulator />
          </TabsContent>

        </Tabs>

        {/* Footer Educational Disclaimer */}
        <div className="border-t border-border pt-6 mt-8">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong>Educational Disclaimer:</strong> This course module is part of GRACE Academy's professional development curriculum 
            for software engineers. All security concepts are presented for <strong>defensive awareness and secure coding education</strong> only. 
            The interactive simulator is a sandboxed browser-based tool using mock data. No real systems, databases, or networks are involved. 
            This content aligns with OWASP Secure Coding Practices and NIST Cybersecurity Framework educational guidelines.
            Unauthorized testing of systems you do not own is illegal and unethical.
          </p>
        </div>
      </div>
    </Layout>
  );
}
