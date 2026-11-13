import { TopicPageWrapper } from "@/components/TopicPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MicroQuiz } from "@/components/MicroQuiz";
import { FileText } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Readability() {
  usePageMeta({
    title: "Technical Writing - Readability",
    description: "Educational module on readability in technical documentation. Part of GRACE Academy curriculum.",
    keywords: "readability education, technical documentation, professional writing course, GRACE Academy"
  });

  return (
    <TopicPageWrapper
      courseTitle="Technical Writing"
      topicTitle="Readability: Making Text Flow"
      topicSubtitle="Engineer's 200-Word Sentence Sets New Record; Readers Still Lost at Word 47"
      duration="~5 min"
      topicNumber={2}
      totalTopics={5}
      prevPath="/technical-writing-guide/three-pillars"
      prevLabel="Three Pillars"
      nextPath="/technical-writing-guide/comprehensibility"
      nextLabel="Comprehensibility"
    >
      {/* Hero Graphic */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border paper-shadow">
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/PkMfshfozsCOQkpN.jpg" 
          alt="Illustration comparing sentence lengths"
          className="w-full h-auto"
        />
      </div>

      {/* Reader's Question */}
      <Card className="bg-primary/5 border-primary/20 mb-6">
        <CardContent className="pt-6">
          <p className="text-lg italic text-foreground">
            <strong>Dear Marilyn:</strong> My sentences are grammatically correct. Why do
            people still complain they're hard to read?
          </p>
          <p className="text-right text-muted-foreground mt-4">— Grammatically Correct in Georgia</p>
        </CardContent>
      </Card>

      {/* Marilyn's Response */}
      <section className="prose prose-lg max-w-none mb-8">
        <p className="text-lg leading-relaxed">
          <strong>Dear Grammatically:</strong> Grammar is necessary but not sufficient. A
          grammatically correct sentence can still be a nightmare to read. The key requirements
          for readability are:
        </p>
      </section>

      {/* The Five Rules */}
      <Card className="mb-8">
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

      {/* Quiz */}
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
    </TopicPageWrapper>
  );
}
