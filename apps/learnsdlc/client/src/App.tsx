import EvidenceDesk from "./pages/evidence-desk";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import Home from "./pages/Home";
import Module1 from "./pages/Module1";
import Module2 from "./pages/Module2";
import Module3 from "./pages/Module3";
import Module4 from "./pages/Module4";
import Module5 from "./pages/Module5";
import Module6 from "./pages/Module6";
import Module7 from "./pages/Module7";
import Module8 from "./pages/Module8";
import Module9 from "./pages/Module9";
import Module10 from "./pages/Module10";
import RefactoringChallenge from "./pages/RefactoringChallenge";
import BossLevel from "./pages/BossLevel";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import TestBuilder from "./pages/TestBuilder";
import Certificate from "./pages/Certificate";
import Badges from "./pages/Badges";
import Forum from "./pages/Forum";
import Profile from "./pages/Profile";
import CodingStyleGuide from "./pages/CodingStyleGuide";
import { FileOrganization, Indentation, NamingConventions, Statements, WhiteSpace, CodingStyleQuiz } from "./pages/coding-style";
import CommentingGuide from "./pages/CommentingGuide";
import { CaseAgainst, CommentTypes, StyleGuidelines, XmlDocumentation, CommentingQuiz } from "./pages/commenting";
import TechnicalWritingGuide from "./pages/TechnicalWritingGuide";
import { ThreePillars, Readability, Comprehensibility, Style, Structure, TechWritingQuiz } from "./pages/technical-writing";
import LearningProgress from "./pages/LearningProgress";
import CourseCertificate from "./pages/CourseCertificate";
import CourseCatalog from "./pages/CourseCatalog";
import GraceAcademyIndex from "./pages/grace-academy";
import GraceModulePage from "./pages/grace-academy/GraceModuleTemplate";
import GraceModuleFullPage from "./pages/grace-academy/GraceModuleFull";
import IntermediateIntro from "./pages/grace-academy/IntermediateIntro";
import AdvancedIntro from "./pages/grace-academy/AdvancedIntro";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import { FloatingFeedback } from "./components/FloatingFeedback";
import { FloatingAccessibility } from "./components/FloatingAccessibility";
import SkipLink from "./components/SkipLink";
import SystemsArchitect from "./pages/SystemsArchitect";
import DBA from "./pages/DBA";
import DataScientist from "./pages/DataScientist";
import HealthcareArchitect from "./pages/HealthcareArchitect";
import { HL7Evolution, FHIRResources, SMARTonFHIR } from "./pages/healthcare";
import SqlInjection from "./pages/SqlInjection";
import { AgenticAI, PlatformEngineering, GreenComputing } from "./pages/systems-architect";
import { ACIDTransactions, VectorDatabases, SecurityFortress } from "./pages/dba";
import { LLMRevolution, RAGArchitecture, MLOps } from "./pages/data-scientist";
import Accessibility from "./pages/Accessibility";
import AllCourses from "./pages/AllCourses";
import CMakeMasteryIndex from "./pages/cmake-mastery/index";
import CMakeModule from "./pages/cmake-mastery/CMakeModule";
import CMakeDashboard from "./pages/cmake-mastery/CMakeDashboard";
import StfIndex from "./pages/stf/index";
import StfModule from "./pages/stf/StfModule";
import StfDashboard from "./pages/stf/StfDashboard";

// GRACE Module wrapper components
const GraceModule1 = () => <GraceModuleFullPage moduleNumber={1} />;
const GraceModule2 = () => <GraceModulePage moduleNumber={2} />;
const GraceModule3 = () => <GraceModulePage moduleNumber={3} />;
const GraceModule4 = () => <GraceModulePage moduleNumber={4} />;
const GraceModule5 = () => <GraceModulePage moduleNumber={5} />;
const GraceModule6 = () => <GraceModulePage moduleNumber={6} />;
const GraceModule7 = () => <GraceModulePage moduleNumber={7} />;
const GraceModule8 = () => <GraceModulePage moduleNumber={8} />;
const GraceModule9 = () => <GraceModulePage moduleNumber={9} />;
const GraceModule10 = () => <GraceModulePage moduleNumber={10} />;
const GraceModule11 = () => <GraceModulePage moduleNumber={11} />;
const GraceModule12 = () => <GraceModulePage moduleNumber={12} />;
const GraceModule13 = () => <GraceModulePage moduleNumber={13} />;
const GraceModule14 = () => <GraceModulePage moduleNumber={14} />;
const GraceModule15 = () => <GraceModulePage moduleNumber={15} />;
const GraceModule16 = () => <GraceModulePage moduleNumber={16} />;
const GraceModule17 = () => <GraceModulePage moduleNumber={17} />;
const GraceModule18 = () => <GraceModulePage moduleNumber={18} />;
const GraceModule19 = () => <GraceModulePage moduleNumber={19} />;
const GraceModule20 = () => <GraceModulePage moduleNumber={20} />;
const GraceModule21 = () => <GraceModulePage moduleNumber={21} />;
const GraceModule22 = () => <GraceModulePage moduleNumber={22} />;
const GraceModule23 = () => <GraceModulePage moduleNumber={23} />;
const GraceModule24 = () => <GraceModulePage moduleNumber={24} />;
const GraceModule25 = () => <GraceModulePage moduleNumber={25} />;
const GraceModule26 = () => <GraceModulePage moduleNumber={26} />;
const GraceModule27 = () => <GraceModulePage moduleNumber={27} />;
const GraceModule28 = () => <GraceModulePage moduleNumber={28} />;
const GraceModule29 = () => <GraceModulePage moduleNumber={29} />;
const GraceModule30 = () => <GraceModulePage moduleNumber={30} />;

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/evidence-desk/v3" component={EvidenceDesk} />
      <Route path="/evidence-desk/v3/*" component={EvidenceDesk} />
      <Route path="/" component={AllCourses} />
      <Route path="/all-courses" component={AllCourses} />
      <Route path="/abt-intro" component={Home} />
      {/* Action Based Testing modules */}
      <Route path="/module-1" component={Module1} />
      <Route path="/module-2" component={Module2} />
      <Route path="/module-3" component={Module3} />
      <Route path="/module-4" component={Module4} />
      <Route path="/module-5" component={Module5} />
      <Route path="/module-6" component={Module6} />
      <Route path="/module-7" component={Module7} />
      <Route path="/module-8" component={Module8} />
      <Route path="/module-9" component={Module9} />
      <Route path="/module-10" component={Module10} />
      <Route path="/refactoring-challenge" component={RefactoringChallenge} />
      <Route path="/boss-level" component={BossLevel} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/test-builder" component={TestBuilder} />
      <Route path="/certificate" component={Certificate} />
      <Route path="/badges" component={Badges} />
      <Route path="/forum" component={Forum} />
      <Route path="/profile" component={Profile} />
      <Route path="/coding-style-guide" component={CodingStyleGuide} />
      <Route path="/coding-style-guide/file-organization" component={FileOrganization} />
      <Route path="/coding-style-guide/indentation" component={Indentation} />
      <Route path="/coding-style-guide/naming-conventions" component={NamingConventions} />
      <Route path="/coding-style-guide/statements" component={Statements} />
      <Route path="/coding-style-guide/white-space" component={WhiteSpace} />
      <Route path="/coding-style-guide/quiz" component={CodingStyleQuiz} />
      <Route path="/commenting-guide" component={CommentingGuide} />
      <Route path="/commenting-guide/case-against" component={CaseAgainst} />
      <Route path="/commenting-guide/comment-types" component={CommentTypes} />
      <Route path="/commenting-guide/style-guidelines" component={StyleGuidelines} />
      <Route path="/commenting-guide/xml-comments" component={XmlDocumentation} />
      <Route path="/commenting-guide/quiz" component={CommentingQuiz} />
      <Route path="/technical-writing-guide" component={TechnicalWritingGuide} />
      <Route path="/technical-writing-guide/three-pillars" component={ThreePillars} />
      <Route path="/technical-writing-guide/readability" component={Readability} />
      <Route path="/technical-writing-guide/comprehensibility" component={Comprehensibility} />
      <Route path="/technical-writing-guide/style" component={Style} />
      <Route path="/technical-writing-guide/structure" component={Structure} />
      <Route path="/technical-writing-guide/quiz" component={TechWritingQuiz} />
      <Route path="/learning-progress" component={LearningProgress} />
      <Route path="/course-certificate" component={CourseCertificate} />
      <Route path="/courses" component={CourseCatalog} />
      
      {/* New Professional Courses */}
      <Route path="/systems-architect" component={SystemsArchitect} />
      <Route path="/systems-architect/agentic-ai" component={AgenticAI} />
      <Route path="/systems-architect/platform-engineering" component={PlatformEngineering} />
      <Route path="/systems-architect/green-computing" component={GreenComputing} />
      <Route path="/database-administrator" component={DBA} />
      <Route path="/data-scientist" component={DataScientist} />
      <Route path="/healthcare-architect" component={HealthcareArchitect} />
      <Route path="/healthcare-architect/hl7-evolution" component={HL7Evolution} />
      <Route path="/healthcare-architect/fhir-resources" component={FHIRResources} />
      <Route path="/healthcare-architect/smart-on-fhir" component={SMARTonFHIR} />
      <Route path="/sql-injection" component={SqlInjection} />
      {/* DBA Module Routes */}
      <Route path="/database-administrator/acid-transactions" component={ACIDTransactions} />
      <Route path="/database-administrator/vector-databases" component={VectorDatabases} />
      <Route path="/database-administrator/security-fortress" component={SecurityFortress} />
      {/* Data Scientist Module Routes */}
      <Route path="/data-scientist/llm-revolution" component={LLMRevolution} />
      <Route path="/data-scientist/rag-architecture" component={RAGArchitecture} />
      <Route path="/data-scientist/mlops" component={MLOps} />
      <Route path="/accessibility" component={Accessibility} />
      
      {/* GRACE Academy routes */}
      <Route path="/grace-academy" component={GraceAcademyIndex} />
      {/* GRACE Foundation Track (Modules 1-10) */}
      <Route path="/grace-academy/module-1" component={GraceModule1} />
      <Route path="/grace-academy/module-2" component={GraceModule2} />
      <Route path="/grace-academy/module-3" component={GraceModule3} />
      <Route path="/grace-academy/module-4" component={GraceModule4} />
      <Route path="/grace-academy/module-5" component={GraceModule5} />
      <Route path="/grace-academy/module-6" component={GraceModule6} />
      <Route path="/grace-academy/module-7" component={GraceModule7} />
      <Route path="/grace-academy/module-8" component={GraceModule8} />
      <Route path="/grace-academy/module-9" component={GraceModule9} />
      <Route path="/grace-academy/module-10" component={GraceModule10} />
      {/* GRACE Intermediate Track (Modules 11-20) */}
      <Route path="/grace-academy/module-11" component={GraceModule11} />
      <Route path="/grace-academy/module-12" component={GraceModule12} />
      <Route path="/grace-academy/module-13" component={GraceModule13} />
      <Route path="/grace-academy/module-14" component={GraceModule14} />
      <Route path="/grace-academy/module-15" component={GraceModule15} />
      <Route path="/grace-academy/module-16" component={GraceModule16} />
      <Route path="/grace-academy/module-17" component={GraceModule17} />
      <Route path="/grace-academy/module-18" component={GraceModule18} />
      <Route path="/grace-academy/module-19" component={GraceModule19} />
      <Route path="/grace-academy/module-20" component={GraceModule20} />
      {/* GRACE Advanced Track (Modules 21-30) */}
      <Route path="/grace-academy/module-21" component={GraceModule21} />
      <Route path="/grace-academy/module-22" component={GraceModule22} />
      <Route path="/grace-academy/module-23" component={GraceModule23} />
      <Route path="/grace-academy/module-24" component={GraceModule24} />
      <Route path="/grace-academy/module-25" component={GraceModule25} />
      <Route path="/grace-academy/module-26" component={GraceModule26} />
      <Route path="/grace-academy/module-27" component={GraceModule27} />
      <Route path="/grace-academy/module-28" component={GraceModule28} />
      <Route path="/grace-academy/module-29" component={GraceModule29} />
      <Route path="/grace-academy/module-30" component={GraceModule30} />
      {/* Track intro pages */}
      <Route path="/grace-academy/intermediate" component={IntermediateIntro} />
      <Route path="/grace-academy/advanced" component={AdvancedIntro} />
      {/* CMake Mastery routes */}
      <Route path="/cmake-mastery" component={CMakeMasteryIndex} />
      <Route path="/cmake-mastery/dashboard" component={CMakeDashboard} />
      <Route path="/cmake-mastery/module/:moduleNumber" component={CMakeModule} />
      {/* Software Testing Fundamentals routes */}
      <Route path="/stf" component={StfIndex} />
      <Route path="/stf/dashboard" component={StfDashboard} />
      <Route path="/stf/module/:moduleNumber" component={StfModule} />
      
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <ProgressProvider>
          <TooltipProvider>
            <Toaster />
            <SkipLink />
            <ScrollToTop />
            <BackToTop />
            <FloatingFeedback />
            <FloatingAccessibility />
            <Router />
          </TooltipProvider>
        </ProgressProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
