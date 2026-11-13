import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function githubPagesRoutes(): Plugin {
  return {
    name: 'github-pages-routes',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

      // Direct HTTP 200 route for /blog on GitHub Pages
      fs.writeFileSync(path.join(distDir, 'blog.html'), indexHtml, 'utf-8');

      // Fallback 404.html for trailing slash /blog/ or unknown paths
      const fallbackHtml = indexHtml.replace(
        '<head>',
        `<head>\n    <script>(function(){var p=window.location.pathname;if(p.length>1&&p.endsWith('/')){window.location.replace(p.slice(0,-1)+window.location.search+window.location.hash);}})();</script>`
      );
      fs.writeFileSync(path.join(distDir, '404.html'), fallbackHtml, 'utf-8');
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      githubPagesRoutes(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
