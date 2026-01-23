import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Terminal, Database, Lock, Search, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { SqlSimulator } from "@/components/SqlSimulator";

export default function SqlInjection() {
  const [activeTab, setActiveTab] = useState("intro");

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-red-600">
            <ShieldAlert className="w-8 h-8" />
            <h1 className="text-3xl font-serif font-bold text-foreground">SQL Injection Masterclass</h1>
          </div>
          <p className="text-xl text-muted-foreground font-serif italic">
            "To build a fortress, you must first understand the siege."
          </p>
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Educational Purpose Only</AlertTitle>
            <AlertDescription>
              This course is designed for defensive security training. All techniques should only be practiced in authorized environments (like the simulator below).
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="intro" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="intro">Introduction</TabsTrigger>
            <TabsTrigger value="anatomy">Anatomy</TabsTrigger>
            <TabsTrigger value="inference">Inference</TabsTrigger>
            <TabsTrigger value="practice">Simulator</TabsTrigger>
          </TabsList>

          {/* Tab 1: Introduction */}
          <TabsContent value="intro" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>What is SQL Injection (SQLi)?</CardTitle>
                <CardDescription>The art of subverting database queries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  SQL Injection occurs when untrusted user input is concatenated directly into a database query without proper sanitization or parameterization. This allows an attacker to manipulate the query's structure, potentially accessing, modifying, or deleting data they shouldn't see.
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-sm">
                  <p className="text-green-600">// Vulnerable Code</p>
                  <p>query = "SELECT * FROM users WHERE name = '" + <span className="text-red-500">userInput</span> + "'";</p>
                </div>
                <p>
                  If the user inputs <code className="bg-muted px-1 rounded text-red-600">' OR '1'='1</code>, the query becomes:
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-sm">
                  <p>SELECT * FROM users WHERE name = '' OR '1'='1'</p>
                </div>
                <p>
                  Since <code className="font-mono">'1'='1'</code> is always true, the database returns <strong>all users</strong> instead of just one.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Anatomy of an Injection */}
          <TabsContent value="anatomy" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Terminal className="w-5 h-5 mr-2" /> The Payload</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The payload is the malicious string injected into the input field. It typically consists of three parts:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Prefix:</strong> Closes the existing SQL statement (e.g., <code className="font-mono">'</code> or <code className="font-mono">")</code>).</li>
                    <li><strong>Injection:</strong> The malicious SQL command (e.g., <code className="font-mono">OR 1=1</code>).</li>
                    <li><strong>Suffix:</strong> Comments out the rest of the original query (e.g., <code className="font-mono">--</code> or <code className="font-mono">#</code>).</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Database className="w-5 h-5 mr-2" /> The Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Understanding the database structure is key. Common targets include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Authentication Bypass:</strong> Logging in without a password.</li>
                    <li><strong>Data Exfiltration:</strong> Using <code className="font-mono">UNION SELECT</code> to retrieve data from other tables.</li>
                    <li><strong>Blind SQLi:</strong> Inferring data by asking true/false questions (time-based or error-based).</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 3: Intelligent Inference */}
          <TabsContent value="inference" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Designing Intelligent Injections</CardTitle>
                <CardDescription>How to map the database without seeing it.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Advanced attackers don't just guess; they <strong>infer</strong>. By observing how the application responds to different inputs, they can map out the database schema.
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-bold text-sm">1. Determining Column Count</h4>
                    <p className="text-sm text-muted-foreground">
                      Inject <code className="font-mono">ORDER BY 1</code>, <code className="font-mono">ORDER BY 2</code>, etc., until the application throws an error. The last successful number is the number of columns in the current query.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-sm">2. Identifying Data Types</h4>
                    <p className="text-sm text-muted-foreground">
                      Once you know the column count, use <code className="font-mono">UNION SELECT 'a', 1, 'b'</code> to see which columns accept strings vs. integers.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-500 pl-4">
                    <h4 className="font-bold text-sm">3. Extracting Table Names</h4>
                    <p className="text-sm text-muted-foreground">
                      Query the information schema (e.g., <code className="font-mono">SELECT table_name FROM information_schema.tables</code>) to find hidden tables like 'users' or 'secrets'.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Simulator */}
          <TabsContent value="practice" className="space-y-6 mt-6">
            <SqlSimulator />
          </TabsContent>

        </Tabs>
      </div>
    </Layout>
  );
}
