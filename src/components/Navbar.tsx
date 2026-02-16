import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, ChefHat } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="font-serif">Pantry</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Recipes
          </Link>
          <Link
            to="/shopping"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/shopping" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            Shopping List
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
