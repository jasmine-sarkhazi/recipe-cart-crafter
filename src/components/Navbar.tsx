import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, ChefHat, BookOpen, Calendar, Search, FlaskConical, LogOut, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { to: "/", label: "Today", icon: Home },
  { to: "/recipes", label: "Recipes", icon: BookOpen },
  { to: "/ingredients", label: "Ingredients", icon: FlaskConical },
  { to: "/meal-plan", label: "Plan", icon: Calendar },
  { to: "/search", label: "Find", icon: Search },
  { to: "/shopping", label: "List", icon: ShoppingCart },
];

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email || "";

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="font-serif">Home Pantry</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-5">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${location.pathname === to ? "text-primary" : "text-muted-foreground"}`}
              >
                <Icon className="h-4 w-4" />{label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:ml-2 md:border-l md:pl-4 border-border">
            <Avatar className="h-7 w-7">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="text-xs">{fullName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground hidden sm:inline max-w-[120px] truncate">{fullName.split(" ")[0]}</span>
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign out"><LogOut className="h-4 w-4" /></Button>
          </div>
        </nav>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
