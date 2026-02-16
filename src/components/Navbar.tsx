import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, ChefHat, BookOpen, Calendar, Search, FlaskConical, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email || "";

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="font-serif">Home Pantry</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/" ? "text-primary" : "text-muted-foreground"}`}>Today</Link>
          <Link to="/recipes" className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/recipes" ? "text-primary" : "text-muted-foreground"}`}><BookOpen className="h-4 w-4" />Recipes</Link>
          <Link to="/ingredients" className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/ingredients" ? "text-primary" : "text-muted-foreground"}`}><FlaskConical className="h-4 w-4" />Ingredients</Link>
          <Link to="/meal-plan" className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/meal-plan" ? "text-primary" : "text-muted-foreground"}`}><Calendar className="h-4 w-4" />Plan</Link>
          <Link to="/search" className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/search" ? "text-primary" : "text-muted-foreground"}`}><Search className="h-4 w-4" />Find</Link>
          <Link to="/shopping" className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/shopping" ? "text-primary" : "text-muted-foreground"}`}><ShoppingCart className="h-4 w-4" />List</Link>
          <div className="flex items-center gap-2 ml-2 border-l pl-4 border-border">
            <Avatar className="h-7 w-7">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="text-xs">{fullName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground hidden sm:inline max-w-[120px] truncate">{fullName.split(" ")[0]}</span>
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign out"><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
