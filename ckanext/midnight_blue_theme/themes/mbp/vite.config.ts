import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    publicDir: false,
    build: {
        lib: {
            entry: resolve(__dirname, "assets/src/main.ts"),
            formats: ["es"],
            fileName: (format) => `ui.js`,
        },
        outDir: "assets/javascript",
        emptyOutDir: false,
    },
});
