#!/bin/bash
cat << 'INNER_EOF' > server.ts
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with increased limit for base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.post('/api/submit', async (req, res) => {
    try {
      const endpoint = process.env.SUBMISSION_ENDPOINT;
      if (!endpoint) {
        console.error('SUBMISSION_ENDPOINT is not defined');
        return res.status(500).json({ error: 'Server configuration error' });
      }
      
      const payload = req.body;
      console.log(`[POST /api/submit] Sending request to Apps Script. Action: ${payload.action}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
          redirect: 'follow',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Apps Script responded with status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log(`[POST /api/submit] Apps script response text length: ${text.length}`);
        
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch(e) {
          console.error("[POST /api/submit] JSON parse error:", e, text.substring(0, 100));
        }
        
        if (data.success === true) {
          res.json(data);
        } else {
          res.status(400).json({ error: 'Submission failed on target server', details: data });
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.error('[POST /api/submit] Request to Apps Script timed out after 25s.');
          res.status(504).json({ error: 'Google Apps Script timed out while processing the file.' });
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      console.error('Error in /api/submit:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
INNER_EOF
