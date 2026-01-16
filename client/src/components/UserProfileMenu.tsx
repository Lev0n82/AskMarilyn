import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Award, 
  Trophy, 
  BarChart3, 
  GraduationCap, 
  LogOut,
  LogIn,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { getLoginUrl } from "@/const";

const profileMenuItems = [
  { path: "/profile", label: "Your Profile", icon: User },
  { path: "/certificate", label: "Your Certificate", icon: Award },
  { path: "/badges", label: "Your Badges", icon: Trophy },
  { path: "/learning-progress", label: "Learning Progress", icon: BarChart3 },
  { path: "/course-certificate", label: "Course Certificates", icon: GraduationCap },
];

export function UserProfileMenu() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Button variant="outline" size="sm" asChild>
        <a href={getLoginUrl()}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </a>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open user menu"
        >
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={undefined} alt={user?.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {profileMenuItems.map((item) => (
            <DropdownMenuItem key={item.path} asChild>
              <Link href={item.path} className="cursor-pointer">
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="cursor-pointer"
        >
          {theme === "dark" ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Blueprint Mode</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => logout()}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
