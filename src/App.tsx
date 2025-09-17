import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AdminProvider } from "./hooks/useAdmin";
import { StudentAuthProvider } from "./hooks/useStudentAuth";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BackToTop } from "@/components/BackToTop";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BioDataFormPage from "./pages/BioDataForm";
import DepartmentInfo from "./pages/DepartmentInfo";
import NotFound from "./pages/NotFound";
import { LegacyWall } from "./components/LegacyWall";
import { Announcements } from "./components/Announcements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <StudentAuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <AnimatedBackground />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/biodata-form" element={<BioDataFormPage />} />
                <Route path="/department-info" element={<DepartmentInfo />} />
                <Route path="/legacy-wall" element={<LegacyWall />} />
                <Route path="/announcements" element={<Announcements />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BackToTop />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </StudentAuthProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
