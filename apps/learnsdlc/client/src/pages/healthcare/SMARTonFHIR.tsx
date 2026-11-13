import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, Shield, Key, Smartphone, CheckCircle2 } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function SMARTonFHIR() {
  usePageMeta({
    title: "Healthcare IT - SMART on FHIR",
    description: "Educational module on SMART on FHIR application development. Part of GRACE Academy curriculum.",
    keywords: "SMART on FHIR education, healthcare app development, health informatics course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Header */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/healthcare-architect">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Healthcare Architect
              </Button>
            </Link>
            <span>/</span>
            <span>Module 3</span>
          </div>
          
          <h1 className="text-4xl font-serif font-bold text-primary">
            SMART on FHIR: Secure Healthcare App Integration
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~15 min read
            </span>
          </div>
        </section>

        {/* Hero Image */}
        <section>
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/wXcaWwOJrXgzkinT.jpg" 
            alt="SMART on FHIR - Secure healthcare app integration"
            className="w-full rounded-xl border border-border shadow-lg"
          />
        </section>

        {/* Reader's Dilemma */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Reader's Dilemma
          </h2>
          <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
            <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
            <p className="font-sans text-card-foreground leading-relaxed">
              <span className="font-bold block mb-2">Dear Marilyn,</span>
              I want to build a healthcare app that works with Epic, Cerner, and other EHR systems. But the security requirements are terrifying—HIPAA, OAuth, patient consent. How do I build something that's both useful AND secure? Is there a standard way to do this?
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">Y</span>ou've discovered the golden key to healthcare app development: SMART on FHIR. It stands for "Substitutable Medical Applications, Reusable Technologies" and it's the standard that lets apps plug into EHR systems like apps plug into your smartphone.
            </p>
          </div>
        </section>

        {/* The Spark - Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding SMART on FHIR
          </h2>

          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">What is SMART on FHIR?</h3>
              <p className="leading-relaxed">
                SMART on FHIR is a set of open standards that enable third-party applications to integrate with EHR systems securely. Think of it as the "App Store" model for healthcare—apps can be launched from within the EHR, access patient data with proper authorization, and provide specialized functionality.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="font-bold">Security</span>
                  </div>
                  <p className="text-sm text-muted-foreground">OAuth 2.0 for authorization, OpenID Connect for authentication</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-5 h-5 text-blue-500" />
                    <span className="font-bold">Scopes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Fine-grained access control to specific resource types</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-5 h-5 text-purple-500" />
                    <span className="font-bold">Launch Context</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Apps know which patient/encounter is in context</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    <span className="font-bold">Substitutable</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Apps work across different EHR platforms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">The SMART Launch Sequence</h3>
              <p className="leading-relaxed">
                When a clinician launches your app from within the EHR, a carefully choreographed dance begins:
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-bold">EHR Launch</p>
                    <p className="text-sm text-muted-foreground">The EHR opens your app's launch URL with a <code>launch</code> parameter and <code>iss</code> (issuer) URL.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-bold">Discovery</p>
                    <p className="text-sm text-muted-foreground">Your app fetches the FHIR server's capability statement and OAuth endpoints from <code>/.well-known/smart-configuration</code>.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-bold">Authorization Request</p>
                    <p className="text-sm text-muted-foreground">Your app redirects to the authorization endpoint, requesting specific scopes (permissions).</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <p className="font-bold">User Consent</p>
                    <p className="text-sm text-muted-foreground">The EHR presents a consent screen; the user approves or denies access.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
                  <div>
                    <p className="font-bold">Token Exchange</p>
                    <p className="text-sm text-muted-foreground">Your app exchanges the authorization code for access and refresh tokens.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">6</div>
                  <div>
                    <p className="font-bold">API Access</p>
                    <p className="text-sm text-muted-foreground">Your app uses the access token to make FHIR API calls for the patient in context.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">Understanding Scopes</h3>
              <p className="leading-relaxed">
                SMART scopes define exactly what data your app can access. They follow a pattern: <code>context/resourceType.permission</code>
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 font-bold">Scope</th>
                      <th className="text-left p-2 font-bold">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">patient/Patient.read</td>
                      <td className="p-2">Read the current patient's demographics</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">patient/Observation.read</td>
                      <td className="p-2">Read the current patient's observations</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">patient/MedicationRequest.write</td>
                      <td className="p-2">Create/update medication orders for the patient</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">user/Patient.read</td>
                      <td className="p-2">Read any patient the user has access to</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2 font-mono">launch/patient</td>
                      <td className="p-2">Receive the patient ID in launch context</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">openid fhirUser</td>
                      <td className="p-2">Get the logged-in user's identity</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                <p className="text-sm"><strong>Principle of Least Privilege:</strong> Only request the scopes your app actually needs. Requesting <code>patient/*.read</code> when you only need vitals will raise red flags during app review.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">Code Example: SMART Launch</h3>
              
              <div className="bg-card p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto">
                <p className="text-muted-foreground mb-2">// Step 1: Handle the launch request</p>
                <pre className="whitespace-pre-wrap">{`app.get('/launch', async (req, res) => {
  const { launch, iss } = req.query;
  
  // Store launch token for later
  req.session.launch = launch;
  req.session.iss = iss;
  
  // Fetch SMART configuration
  const config = await fetch(\`\${iss}/.well-known/smart-configuration\`)
    .then(r => r.json());
  
  // Build authorization URL
  const authUrl = new URL(config.authorization_endpoint);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', 'launch patient/Patient.read patient/Observation.read');
  authUrl.searchParams.set('state', generateState());
  authUrl.searchParams.set('aud', iss);
  authUrl.searchParams.set('launch', launch);
  
  res.redirect(authUrl.toString());
});`}</pre>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto">
                <p className="text-muted-foreground mb-2">// Step 2: Handle the callback and exchange code for token</p>
                <pre className="whitespace-pre-wrap">{`app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Verify state to prevent CSRF
  if (state !== req.session.state) {
    return res.status(400).send('Invalid state');
  }
  
  // Exchange code for tokens
  const tokenResponse = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
    })
  }).then(r => r.json());
  
  // Store tokens and patient context
  req.session.accessToken = tokenResponse.access_token;
  req.session.patientId = tokenResponse.patient;
  
  res.redirect('/app');
});`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">Major EHR Platforms Supporting SMART</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <p className="font-bold text-lg">Epic</p>
                  <p className="text-sm text-muted-foreground">App Orchard marketplace, extensive FHIR R4 support</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <p className="font-bold text-lg">Cerner (Oracle Health)</p>
                  <p className="text-sm text-muted-foreground">Code Console for app development, FHIR R4</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <p className="font-bold text-lg">Allscripts</p>
                  <p className="text-sm text-muted-foreground">Open API program, SMART on FHIR certified</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <p className="font-bold text-lg">athenahealth</p>
                  <p className="text-sm text-muted-foreground">Marketplace apps, FHIR API access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* The Gauntlet - Quiz */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Gauntlet: Test Your Knowledge
          </h2>

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="smart-on-fhir"
            question="What does SMART stand for in SMART on FHIR?"
            options={[
              "Secure Medical Application Resource Technology",
              "Substitutable Medical Applications, Reusable Technologies",
              "Standard Medical API for Real-Time",
              "Secure Messaging And Resource Transfer"
            ]}
            correctAnswer={1}
            explanation="SMART stands for Substitutable Medical Applications, Reusable Technologies—emphasizing that apps should be interchangeable across different EHR systems."
            eli5Explanation="SMART means apps can be swapped around like LEGO pieces. Build once, use everywhere!"
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="smart-on-fhir"
            question="What authentication protocol does SMART on FHIR use?"
            options={[
              "Basic Authentication",
              "API Keys",
              "OAuth 2.0",
              "SAML"
            ]}
            correctAnswer={2}
            explanation="SMART on FHIR uses OAuth 2.0 for authorization, combined with OpenID Connect for authentication when user identity is needed."
            eli5Explanation="OAuth 2.0 is like a bouncer at a club. It checks if you're allowed in and gives you a wristband (token) to prove it!"
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="smart-on-fhir"
            question="What is the purpose of SMART scopes?"
            options={[
              "To define the visual layout of the app",
              "To specify exactly what data the app can access",
              "To set the app's pricing tier",
              "To determine the app's loading speed"
            ]}
            correctAnswer={1}
            explanation="SMART scopes define the specific permissions an app requests—which resource types it can read or write, and for which patients."
            eli5Explanation="Scopes are like asking permission. 'Can I read your vitals?' is different from 'Can I read everything about you?'"
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="smart-on-fhir"
            question="What is the 'launch context' in SMART on FHIR?"
            options={[
              "The programming language used to build the app",
              "Information about which patient/encounter is currently selected in the EHR",
              "The server where the app is hosted",
              "The version of FHIR being used"
            ]}
            correctAnswer={1}
            explanation="Launch context tells your app which patient (and optionally which encounter) the clinician is currently viewing, so your app can display relevant information."
            eli5Explanation="Launch context is like the EHR saying 'Hey app, we're looking at John Smith right now!' so your app knows who to show data for."
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="smart-on-fhir"
            question="Where does an app discover the EHR's OAuth endpoints?"
            options={[
              "Hardcoded in the app",
              "From the /.well-known/smart-configuration endpoint",
              "From a central FHIR registry",
              "From the patient's record"
            ]}
            correctAnswer={1}
            explanation="The /.well-known/smart-configuration endpoint provides a JSON document with all the OAuth URLs and capabilities the server supports."
            eli5Explanation="It's like a welcome sign at a new place that says 'Here's where to check in, here's where to get help, here's the rules.'"
          />
        </section>

        {/* Navigation */}
        <section className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/healthcare-architect/fhir-resources">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: FHIR Resources
            </Button>
          </Link>
          <Link href="/healthcare-architect">
            <Button className="gap-2">
              Back to Course Overview
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
