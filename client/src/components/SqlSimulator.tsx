import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Play, RefreshCw, CheckCircle, XCircle, Database } from "lucide-react";

// Mock Database Data
const initialUsers = [
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
  const [logs, setLogs] = useState<string[]>([]);

  // Reset simulator
  const reset = () => {
    setInput("");
    setQuery("SELECT * FROM users WHERE username = ''");
    setResults([]);
    setError(null);
    setSuccess(false);
    setLogs(["System initialized. Waiting for input..."]);
  };

  // Simulate SQL Execution
  const executeQuery = () => {
    setError(null);
    setSuccess(false);
    
    // Construct the query string for display
    const constructedQuery = `SELECT * FROM users WHERE username = '${input}'`;
    setQuery(constructedQuery);
    
    const newLogs = [...logs, `> Executing: ${constructedQuery}`];

    try {
      // Simple SQL Parser Logic for Simulation
      // 1. Check for basic injection: ' OR '1'='1
      if (input.includes("' OR '1'='1") || input.includes("' OR 1=1")) {
        setResults(initialUsers);
        setSuccess(true);
        newLogs.push(">> SUCCESS: Authentication Bypass Detected! Returned all rows.");
      } 
      // 2. Check for valid user
      else if (initialUsers.some(u => u.username === input)) {
        const user = initialUsers.find(u => u.username === input);
        setResults([user]);
        newLogs.push(`>> Found user: ${user?.username}`);
      }
      // 3. Check for empty or invalid
      else {
        setResults([]);
        newLogs.push(">> No results found.");
      }
      
      // 4. Simulate Syntax Error for unclosed quotes
      if (input.includes("'") && !input.includes("' OR") && !input.endsWith("'")) {
         // Very basic check for unclosed quotes to simulate error
         // This is a simplification for educational purposes
      }

    } catch (err) {
      setError("SQL Syntax Error");
      newLogs.push(">> ERROR: SQL Syntax Error");
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
              <Terminal className="mr-2 w-5 h-5" /> Injection Terminal
            </CardTitle>
            <CardDescription className="text-slate-400">
              Try to bypass authentication by injecting SQL into the username field.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Vulnerable Code:</label>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-sm text-green-400">
                query = "SELECT * FROM users WHERE username = '" + <span className="text-red-400">input</span> + "'";
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Username Input:</label>
              <div className="flex gap-2">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter username..."
                  className="bg-slate-950 border-slate-700 text-white font-mono"
                />
                <Button onClick={executeQuery} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Constructed Query:</label>
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

        {/* Hints / Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mission Objectives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${success ? "bg-green-100 border-green-500 text-green-600" : "border-muted-foreground"}`}>
                {success && <CheckCircle className="w-3 h-3" />}
              </div>
              <div>
                <p className="font-medium">Objective 1: Dump the Database</p>
                <p className="text-muted-foreground">Inject a payload that makes the WHERE clause always true.</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted inline-block px-1 rounded">Hint: ' OR '1'='1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Database View & Logs */}
      <div className="space-y-6">
        {/* Results Table */}
        <Card className="h-[300px] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <Database className="mr-2 w-4 h-4" /> Database Results
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
                <p>No records returned.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card className="bg-black text-green-500 font-mono text-xs h-[200px] flex flex-col border-slate-800">
          <CardHeader className="py-2 border-b border-slate-800">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-500">System Logs</CardTitle>
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
