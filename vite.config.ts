import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    // Handle DevTools and other system requests at the Vite level
    middlewareMode: false,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  },
  // Handle static file requests
  publicDir: 'public',
  // Prevent certain requests from reaching React Router
  define: {
    // Ensure environment variables are available
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});
