import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Shopping from "./pages/Shopping";
import MealPlan from "./pages/MealPlan";
import SearchRecipes from "./pages/SearchRecipes";
import Recipes from "./pages/Recipes";
import IngredientBank from "./pages/IngredientBank";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
            <Route path="/ingredients" element={<ProtectedRoute><IngredientBank /></ProtectedRoute>} />
            <Route path="/meal-plan" element={<ProtectedRoute><MealPlan /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchRecipes /></ProtectedRoute>} />
            <Route path="/shopping" element={<ProtectedRoute><Shopping /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
