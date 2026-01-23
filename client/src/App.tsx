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
import CommentingGuide from "./pages/CommentingGuide";
import TechnicalWritingGuide from "./pages/TechnicalWritingGuide";
import LearningProgress from "./pages/LearningProgress";
import CourseCertificate from "./pages/CourseCertificate";
import CourseCatalog from "./pages/CourseCatalog";
import GraceAcademyIndex from "./pages/grace-academy/index";
import GraceModule from "./pages/grace-academy/GraceModule";
import GraceDashboard from "./pages/grace-academy/GraceDashboard";
import GraceAdmin from "./pages/grace-academy/GraceAdmin";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
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
      <Route path="/commenting-guide" component={CommentingGuide} />
      <Route path="/technical-writing-guide" component={TechnicalWritingGuide} />
      <Route path="/learning-progress" component={LearningProgress} />
      <Route path="/course-certificate" component={CourseCertificate} />
      <Route path="/courses" component={CourseCatalog} />
      <Route path="/grace-academy" component={GraceAcademyIndex} />
      <Route path="/grace-academy/dashboard" component={GraceDashboard} />
      <Route path="/grace-academy/admin" component={GraceAdmin} />
      <Route path="/grace-academy/module-:moduleNumber" component={GraceModule} />
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
            <ScrollToTop />
            <BackToTop />
            <Router />
          </TooltipProvider>
        </ProgressProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
