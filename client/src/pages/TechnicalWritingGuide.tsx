import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowRight, PenTool, BookOpen, Eye, Brain, Sparkles, CheckCircle, XCircle, AlertTriangle, FileText, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MicroQuiz } from "@/components/MicroQuiz";
import { CheatSheetDownload } from "@/components/CheatSheetDownload";

export default function TechnicalWritingGuide() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full font-medium">
              Bonus Course
            </span>
            <span>•</span>
            <span>35 min read</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Technical Writing Made Easier
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed italic">
            "Local Engineer Writes Documentation; Three Colleagues Hospitalized After Attempting to Read It"
          </p>
        </header>

        {/* Opening Letter */}
        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> I'm a brilliant programmer, but every time I write
                documentation, my colleagues look at me like I've written it in ancient Sumerian.
                Is technical writing really that different from regular writing?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Bewildered in Boston</p>
            </CardContent>
          </Card>
        </section>

        {/* Hero Graphic */}
        <div className="mb-12 rounded-xl overflow-hidden border border-border paper-shadow">
          <img 
            src="/images/techwriting-pillars.jpg" 
            alt="Illustration of three Greek columns representing the pillars of technical writing - Readability, Comprehensibility, and Style - with a confused reader trying to navigate between them"
            className="w-full h-auto"
          />
        </div>

        <section className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            <strong>Dear Bewildered:</strong> Yes. Technical writing is to regular writing what
            surgery is to cooking—both involve cutting things, but the precision requirements are
            rather different. In technical writing, clarity isn't a nice-to-have; it's the entire
            point.
          </p>
          <p className="text-lg leading-relaxed">
            The good news is that technical writing is a <em>learnable skill</em>. The bad news is
            that most programmers never learn it, which is why we have documentation that reads
            like it was translated from Klingon by a committee of lawyers.
          </p>
          <p className="text-lg leading-relaxed">
            What follows is a guide to writing technical documents that humans can actually understand.
            Your colleagues—and your future self—will thank you.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Topic 1: The Three Pillars */}
        <section className="mb-12" id="three-pillars">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            The Three Pillars of Technical Writing
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Study Reveals Most Technical Documents Fail at Least Two of Three Basic Requirements"
          </p>

          <p className="text-lg leading-relaxed mb-6">
            Understanding written text depends on three distinct components. Master these, and
            your documentation will actually be useful. Ignore them, and you might as well not
            write anything at all.
          </p>

          <div className="grid gap-6 mb-6">
            {/* Legibility */}
            <Card className="border-2 border-muted">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold mb-2">1. Legibility</h3>
                    <p className="text-muted-foreground">
                      Can the reader physically see and decode the characters? This is about fonts,
                      layout, and typography—usually handled by designers and typesetters, not writers.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      (We won't cover this—it's not your job. But don't use Comic Sans.)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Readability */}
            <Card className="border-2 border-teal/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-teal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold mb-2 text-teal">2. Readability</h3>
                    <p className="text-muted-foreground">
                      Can the reader process the text smoothly? This is about sentence structure,
                      word choice, and flow. If a text is unreadable, the reader will assume the
                      product is equally poor quality.
                    </p>
                    <p className="text-sm font-medium text-teal mt-2">
                      Think of it as "tokenizing" your text—making it easy to parse.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comprehensibility */}
            <Card className="border-2 border-coral/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-coral" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold mb-2 text-coral">3. Comprehensibility</h3>
                    <p className="text-muted-foreground">
                      Can the reader actually understand the meaning? This is about logical structure,
                      building on prior knowledge, and clear explanations. This is where most
                      technical writing fails.
                    </p>
                    <p className="text-sm font-medium text-coral mt-2">
                      Think of it as "parsing" your text—extracting meaning from tokens.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 bg-amber-500/5 border-amber-500/30">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                The Brutal Truth
              </h3>
              <p className="text-muted-foreground">
                If your technical text is unreadable, readers will assume your <em>product</em> is
                also of inferior quality. Code is a language, just as documentation is. Not writing
                well in documentation implies faults in coding style. Fair or not, this is how
                humans judge quality.
              </p>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="technical-writing"
            topicId="three-pillars"
            question="Which pillar of technical writing is most often neglected by programmers?"
            options={[
              "Legibility - choosing good fonts",
              "Readability - sentence structure and flow",
              "Comprehensibility - logical structure and clear explanations",
              "All three are equally neglected"
            ]}
            correctAnswer={2}
            explanation="While readability issues are common, comprehensibility is where most technical writing fails. Programmers often assume readers have the same background knowledge they do, skip logical steps, and fail to build concepts progressively."
            eli5Explanation="Imagine explaining how to build a LEGO castle. Legibility is making sure your instructions aren't blurry. Readability is using simple words. Comprehensibility is making sure you explain step 1 before step 2, and don't skip any pieces! Most people forget to explain things in order."
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 2: Readability */}
        <section className="mb-12" id="readability">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-teal" />
            Readability: Making Text Flow
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Engineer's 200-Word Sentence Sets New Record; Readers Still Lost at Word 47"
          </p>

          {/* Readability Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
            <img 
              src="/images/techwriting-sentences.jpg" 
              alt="Illustration comparing sentence lengths - a reader easily following short sentences like stepping stones vs drowning in a sea of run-on sentences"
              className="w-full h-auto"
            />
          </div>

          <Card className="bg-primary/5 border-primary/20 mb-6">
            <CardContent className="pt-6">
              <p className="text-lg italic text-foreground">
                <strong>Dear Marilyn:</strong> My sentences are grammatically correct. Why do
                people still complain they're hard to read?
              </p>
              <p className="text-right text-muted-foreground mt-4">— Grammatically Correct in Georgia</p>
            </CardContent>
          </Card>

          <p className="text-lg leading-relaxed mb-6">
            <strong>Dear Grammatically:</strong> Grammar is necessary but not sufficient. A
            grammatically correct sentence can still be a nightmare to read. The key requirements
            for readability are:
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Five Rules of Readable Sentences</h3>
              
              <div className="space-y-6">
                {/* Rule 1 */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">1. Sentences must be well-formed syntactically</h4>
                  <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <div className="p-3 bg-coral/5 rounded border-l-4 border-coral">
                      <span className="text-coral text-sm font-medium">Bad:</span>
                      <p className="text-sm mt-1">"This sentence no verb."</p>
                    </div>
                    <div className="p-3 bg-teal/5 rounded border-l-4 border-teal">
                      <span className="text-teal text-sm font-medium">Good:</span>
                      <p className="text-sm mt-1">"This sentence has a verb."</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Read your writing out loud. If it sounds wrong, it probably is.
                  </p>
                </div>

                {/* Rule 2 */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">2. Sentences must not exceed a certain length</h4>
                  <div className="p-3 bg-coral/5 rounded border-l-4 border-coral mt-3">
                    <span className="text-coral text-sm font-medium">Too Long (actual example):</span>
                    <p className="text-sm mt-1 italic">
                      "It is given as a rule, which however is not the only such rule you may
                      encounter, that sentences should not exceed a desirable length of ten to
                      fifteen words, never should fall below seven words or extend beyond the
                      ultimate limit of tolerable length reached at twenty words, even though
                      longer sentences may be found in high literature."
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>The Rule:</strong> Aim for 10-15 words. Never exceed 20. If you need
                    more, break it into multiple sentences.
                  </p>
                </div>

                {/* Rule 3 */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">3. Sentences should not be too short either</h4>
                  <div className="p-3 bg-coral/5 rounded border-l-4 border-coral mt-3">
                    <span className="text-coral text-sm font-medium">Too Choppy:</span>
                    <p className="text-sm mt-1 italic">
                      "Sentences may be short. Then they are easy to read. And understand, too.
                      But they look cheap. And breathless."
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>The Rule:</strong> Vary your sentence length. Mix short and medium
                    sentences for rhythm. Human language is not a RISC instruction set.
                  </p>
                </div>

                {/* Rule 4 */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">4. Recursion must be kept to a minimum</h4>
                  <div className="p-3 bg-coral/5 rounded border-l-4 border-coral mt-3">
                    <span className="text-coral text-sm font-medium">Confusing Recursion:</span>
                    <p className="text-sm mt-1 italic">
                      "It is not easy to understand it when it is unclear what is referenced by
                      'it' – it by now should be clear what it is supposed to mean, isn't it?"
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>The Rule:</strong> Replace pronouns with actual names when ambiguous.
                    A reader's mental "stack" is shallow—don't overflow it.
                  </p>
                </div>

                {/* Rule 5 */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2">5. The choice of words should vary</h4>
                  <div className="p-3 bg-coral/5 rounded border-l-4 border-coral mt-3">
                    <span className="text-coral text-sm font-medium">Repetitive:</span>
                    <p className="text-sm mt-1 italic">
                      "Using the same words all over to describe the same things again and again
                      is not pleasant when we use the same words to describe the same thing."
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>The Rule:</strong> Use a thesaurus. Never use the same opening words
                    in two consecutive sentences. Repetitive writing kills reader interest.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="technical-writing"
            topicId="readability"
            question="What is the recommended maximum length for a sentence in technical writing?"
            options={[
              "5 words",
              "10 words",
              "20 words",
              "No limit if grammatically correct"
            ]}
            correctAnswer={2}
            explanation="Technical writing guidelines suggest aiming for 10-15 words per sentence, with an absolute maximum of 20 words. Longer sentences strain short-term memory and make comprehension difficult."
            eli5Explanation="Your brain is like a small bucket. If I pour too many words in at once, they spill out and you forget the beginning before I finish! Short sentences (10-15 words) fit nicely in the bucket. Super long sentences overflow and make a mess."
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 3: Comprehensibility */}
        <section className="mb-12" id="comprehensibility">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <Brain className="w-8 h-8 text-coral" />
            Comprehensibility: Building Understanding
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Documentation Assumes Reader Already Knows Everything; Reader Does Not"
          </p>

          <p className="text-lg leading-relaxed mb-6">
            A comprehensible technical document follows a logical structure. Every topic builds on
            preceding topics. If a new concept is needed, it must be introduced <em>before</em>
            using it. This applies at every level—from the document structure down to individual
            sentences.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Four Steps of Explanation</h3>
              <p className="text-muted-foreground mb-4">
                Every concept you explain should follow this pattern:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold">Definition</h4>
                    <p className="text-sm text-muted-foreground">
                      What is the thing? Give a clear, concise definition. Don't assume the reader
                      knows what you're talking about.
                    </p>
                    <p className="text-sm text-teal mt-2 italic">
                      Example: "A variable is a named storage location in memory."
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold">Assumption/Theorem</h4>
                    <p className="text-sm text-muted-foreground">
                      What can we do with it? What are its properties? State the key facts or
                      capabilities.
                    </p>
                    <p className="text-sm text-teal mt-2 italic">
                      Example: "Variables can store different types of data and can be modified
                      during program execution."
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold">Explanation/Proof</h4>
                    <p className="text-sm text-muted-foreground">
                      Show how it works. Provide examples, demonstrate the concept in action,
                      prove your assertions.
                    </p>
                    <p className="text-sm text-teal mt-2 italic">
                      Example: "Here's how to declare and use a variable: int count = 0; count = count + 1;"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold">Conclusion</h4>
                    <p className="text-sm text-muted-foreground">
                      Summarize and reinforce. The human mind needs repetition to commit to memory.
                      Unlike computers, we need to be told several times.
                    </p>
                    <p className="text-sm text-teal mt-2 italic">
                      Example: "In summary, variables are named storage locations that hold data
                      you can read and modify throughout your program."
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Golden Rule</h3>
              <blockquote className="border-l-4 border-amber-500 pl-4 italic text-lg">
                "Repeat the central message of what you write several times. The human mind is
                not at ease when confronted with a 'fire and forget' type of message."
              </blockquote>
              <p className="text-sm text-muted-foreground mt-4">
                This isn't redundancy—it's pedagogy. Tell them what you're going to tell them,
                tell them, then tell them what you told them.
              </p>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="technical-writing"
            topicId="comprehensibility"
            question="What is the correct order for explaining a new concept?"
            options={[
              "Example → Definition → Conclusion → Theorem",
              "Definition → Assumption/Theorem → Explanation/Proof → Conclusion",
              "Conclusion → Definition → Example → Summary",
              "Introduction → Body → Conclusion"
            ]}
            correctAnswer={1}
            explanation="The four-step pattern is: Definition (what is it?), Assumption/Theorem (what can it do?), Explanation/Proof (show how it works), and Conclusion (summarize and reinforce). This builds understanding progressively."
            eli5Explanation="It's like showing someone a new toy! First, tell them what it is ('This is a yo-yo'). Then tell them what it does ('It goes up and down on a string'). Then show them how ('Watch me do it!'). Finally, remind them ('So that's a yo-yo—it goes up and down!'). Easy!"
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 4: Matters of Style */}
        <section className="mb-12" id="style">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Matters of Style
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Technical Writer Uses 'Utilize' Instead of 'Use'; Readers Lose Will to Live"
          </p>

          <p className="text-lg leading-relaxed mb-6">
            Even technical prose doesn't have to be a blunt axe when it could be an instrument of
            precision. Here are the style rules that separate professional documentation from
            amateur hour.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Style Commandments</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">1</span>
                    Avoid Big Words
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Never use a complex word when a simple one will do. "Utilize" is not fancier
                    than "use"—it's just longer.
                  </p>
                  <div className="grid md:grid-cols-2 gap-2 mt-2">
                    <div className="text-sm"><span className="text-coral">❌</span> utilize → <span className="text-teal">✓</span> use</div>
                    <div className="text-sm"><span className="text-coral">❌</span> facilitate → <span className="text-teal">✓</span> help</div>
                    <div className="text-sm"><span className="text-coral">❌</span> implement → <span className="text-teal">✓</span> do/make</div>
                    <div className="text-sm"><span className="text-coral">❌</span> terminate → <span className="text-teal">✓</span> end</div>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">2</span>
                    Don't Use Contractions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    In technical writing, write "do not" instead of "don't", "it is" instead of
                    "it's". Contractions are informal and can cause confusion with possessives.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">3</span>
                    Use "Can" Carefully
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    "Can" means ability. "May" means permission. "Could" implies uncertainty.
                    Be precise about what you mean.
                  </p>
                  <div className="text-sm mt-2">
                    <p><span className="text-teal">✓</span> "The function <strong>can</strong> process 1000 records per second." (ability)</p>
                    <p><span className="text-teal">✓</span> "Users <strong>may</strong> override the default settings." (permission)</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">4</span>
                    Avoid the First Person
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Technical writing should be objective. Avoid "I think" or "we believe."
                    State facts, not opinions. The reader doesn't care what you think—they want
                    to know what IS.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">5</span>
                    Use "If" Correctly
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    "If" is for conditions. "Whether" is for alternatives. Don't confuse them.
                  </p>
                  <div className="text-sm mt-2">
                    <p><span className="text-teal">✓</span> "<strong>If</strong> the file exists, open it." (condition)</p>
                    <p><span className="text-teal">✓</span> "Check <strong>whether</strong> the file exists." (alternative)</p>
                    <p><span className="text-coral">❌</span> "Check if the file exists." (incorrect)</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">6</span>
                    Be Consistent
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pick a style and stick with it. If you call it a "dialog box" once, don't
                    call it a "dialogue" or "popup" later. Consistency reduces cognitive load.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ego Trip Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
            <img 
              src="/images/techwriting-ego.jpg" 
              alt="Illustration of a writer on an ego trip - a 1950s character dramatically pointing to themselves while readers look confused and annoyed, with 'I think' and 'In my opinion' speech bubbles"
              className="w-full h-auto"
            />
          </div>

          {/* Additional Style Rules */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">More Style Commandments</h3>
              <p className="text-sm text-coral font-medium mb-4 italic">
                "Writer Confuses 'Its' and 'It's' in Production Documentation; Entire Engineering Team Questions Reality"
              </p>
              
              <div className="space-y-4">
                {/* It's vs Its */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">7</span>
                    The "It's" vs "Its" Conundrum
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    This trips up even native speakers. <strong>"It's"</strong> is a contraction of "it is."
                    <strong>"Its"</strong> is the possessive form. When in doubt, expand it: if "it is" works,
                    use "it's." If not, use "its."
                  </p>
                  <div className="text-sm mt-2">
                    <p><span className="text-teal">✓</span> "The function returns <strong>its</strong> value." (possessive)</p>
                    <p><span className="text-teal">✓</span> "<strong>It is</strong> important to validate input." (write it out!)</p>
                    <p><span className="text-coral">❌</span> "It's return value is null." (wrong!)</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    Pro tip: In technical writing, just write "it is" instead of "it's" and the problem vanishes.
                  </p>
                </div>

                {/* A vs An */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">8</span>
                    The "A" vs "An" Rule (It's Not What You Think)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The rule is not "a before consonants, an before vowels." The rule is about <em>sound</em>,
                    not spelling. Use "an" before vowel <em>sounds</em>.
                  </p>
                  <div className="text-sm mt-2">
                    <p><span className="text-teal">✓</span> "<strong>An</strong> HTTP request" (H is silent, sounds like "aitch")</p>
                    <p><span className="text-teal">✓</span> "<strong>A</strong> URL" (sounds like "yoo-are-ell")</p>
                    <p><span className="text-teal">✓</span> "<strong>An</strong> SQL query" (sounds like "ess-cue-ell")</p>
                    <p><span className="text-teal">✓</span> "<strong>A</strong> user" (sounds like "yoo-zer")</p>
                    <p><span className="text-coral">❌</span> "A HTTP request" (wrong sound!)</p>
                  </div>
                </div>

                {/* Nativisms */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">9</span>
                    Beware of Nativisms
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    If you are not a native English speaker, be suspicious of translations that seem
                    "too obvious." Many words that look similar across languages have different meanings.
                    These are called "false friends."
                  </p>
                  <div className="text-sm mt-2">
                    <p><span className="text-coral">❌</span> "Concurrence" (sounds like German "Konkurrenz") → <span className="text-teal">✓</span> "Competition"</p>
                    <p><span className="text-coral">❌</span> "Actual" (sounds like German "aktuell") → <span className="text-teal">✓</span> "Current"</p>
                    <p><span className="text-coral">❌</span> "Eventually" (sounds like German "eventuell") → <span className="text-teal">✓</span> "Possibly"</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    When in doubt, consult a dictionary. If you can translate a sentence word-by-word
                    back to your native language, you probably made a mistake.
                  </p>
                </div>

                {/* Ego Trip */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">10</span>
                    The Ego Trip: Never Use "I"
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The word "I" is anathema in technical writing. You are dealing with objective facts,
                    not personal opinions. Technical documentation is not your diary.
                  </p>
                  <div className="text-sm mt-2">
                    <p><span className="text-coral">❌</span> "I think this function should be called first."</p>
                    <p><span className="text-coral">❌</span> "I recommend using the async version."</p>
                    <p><span className="text-teal">✓</span> "This function should be called first."</p>
                    <p><span className="text-teal">✓</span> "The async version is recommended."</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    If you must include yourself, use "we" to forge a bond with the reader—"we will now
                    explore..." Julius Caesar wrote his military accounts in third person. It worked for him.
                  </p>
                </div>

                {/* This/That Overuse */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">11</span>
                    "This" Sentence Does Overdo It
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Overusing demonstrative pronouns ("this," "that," "these," "those") creates ambiguity.
                    When you write "this," the reader must hunt backward to find what "this" refers to.
                  </p>
                  <div className="text-sm mt-2">
                    <p><span className="text-coral">❌</span> "This is important. This should be done first. This prevents errors."</p>
                    <p><span className="text-teal">✓</span> "Input validation is important. Validation should be done first. Early validation prevents errors."</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    Rule: If you can replace "this" with a specific noun, do it. Your readers will thank you.
                  </p>
                </div>

                {/* Tense Consistency */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">12</span>
                    Time Is On Our Side: Tense Consistency
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Pick a tense and stick with it. Switching between past, present, and future within
                    a paragraph is disorienting. For procedures, use present tense. For changelogs, use past.
                  </p>
                  <div className="text-sm mt-2">
                    <p><span className="text-coral">❌</span> "The function returns a value. It processed the input. It will validate the result."</p>
                    <p><span className="text-teal">✓</span> "The function returns a value. It processes the input. It validates the result."</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    Exception: When describing a sequence of events, past → present → future makes sense.
                    But within a single concept explanation, stay in one tense.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pet Peeves Graphic */}
          <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
            <img 
              src="/images/techwriting-petpeeves.jpg" 
              alt="Illustration of a frustrated 1950s editor with red pen, surrounded by floating grammar mistakes like 'very unique' and 'more optimal' - each mistake has a dramatic red X through it"
              className="w-full h-auto"
            />
          </div>

          <Card className="mb-6 border-coral/30 bg-coral/5">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-coral" />
                Editor's Pet Peeves: Grammar & Logic
              </h3>
              <p className="text-sm text-coral font-medium mb-4 italic">
                "Editor Returns 47-Page Document With Single Comment: 'No'"
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                  <span className="text-sm"><strong>"very unique"</strong> — Something is either unique or it isn't. There are no degrees of uniqueness.</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                  <span className="text-sm"><strong>"more optimal"</strong> — Optimal means best. You cannot be more best. Use "better" or "more efficient."</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                  <span className="text-sm"><strong>"irregardless"</strong> — Not a word. Use "regardless." The "ir-" adds nothing but pain.</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                  <span className="text-sm"><strong>"could of"</strong> — You mean "could have." This error comes from mishearing "could've."</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                  <span className="text-sm"><strong>"less" vs "fewer"</strong> — "Less" for uncountable (less water), "fewer" for countable (fewer bugs).</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                  <span className="text-sm"><strong>"once" vs "after" vs "when"</strong> — "Once" for time references, "after" for completed events, "when" for simultaneous actions.</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                  <span className="text-sm"><strong>"over" vs "more than"</strong> — "Over" for barriers/limits, "more than" for numbers. "More than 60 hours," not "over 60 hours."</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                  <span className="text-sm"><strong>"since" vs "because"</strong> — "Since" for time ("since yesterday"), "because" for reasons ("because it failed").</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                  <span className="text-sm"><strong>"There is/are"</strong> — Sentences starting with "There is" are usually clearer when rewritten. "There is a bug" → "A bug exists."</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Editor's Pet Peeves: Spelling & Terminology
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Technical writing has specific conventions. Memorize these or face the wrath of every editor who has ever lived.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <p><strong>backward, toward, forward</strong> — No "s" on any of these</p>
                  <p><strong>check box</strong> — Two words, not "checkbox"</p>
                  <p><strong>back up</strong> (verb) vs <strong>backup</strong> (noun)</p>
                  <p><strong>set up</strong> (verb) vs <strong>setup</strong> (noun)</p>
                  <p><strong>log in</strong> (verb) vs <strong>login</strong> (noun/adj)</p>
                  <p><strong>drop-down</strong> (adj) vs <strong>drop down</strong> (verb)</p>
                  <p><strong>double-click, right-click</strong> — Always hyphenated as verbs</p>
                  <p><strong>email</strong> — No hyphen, no capitalization</p>
                  <p><strong>filename</strong> — One word</p>
                  <p><strong>home page</strong> — Two words</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>inline</strong> — One word</p>
                  <p><strong>Internet</strong> (uppercase) vs <strong>intranet</strong> (lowercase)</p>
                  <p><strong>disc</strong> (CD/optical) vs <strong>disk</strong> (hard/floppy)</p>
                  <p><strong>Web</strong> — Always uppercase when referring to WWW</p>
                  <p><strong>URL</strong> — Uniform (not Universal) Resource Locator</p>
                  <p><strong>HTML</strong> — Hypertext (lowercase "t") Markup Language</p>
                  <p><strong>KB</strong> (kilobyte) vs <strong>Kb</strong> (kilobit)</p>
                  <p><strong>MB</strong> (megabyte) vs <strong>Mb</strong> (megabit)</p>
                  <p><strong>ms</strong> — millisecond (lowercase)</p>
                  <p><strong>up-to-date</strong> — Always hyphenated</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 italic">
                Pro tip: Create a style guide for your project and enforce it ruthlessly. Consistency matters more than which convention you choose.
              </p>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="technical-writing"
            topicId="style"
            question="Which sentence follows technical writing best practices?"
            options={[
              "I think you should utilize the new API to facilitate data transfer.",
              "The new API can be used to transfer data.",
              "It's possible that the API could maybe help with transferring data.",
              "We believe utilizing the new API would be very optimal."
            ]}
            correctAnswer={1}
            explanation="Option B is correct: it avoids first person ('I think', 'we believe'), uses simple words ('used' not 'utilize'), is direct and factual, and avoids hedging language ('could maybe')."
            eli5Explanation="Good technical writing is like giving directions. You don't say 'I think you should maybe possibly turn left.' You say 'Turn left.' Be clear, be simple, be sure. No fancy words, no 'I think'—just tell them what to do!"
          />
        </section>

        <Separator className="my-12" />

        {/* Topic 5: Document Structure */}
        <section className="mb-12" id="structure">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <List className="w-8 h-8 text-primary" />
            Document Structure
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Documentation Has No Table of Contents; Readers Wander Aimlessly for Hours"
          </p>

          <p className="text-lg leading-relaxed mb-6">
            A well-structured document is like a well-organized codebase. You should be able to
            find what you need without reading everything. Here's how to structure your documents
            for maximum usability.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Anatomy of a Technical Document</h3>
              
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <h4 className="font-bold">1. Title</h4>
                  <p className="text-sm text-muted-foreground">
                    Clear, descriptive, and specific. "API Documentation" is bad. "REST API
                    Reference for User Authentication Service v2.0" is good.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <h4 className="font-bold">2. Table of Contents</h4>
                  <p className="text-sm text-muted-foreground">
                    For any document over 3 pages. Readers should be able to jump to what they need.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <h4 className="font-bold">3. Introduction/Overview</h4>
                  <p className="text-sm text-muted-foreground">
                    What is this document about? Who is it for? What will the reader learn?
                    Set expectations upfront.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <h4 className="font-bold">4. Prerequisites</h4>
                  <p className="text-sm text-muted-foreground">
                    What does the reader need to know before reading? What software/tools are required?
                    Don't make them discover this halfway through.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <h4 className="font-bold">5. Main Content (Sections)</h4>
                  <p className="text-sm text-muted-foreground">
                    Organized logically, building from simple to complex. Each section should be
                    self-contained enough to be useful on its own.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <h4 className="font-bold">6. Examples</h4>
                  <p className="text-sm text-muted-foreground">
                    Real, working examples. Not pseudo-code. Not "exercise left to reader."
                    Copy-paste-able code that actually works.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <h4 className="font-bold">7. Troubleshooting/FAQ</h4>
                  <p className="text-sm text-muted-foreground">
                    Common problems and solutions. This section will save you from answering the
                    same questions repeatedly.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <h4 className="font-bold">8. References/Further Reading</h4>
                  <p className="text-sm text-muted-foreground">
                    Links to related documentation, specifications, or resources for readers who
                    want to go deeper.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="technical-writing"
            topicId="structure"
            question="What should come BEFORE the main content in a technical document?"
            options={[
              "Examples and code samples",
              "Troubleshooting section",
              "Prerequisites and introduction",
              "References and further reading"
            ]}
            correctAnswer={2}
            explanation="Prerequisites and introduction should come before main content so readers know what they need before starting and understand what the document covers. Examples support the main content, and troubleshooting/references come at the end."
            eli5Explanation="Before you start building with LEGOs, you need to know what pieces you need (prerequisites) and what you're building (introduction). You don't start with 'what to do if it breaks' (troubleshooting)—that comes after you've tried to build it!"
          />
        </section>

        <Separator className="my-12" />

        {/* Recommended Reading */}
        <section className="mb-12" id="reading">
          <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Recommended Reading
          </h2>
          <p className="text-sm text-coral font-medium mb-6 italic">
            "Developer Reads Entire Style Guide; Coworkers Suspect Alien Abduction"
          </p>

          <p className="text-lg leading-relaxed mb-6">
            No guide can cover everything. Here are the essential texts that will transform you from
            a documentation dabbler into a technical writing virtuoso.
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">The Essential Shelf</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-1">Strunk & White: "The Elements of Style"</h4>
                  <p className="text-sm text-muted-foreground">
                    The Bible of concise writing. At under 100 pages, it has no excuse not to be read.
                    Rule #17: "Omit needless words." This book practices what it preaches.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-1">"The Chicago Manual of Style"</h4>
                  <p className="text-sm text-muted-foreground">
                    The comprehensive reference for American English style. When you need to know
                    whether to use an Oxford comma (yes) or how to cite a tweet (unfortunately, yes).
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-1">Fowler: "The King's English"</h4>
                  <p className="text-sm text-muted-foreground">
                    For those who want to understand the "why" behind English conventions. Dated but
                    delightful. The linguistic equivalent of a well-aged whisky.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-bold mb-1">Stephen King: "On Writing"</h4>
                  <p className="text-sm text-muted-foreground">
                    Not technical writing per se, but brilliant insights on clarity and craft. Plus,
                    it's actually enjoyable to read—a rare quality in writing guides.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-teal/30 bg-teal/5">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-bold mb-4">Exemplary Technical Writing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn by reading the masters. These texts demonstrate that technical content can be
                both precise and engaging.
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <h4 className="font-bold text-sm">Donald Knuth: "The TeXbook"</h4>
                  <p className="text-xs text-muted-foreground">
                    One of the finest software manuals ever written. Even arcane typesetting concepts
                    become accessible through Knuth's masterful explanations.
                  </p>
                </div>

                <div className="p-3 bg-background rounded">
                  <h4 className="font-bold text-sm">Douglas Hofstadter: "Gödel, Escher, Bach"</h4>
                  <p className="text-xs text-muted-foreground">
                    Proves that complex topics (AI, recursion, formal systems) can be explained with
                    wit and creativity. A Pulitzer Prize winner that's actually readable.
                  </p>
                </div>

                <div className="p-3 bg-background rounded">
                  <h4 className="font-bold text-sm">Robert Pirsig: "Zen and the Art of Motorcycle Maintenance"</h4>
                  <p className="text-xs text-muted-foreground">
                    Technical writing meets philosophy. Shows how to explain mechanical concepts while
                    exploring deeper questions about quality and craftsmanship.
                  </p>
                </div>

                <div className="p-3 bg-background rounded">
                  <h4 className="font-bold text-sm">The VAX Manuals ("The Orange Wall")</h4>
                  <p className="text-xs text-muted-foreground">
                    Legendary in the industry. Proof that comprehensive documentation can be both
                    thorough and usable. The gold standard against which all manuals are measured.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MicroQuiz
            courseId="technical-writing"
            topicId="reading"
            question="According to Strunk & White's famous rule, what should you do with needless words?"
            options={[
              "Highlight them for emphasis",
              "Replace them with synonyms",
              "Omit them",
              "Move them to footnotes"
            ]}
            correctAnswer={2}
            explanation="Strunk & White's Rule #17 states: 'Omit needless words.' Vigorous writing is concise. Every word should serve a purpose. If a word doesn't add meaning, remove it."
            eli5Explanation="Imagine you're packing a backpack for a hike. You only want to carry things you need, right? Words are the same! Extra words are like carrying rocks—they just make everything heavier and slower. If you don't need a word, leave it out!"
          />
        </section>

        <Separator className="my-12" />

        {/* Summary */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-amber-500/10 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-display text-2xl font-bold mb-4">Course Summary</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Three Pillars:</strong> Legibility, Readability, and Comprehensibility—master all three.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Sentence Length:</strong> Aim for 10-15 words, never exceed 20. Vary your rhythm.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Four-Step Explanation:</strong> Definition → Theorem → Proof → Conclusion.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Simple Words:</strong> "Use" not "utilize." Clarity beats sophistication.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Structure Matters:</strong> Title, TOC, Intro, Prerequisites, Content, Examples, FAQ, References.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Repeat Yourself:</strong> The human mind needs reinforcement. Summarize key points.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Cheat Sheet Download */}
        <section className="mb-12">
          <CheatSheetDownload courseId="technical-writing" courseName="Technical Writing Made Easier" />
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/commenting-guide">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Commenting Guide
            </Button>
          </Link>
          <Link href="/learning-progress">
            <Button className="gap-2">
              View Your Progress
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </article>
    </Layout>
  );
}
