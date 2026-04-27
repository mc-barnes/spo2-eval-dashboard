import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Redirect full plotly.js to the smaller basic-dist-min bundle
      "plotly.js/dist/plotly": path.resolve(
        __dirname,
        "node_modules/plotly.js-basic-dist-min/plotly-basic.min.js"
      ),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("plotly")) return "plotly";
        },
      },
    },
  },
});
