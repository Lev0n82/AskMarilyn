import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Play, RefreshCw, CheckCircle, XCircle, Database, GraduationCap, ShieldCheck } from "lucide-react";

// Educational Mock Data - Simulated database for learning purposes only
const educationalMockUsers = [
  { id: 1, username: "admin", password: "super_secret_password_123", role: "admin" },
  { id: 2, username: "marilyn", password: "logic_is_wisdom", role: "user" },
  { id: 3, username: "guest", password: "guest_password", role: "guest" },
];

export function SqlSimulator() {
  const [query, setQuery] = useState("SELECT * FROM users WHERE username = ''");
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[Educational Simulator] Initialized. This is a sandboxed learning environment."]);

  // Reset simulator
  const reset = () => {
    setInput("");
    setQuery("SELECT * FROM users WHERE username = ''");
    setResults([]);
    setError(null);
    setSuccess(false);
    setLogs(["[Educational Simulator] Reset. This is a sandboxed learning environment."]);
  };

  // Simulate Query Execution for Educational Demonstration
  const executeQuery = () => {
    setError(null);
    setSuccess(false);
    
    // Construct the query string for educational display
    const constructedQuery = `SELECT * FROM users WHERE username = '${input}'`;
    setQuery(constructedQuery);
    
    const newLogs = [...logs, `[Education] Simulating query: ${constructedQuery}`];

    try {
      // Educational simulation logic - demonstrates vulnerability behavior
      // This runs entirely in the browser with mock data
      if (input.includes("' OR '1'='1") || input.includes("' OR 1=1")) {
        setResults(educationalMockUsers);
        setSuccess(true);
        newLogs.push("[Education] VULNERABILITY DEMONSTRATED: Input validation bypass detected.");
        newLogs.push("[Education] LESSON: This is why parameterized queries are essential.");
        newLogs.push("[Education] FIX: Use db.execute('SELECT * FROM users WHERE username = ?', [input])");
      } 
      else if (educationalMockUsers.some(u => u.username === input)) {
        const user = educationalMockUsers.find(u => u.username === input);
        setResults([user]);
        newLogs.push(`[Education] Normal query: Found user "${user?.username}"`);
      }
      else {
        setResults([]);
        newLogs.push("[Education] Normal query: No matching records.");
      }
    } catch (err) {
      setError("Simulated Syntax Error");
      newLogs.push("[Education] Simulated syntax error in educational environment.");
    }

    setLogs(newLogs);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left Column: Controls & Query View */}
      <div className="space-y-6">
        <Card className="bg-slate-900 border-slate-800 text-slate-50">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <GraduationCap className="mr-2 w-5 h-5" /> Educational Vulnerability Lab
            </CardTitle>
            <CardDescription className="text-slate-400">
              Learn why input validation matters. Try entering different values to see how unvalidated input affects database queries. This simulator uses mock data only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Vulnerable Code Pattern (What NOT to Do):</label>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-sm text-green-400">
                <span className="text-red-400">// WARNING: Never concatenate user input into queries</span>
                <br />
                query = "SELECT * FROM users WHERE username = '" + <span className="text-red-400">input</span> + "'";
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Test Input (Educational):</label>
              <div className="flex gap-2">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter a username to test..."
                  className="bg-slate-950 border-slate-700 text-white font-mono"
                />
                <Button onClick={executeQuery} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Resulting Query (Educational View):</label>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-sm break-all">
                <span className="text-purple-400">SELECT</span> * <span className="text-purple-400">FROM</span> users <span className="text-purple-400">WHERE</span> username = '<span className="text-red-400">{input}</span>'
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" onClick={reset} className="text-slate-400 hover:text-white">
              <RefreshCw className="w-4 h-4 mr-2" /> Reset Simulator
            </Button>
          </CardFooter>
        </Card>

        {/* Learning Exercise */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" /> Learning Exercise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${success ? "bg-green-100 border-green-500 text-green-600" : "border-muted-foreground"}`}>
                {success && <CheckCircle className="w-3 h-3" />}
              </div>
              <div>
                <p className="font-medium">Exercise: Demonstrate Why Input Validation Matters</p>
                <p className="text-muted-foreground">Enter an input that makes the WHERE clause always evaluate to true, demonstrating the vulnerability.</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted inline-block px-1 rounded">Hint: ' OR '1'='1</p>
              </div>
            </div>
            {success && (
              <div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
                <p className="text-green-800 text-sm font-medium flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Lesson Learned
                </p>
                <p className="text-green-700 text-xs mt-1">
                  You've demonstrated why string concatenation in queries is dangerous. The fix is simple: 
                  always use <strong>parameterized queries</strong> (prepared statements). This ensures user input 
                  is treated as data, never as executable code.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Database View & Logs */}
      <div className="space-y-6">
        {/* Results Table */}
        <Card className="h-[300px] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <Database className="mr-2 w-4 h-4" /> Simulated Database Results (Mock Data)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {results.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Password</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((row) => (
                    <TableRow key={row.id} className={row.role === 'admin' ? "bg-red-50" : ""}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell className="font-medium">{row.username}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{row.password}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm">
                <Database className="w-8 h-8 mb-2 opacity-20" />
                <p>No records returned from educational mock database.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Educational Logs */}
        <Card className="bg-black text-green-500 font-mono text-xs h-[200px] flex flex-col border-slate-800">
          <CardHeader className="py-2 border-b border-slate-800">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-500">Educational Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-2 space-y-1">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
