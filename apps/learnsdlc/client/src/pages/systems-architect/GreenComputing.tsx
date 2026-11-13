import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Leaf } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function GreenComputing() {
  usePageMeta({
    title: "Systems Architecture - Green Computing",
    description: "Educational module on sustainable computing and green IT practices. Part of GRACE Academy curriculum.",
    keywords: "green computing education, sustainable IT training, systems architecture course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/systems-architect" className="hover:text-primary">Systems Architect</Link>
          <span>/</span>
          <span className="text-foreground">Module 3</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-primary flex items-center gap-3">
            <Leaf className="w-10 h-10 text-green-500" />
            Green Computing: Sustainable Architecture
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~20 min read
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
                I keep hearing that data centers consume more electricity than some countries. As a systems architect, I feel responsible but helpless. Our business demands more compute, more storage, more AI training. How can I design systems that are both powerful AND sustainable?
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">T</span>he good news is that sustainability and efficiency are often the same thing. A system that wastes energy is usually also wasting money and performance. The principles of green computing aren't sacrifices—they're optimizations.
            </p>
            <p className="font-sans leading-relaxed">
              Let me show you how thoughtful architecture can reduce your carbon footprint while actually improving your systems.
            </p>
          </div>
        </section>

        {/* The Spark: Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding Green Computing
          </h2>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">The Carbon Footprint of Software</h3>
            <p className="font-sans leading-relaxed">
              Software has three types of carbon emissions:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Type</th>
                    <th className="border border-border p-3 text-left">Source</th>
                    <th className="border border-border p-3 text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-bold">Embodied Carbon</td>
                    <td className="border border-border p-3">Manufacturing hardware (servers, devices)</td>
                    <td className="border border-border p-3">Building a new data center</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Operational Carbon</td>
                    <td className="border border-border p-3">Energy consumed while running</td>
                    <td className="border border-border p-3">Electricity for compute and cooling</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Downstream Carbon</td>
                    <td className="border border-border p-3">Energy consumed by users</td>
                    <td className="border border-border p-3">User devices loading your website</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="systems-architect"
              topicId="green-computing"
              question="Which type of carbon emission comes from manufacturing the hardware that runs your software?"
              options={[
                "Operational Carbon",
                "Downstream Carbon",
                "Embodied Carbon",
                "Virtual Carbon"
              ]}
              correctAnswer={2}
              explanation="Embodied carbon refers to the emissions from manufacturing hardware. This is why extending hardware lifespan and using existing capacity efficiently matters."
              eli5Explanation="Think of buying a car. Before you even drive it, there's pollution from building it in the factory. That's embodied carbon. The gas you burn driving is operational carbon."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Carbon-Aware Computing</h3>
            <p className="font-sans leading-relaxed">
              Not all electricity is equally dirty. The carbon intensity of the grid varies by:
            </p>

            <ul className="list-disc list-inside space-y-2">
              <li><strong>Location:</strong> Regions with more renewable energy have lower carbon intensity</li>
              <li><strong>Time:</strong> Solar power is available during the day, wind varies by weather</li>
              <li><strong>Demand:</strong> Peak hours often require firing up dirtier "peaker" plants</li>
            </ul>

            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h4 className="font-bold text-green-700 dark:text-green-300 mb-3">Carbon-Aware Strategies:</h4>
                <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200">
                  <li><strong>Spatial Shifting:</strong> Run workloads in regions with cleaner grids</li>
                  <li><strong>Temporal Shifting:</strong> Schedule batch jobs when carbon intensity is low</li>
                  <li><strong>Demand Shaping:</strong> Reduce compute during high-carbon periods</li>
                </ul>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="systems-architect"
              topicId="green-computing"
              question="What is 'temporal shifting' in carbon-aware computing?"
              options={[
                "Moving servers to a different time zone",
                "Scheduling workloads to run when grid carbon intensity is lower",
                "Changing the clock on your servers",
                "Running code faster to save energy"
              ]}
              correctAnswer={1}
              explanation="Temporal shifting means scheduling flexible workloads (like batch processing, ML training, backups) to run when the electricity grid has more renewable energy and lower carbon intensity."
              eli5Explanation="It's like doing laundry when electricity is cheapest and cleanest. If solar panels make lots of clean energy at noon, run your big computing jobs then instead of at midnight when dirty coal plants are running."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Efficient Architecture Patterns</h3>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">1. Right-Sizing Resources</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Most cloud instances run at 10-20% CPU utilization. Right-size your instances, use autoscaling, and consider serverless for variable workloads. An idle server still consumes 60-70% of its peak power.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">2. Efficient Data Storage</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Implement data lifecycle policies. Move cold data to cheaper, more efficient storage tiers. Delete data you don't need. Compress aggressively. Every byte stored consumes energy forever.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">3. Caching Everything</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The greenest computation is the one you don't do. Cache at every layer: CDN, application, database. A cache hit uses a fraction of the energy of recomputing or refetching.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold">4. Efficient Algorithms</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    An O(n²) algorithm doesn't just run slower—it consumes more energy. Choose efficient data structures and algorithms. Profile and optimize hot paths. Sometimes the greenest code is simply better code.
                  </p>
                </CardContent>
              </Card>
            </div>

            <MicroQuiz
              courseId="systems-architect"
              topicId="green-computing"
              question="Why is caching considered a green computing strategy?"
              options={[
                "Caches use special low-power hardware",
                "Cached responses avoid recomputation, saving energy",
                "Caches are painted green",
                "Caching is required by environmental regulations"
              ]}
              correctAnswer={1}
              explanation="Caching stores previously computed results, so subsequent requests can be served without repeating the computation. This dramatically reduces CPU cycles and energy consumption."
              eli5Explanation="Imagine if every time someone asked you 'What's 2+2?', you had to count on your fingers. That's tiring! But if you remember the answer is 4, you save all that effort. Caching is your computer remembering answers."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Green AI and Machine Learning</h3>
            <p className="font-sans leading-relaxed">
              AI training is notoriously energy-intensive. Training GPT-3 consumed an estimated 1,287 MWh—equivalent to the annual electricity use of 120 US homes. Here's how to reduce AI's footprint:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Strategy</th>
                    <th className="border border-border p-3 text-left">Description</th>
                    <th className="border border-border p-3 text-left">Energy Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-bold">Model Distillation</td>
                    <td className="border border-border p-3">Train smaller models to mimic larger ones</td>
                    <td className="border border-border p-3">10-100x reduction</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Quantization</td>
                    <td className="border border-border p-3">Use lower precision numbers (INT8 vs FP32)</td>
                    <td className="border border-border p-3">2-4x reduction</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Pruning</td>
                    <td className="border border-border p-3">Remove unnecessary model weights</td>
                    <td className="border border-border p-3">2-10x reduction</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-bold">Transfer Learning</td>
                    <td className="border border-border p-3">Fine-tune existing models instead of training from scratch</td>
                    <td className="border border-border p-3">100-1000x reduction</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MicroQuiz
              courseId="systems-architect"
              topicId="green-computing"
              question="Which technique trains a smaller, more efficient model to mimic a larger one?"
              options={[
                "Quantization",
                "Model Distillation",
                "Pruning",
                "Transfer Learning"
              ]}
              correctAnswer={1}
              explanation="Model distillation trains a smaller 'student' model to replicate the behavior of a larger 'teacher' model, achieving similar performance with much less compute."
              eli5Explanation="It's like having a master chef teach a home cook their best recipes. The home cook won't know EVERYTHING the master knows, but they can make the same popular dishes almost as well, with a much smaller kitchen."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Measuring and Reporting</h3>
            <p className="font-sans leading-relaxed">
              You can't improve what you don't measure. Key metrics for green computing:
            </p>

            <ul className="list-disc list-inside space-y-2">
              <li><strong>Power Usage Effectiveness (PUE):</strong> Total facility energy / IT equipment energy (ideal: 1.0)</li>
              <li><strong>Carbon Usage Effectiveness (CUE):</strong> CO2 emissions / IT equipment energy</li>
              <li><strong>Software Carbon Intensity (SCI):</strong> Carbon per functional unit (e.g., per request, per user)</li>
              <li><strong>Energy Proportionality:</strong> How well energy scales with actual utilization</li>
            </ul>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <h4 className="font-bold mb-3">Tools for Measurement:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Cloud Carbon Footprint:</strong> Open-source tool for cloud emissions</li>
                  <li><strong>Electricity Maps API:</strong> Real-time grid carbon intensity</li>
                  <li><strong>Green Software Foundation SCI:</strong> Standardized carbon intensity metric</li>
                  <li><strong>Kepler:</strong> Kubernetes-based energy monitoring</li>
                </ul>
              </CardContent>
            </Card>

            <MicroQuiz
              courseId="systems-architect"
              topicId="green-computing"
              question="What does a PUE (Power Usage Effectiveness) of 1.5 mean?"
              options={[
                "The data center is 50% efficient",
                "For every 1 watt used by IT equipment, 0.5 watts are used for cooling and overhead",
                "The data center uses 1.5 megawatts",
                "The servers run at 150% capacity"
              ]}
              correctAnswer={1}
              explanation="PUE is total facility power divided by IT equipment power. A PUE of 1.5 means for every watt powering servers, an additional 0.5 watts goes to cooling, lighting, and other overhead. Lower is better."
              eli5Explanation="If you spend $1.50 to get $1.00 worth of actual computing done, the extra $0.50 went to keeping the building cool and the lights on. PUE tells you how much of your electricity bill actually does useful work."
            />
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/systems-architect/platform-engineering">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: Platform Engineering
            </Button>
          </Link>
          <Link href="/systems-architect">
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
