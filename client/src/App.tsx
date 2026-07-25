import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AccessibilityOverlay from "./components/AccessibilityOverlay";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import WidgetDetail from "./pages/WidgetDetail";
import WidgetEmbed from "./pages/WidgetEmbed";
import SnippetGenerator from "./pages/SnippetGenerator";
import ResellerPortal from "./pages/ResellerPortal";
import Demo from "./pages/Demo";
import Pricing from "./pages/Pricing";
import Onboarding from "./pages/Onboarding";
import AccessibilityPage from "./pages/Accessibility";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/widget/:id" component={WidgetDetail} />
      <Route path="/embed/:id" component={WidgetEmbed} />
      <Route path="/snippets" component={SnippetGenerator} />
      <Route path="/reseller" component={ResellerPortal} />
      <Route path="/demo" component={Demo} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/accessibility" component={AccessibilityPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppShell() {
  const [location] = useLocation();
  const isEmbedPage = location.startsWith("/embed");

  return (
    <>
      {/* Skip Link — visible on focus for keyboard users */}
      {!isEmbedPage && (
        <a href="#main-content" className="hansen-skip-link">
          Skip to main content
        </a>
      )}

      {/* Main content with ARIA landmark */}
      <main id="main-content" role="main">
        <Router />
      </main>

      {/* Accessibility Overlay — on every page except embed */}
      {!isEmbedPage && <AccessibilityOverlay />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppShell />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
