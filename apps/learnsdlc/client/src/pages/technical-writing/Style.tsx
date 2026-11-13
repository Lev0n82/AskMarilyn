import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { Sparkles, AlertTriangle, XCircle } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Style() {
  usePageMeta({
    title: "Technical Writing - Style",
    description: "Educational module on writing style in technical documentation. Part of GRACE Academy curriculum.",
    keywords: "writing style education, technical documentation style, professional writing course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Technical Writing"
      topicTitle="Matters of Style"
      topicSubtitle="Technical Writer Uses 'Utilize' Instead of 'Use'; Readers Lose Will to Live"
      duration="~8 min"
      topicNumber={4}
      totalTopics={5}
      prevPath="/technical-writing-guide/comprehensibility"
      prevLabel="Comprehensibility"
      nextPath="/technical-writing-guide/structure"
      nextLabel="Document Structure"
    >
      {/* Introduction */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          Even technical prose doesn't have to be a blunt axe when it could be an instrument of
          precision. Here are the style rules that separate professional documentation from
          amateur hour.
        </p>
      </section>

      {/* The Style Commandments */}
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
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/IMXrSNlidBOZocIK.jpg" 
          alt="Illustration of a writer on an ego trip"
          className="w-full h-auto"
        />
      </div>

      {/* More Style Rules */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4">More Style Commandments</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">7</span>
                The "It's" vs "Its" Conundrum
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>"It's"</strong> is a contraction of "it is."
                <strong>"Its"</strong> is the possessive form. When in doubt, expand it.
              </p>
              <div className="text-sm mt-2">
                <p><span className="text-teal">✓</span> "The function returns <strong>its</strong> value." (possessive)</p>
                <p><span className="text-teal">✓</span> "<strong>It is</strong> important to validate input." (write it out!)</p>
                <p><span className="text-coral">❌</span> "It's return value is null." (wrong!)</p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">8</span>
                The "A" vs "An" Rule (It's About Sound)
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Use "an" before vowel <em>sounds</em>, not vowel letters.
              </p>
              <div className="text-sm mt-2">
                <p><span className="text-teal">✓</span> "<strong>An</strong> HTTP request" (H sounds like "aitch")</p>
                <p><span className="text-teal">✓</span> "<strong>A</strong> URL" (sounds like "yoo-are-ell")</p>
                <p><span className="text-teal">✓</span> "<strong>An</strong> SQL query" (sounds like "ess-cue-ell")</p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">9</span>
                The Ego Trip: Never Use "I"
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                The word "I" is anathema in technical writing. You are dealing with objective facts,
                not personal opinions.
              </p>
              <div className="text-sm mt-2">
                <p><span className="text-coral">❌</span> "I think this function should be called first."</p>
                <p><span className="text-teal">✓</span> "This function should be called first."</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pet Peeves */}
      <Card className="mb-6 border-coral/30 bg-coral/5">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-coral" />
            Editor's Pet Peeves: Grammar & Logic
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
              <span className="text-sm"><strong>"very unique"</strong> — Something is either unique or it isn't.</span>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
              <span className="text-sm"><strong>"more optimal"</strong> — Optimal means best. Use "better."</span>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
              <span className="text-sm"><strong>"irregardless"</strong> — Not a word. Use "regardless."</span>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
              <span className="text-sm"><strong>"less" vs "fewer"</strong> — "Less" for uncountable, "fewer" for countable.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spelling Conventions */}
      <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-6">
          <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Spelling & Terminology Conventions
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <p><strong>backward, toward, forward</strong> — No "s"</p>
              <p><strong>back up</strong> (verb) vs <strong>backup</strong> (noun)</p>
              <p><strong>set up</strong> (verb) vs <strong>setup</strong> (noun)</p>
              <p><strong>log in</strong> (verb) vs <strong>login</strong> (noun)</p>
              <p><strong>email</strong> — No hyphen</p>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>filename</strong> — One word</p>
              <p><strong>home page</strong> — Two words</p>
              <p><strong>Internet</strong> (uppercase)</p>
              <p><strong>KB</strong> (kilobyte) vs <strong>Kb</strong> (kilobit)</p>
              <p><strong>up-to-date</strong> — Always hyphenated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz */}
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
    </TopicPageWrapper>
  );
}
