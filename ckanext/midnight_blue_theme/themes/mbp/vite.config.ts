import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    publicDir: false,
  build: {
    lib: {
      // Define the entry point for your TypeScript file
        entry: resolve(__dirname, 'assets/src/main.ts'),
      // // The name of the global variable exposed if using UMD formats
      // name: 'MyTypeScriptLibrary',
      // The output file formats (e.g., ES modules, CommonJS, UMD)
      formats: ['es'],
      // The exported filename
      fileName: (format) => `ui.${format}.js`
    },
    // Optional: Specify where you want the compiled files to go
      // outDir: 'assets/javascript'
  }
});
