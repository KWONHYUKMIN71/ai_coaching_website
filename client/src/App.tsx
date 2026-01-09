import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInquiries from "./pages/AdminInquiries";
import AdminInstructor from "./pages/AdminInstructor";
import AdminProposals from "./pages/AdminProposals";
import AdminAnalytics from "./pages/AdminAnalytics";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={() => (
        <DashboardLayout
          navItems={[
            { href: "/admin", label: "대시보드", icon: "home" },
            { href: "/admin/inquiries", label: "문의 관리", icon: "message-square" },
            { href: "/admin/instructor", label: "강사 정보", icon: "user" },
            { href: "/admin/proposals", label: "제안서 관리", icon: "file-text" },
            { href: "/admin/analytics", label: "접속 현황", icon: "trending-up" },
          ]}
        >
          <AdminDashboard />
        </DashboardLayout>
      )} />
      <Route path={"/admin/inquiries"} component={() => (
        <DashboardLayout
          navItems={[
            { href: "/admin", label: "대시보드", icon: "home" },
            { href: "/admin/inquiries", label: "문의 관리", icon: "message-square" },
            { href: "/admin/instructor", label: "강사 정보", icon: "user" },
            { href: "/admin/proposals", label: "제안서 관리", icon: "file-text" },
            { href: "/admin/analytics", label: "접속 현황", icon: "trending-up" },
          ]}
        >
          <AdminInquiries />
        </DashboardLayout>
      )} />
      <Route path={"/admin/instructor"} component={() => (
        <DashboardLayout
          navItems={[
            { href: "/admin", label: "대시보드", icon: "home" },
            { href: "/admin/inquiries", label: "문의 관리", icon: "message-square" },
            { href: "/admin/instructor", label: "강사 정보", icon: "user" },
            { href: "/admin/proposals", label: "제안서 관리", icon: "file-text" },
            { href: "/admin/analytics", label: "접속 현황", icon: "trending-up" },
          ]}
        >
          <AdminInstructor />
        </DashboardLayout>
      )} />
      <Route path={"/admin/proposals"} component={() => (
        <DashboardLayout
          navItems={[
            { href: "/admin", label: "대시보드", icon: "home" },
            { href: "/admin/inquiries", label: "문의 관리", icon: "message-square" },
            { href: "/admin/instructor", label: "강사 정보", icon: "user" },
            { href: "/admin/proposals", label: "제안서 관리", icon: "file-text" },
            { href: "/admin/analytics", label: "접속 현황", icon: "trending-up" },
          ]}
        >
          <AdminProposals />
        </DashboardLayout>
      )} />
      <Route path={"/admin/analytics"} component={() => (
        <DashboardLayout
          navItems={[
            { href: "/admin", label: "대시보드", icon: "home" },
            { href: "/admin/inquiries", label: "문의 관리", icon: "message-square" },
            { href: "/admin/instructor", label: "강사 정보", icon: "user" },
            { href: "/admin/proposals", label: "제안서 관리", icon: "file-text" },
            { href: "/admin/analytics", label: "접속 현황", icon: "trending-up" },
          ]}
        >
          <AdminAnalytics />
        </DashboardLayout>
      )} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
