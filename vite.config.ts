import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      // nitro/vite builds from this
      server: { entry: "server" },
    }),
    react(),
    tailwindcss(),
    // Nitro handles SSR bundling and deployment targets.
    // preset auto-detected from NITRO_PRESET env var (Netlify sets it automatically),
    // or falls back to "netlify" here for explicit Netlify deployments.
    nitro({
      preset: "netlify",
    }),
  ],
  resolve: {
    // Native Vite 8 tsconfig path resolution — replaces vite-tsconfig-paths plugin
    tsconfigPaths: true,
  },
});
