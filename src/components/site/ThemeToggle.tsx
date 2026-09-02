import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
      title={theme === "dark" ? "Thème clair" : "Thème sombre"}
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">
        {mounted && theme === "dark" ? "Clair" : "Sombre"}
      </span>
    </Button>
  );
}
