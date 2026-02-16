import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, ChefHat, BookOpen, Calendar, Search, FlaskConical } from "lucide-react";


const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="font-serif">Home Pantry</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Today
          </Link>
          <Link
            to="/recipes"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/recipes" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Recipes
          </Link>
          <Link
            to="/ingredients"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/ingredients" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <FlaskConical className="h-4 w-4" />
            Ingredients
          </Link>
          <Link
            to="/meal-plan"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/meal-plan" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Plan
          </Link>
          <Link
            to="/search"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/search" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Search className="h-4 w-4" />
            Find
          </Link>
          <Link
            to="/shopping"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/shopping" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            List
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
