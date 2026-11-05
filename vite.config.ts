import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }

        const urlPath = req.url.split('?')[0];

        // Augment res with status and json
        const vercelRes: any = res;
        if (!vercelRes.status) {
          vercelRes.status = function (code: number) {
            vercelRes.statusCode = code;
            return vercelRes;
          };
        }
        if (!vercelRes.json) {
          vercelRes.json = function (payload: any) {
            vercelRes.setHeader('Content-Type', 'application/json');
            vercelRes.end(JSON.stringify(payload));
            return vercelRes;
          };
        }

        // Parse JSON body if POST/PUT
        const vercelReq: any = req;
        if (req.method === 'POST' || req.method === 'PUT') {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          }
          const raw = Buffer.concat(chunks).toString();
          try {
            vercelReq.body = raw ? JSON.parse(raw) : {};
          } catch {
            vercelReq.body = {};
          }
        }

        try {
          if (urlPath === '/api/auth/me') {
            const mod = await server.ssrLoadModule('/api/auth/me.ts');
            return await mod.default(vercelReq, vercelRes);
          }
          if (urlPath === '/api/auth/login') {
            const mod = await server.ssrLoadModule('/api/auth/login.ts');
            return await mod.default(vercelReq, vercelRes);
          }
          if (urlPath === '/api/auth/setup') {
            const mod = await server.ssrLoadModule('/api/auth/setup.ts');
            return await mod.default(vercelReq, vercelRes);
          }
          if (urlPath === '/api/auth/logout') {
            const mod = await server.ssrLoadModule('/api/auth/logout.ts');
            return await mod.default(vercelReq, vercelRes);
          }
          if (urlPath === '/api/auth/change-password') {
            const mod = await server.ssrLoadModule('/api/auth/change-password.ts');
            return await mod.default(vercelReq, vercelRes);
          }
          if (urlPath === '/api/portfolio') {
            const mod = await server.ssrLoadModule('/api/portfolio/index.ts');
            return await mod.default(vercelReq, vercelRes);
          }

          return vercelRes.status(404).json({ error: 'Endpoint not found' });
        } catch (err: any) {
          console.error('[API Dev Server Error]:', err);
          return vercelRes.status(500).json({ error: err?.message || 'Server error' });
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
