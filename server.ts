import 'dotenv/config';
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
      let endpoint = process.env.SUBMISSION_ENDPOINT;
      if (!endpoint) {
        try {
          const dotenv = await import('dotenv');
          const parsed = dotenv.config()?.parsed;
          endpoint = parsed?.SUBMISSION_ENDPOINT || process.env.SUBMISSION_ENDPOINT;
        } catch (_) {}
      }
      if (!endpoint) {
        console.error('SUBMISSION_ENDPOINT is not defined');
        return res.status(500).json({ error: 'Server configuration error: SUBMISSION_ENDPOINT is not defined' });
      }
      
      const payload = req.body || {};
      const requestedAction = payload.action || payload.type || 'unknown';
      console.log(`[POST /api/submit] Action: ${requestedAction}`);

      const postToAppsScript = async (bodyObj: any) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000);

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(bodyObj),
            redirect: 'follow',
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`Apps Script responded with status: ${response.status}`);
          }
          
          const text = await response.text();
          console.log(`[POST /api/submit] Apps script response text length: ${text.length}`);
          
          let parsed: any = {};
          try {
            parsed = JSON.parse(text);
          } catch(e) {
            console.error("[POST /api/submit] JSON parse warning:", e, text.substring(0, 150));
            parsed = { rawText: text };
          }
          return parsed;
        } finally {
          clearTimeout(timeoutId);
        }
      };

      const extractFolderId = (data: any): string | null => {
        if (!data || typeof data !== 'object') return null;
        return (
          data.folderId ||
          data.folder_id ||
          data.id ||
          data.data?.folderId ||
          data.data?.folder_id ||
          data.data?.id ||
          data.folder?.id ||
          data.driveFolderId ||
          null
        );
      };

      const isOperationSuccess = (data: any): boolean => {
        if (!data || typeof data !== 'object') return false;
        if (data.success === true || data.success === 'true') return true;
        if (data.status === 'success' || data.status === 'ok' || data.status === 200) return true;
        if (data.result === 'success' || data.result === 'ok') return true;
        if (extractFolderId(data)) return true;
        if (data.fileId || data.file_id || data.url) return true;
        return false;
      };

      const isFolderCreation = ['start', 'createFolder', 'createClientFolder', 'create_folder'].includes(requestedAction);

      let data: any = {};

      if (isFolderCreation) {
        const businessName = (
          payload.businessName ||
          payload.clientName ||
          payload.folderName ||
          payload.name ||
          payload['Business Name'] ||
          ''
        ).trim();

        const actionCandidates = [
          requestedAction,
          'start',
          'createFolder',
          'createClientFolder',
        ].filter((val, idx, arr) => arr.indexOf(val) === idx);

        let lastError: any = null;

        for (const actionName of actionCandidates) {
          const attemptPayload = {
            ...payload,
            action: actionName,
            type: actionName,
            businessName,
            clientName: businessName,
            folderName: businessName,
            name: businessName,
            'Business Name': businessName,
          };

          try {
            console.log(`[POST /api/submit] Attempting folder creation with action: '${actionName}' and businessName: '${businessName}'`);
            data = await postToAppsScript(attemptPayload);

            const folderId = extractFolderId(data);
            if (folderId || isOperationSuccess(data)) {
              data.success = true;
              if (folderId) data.folderId = folderId;
              break;
            } else {
              lastError = data.error || data.message || 'Folder creation returned no folderId';
            }
          } catch (attemptErr: any) {
            console.warn(`[POST /api/submit] Attempt '${actionName}' failed:`, attemptErr.message);
            lastError = attemptErr.message;
          }
        }

        const resolvedFolderId = extractFolderId(data);
        if (!resolvedFolderId && !isOperationSuccess(data)) {
          return res.status(400).json({
            success: false,
            error: data.error || data.message || lastError || 'Failed to create client folder',
            details: data,
          });
        }

        return res.json({
          ...data,
          success: true,
          folderId: resolvedFolderId || data.folderId,
        });
      }

      // Other actions (uploadFile, finalize, etc.)
      try {
        data = await postToAppsScript(payload);
      } catch (fetchError: any) {
        if (fetchError.name === 'AbortError') {
          console.error('[POST /api/submit] Request to Apps Script timed out.');
          return res.status(504).json({ error: 'Google Apps Script timed out while processing request.' });
        }
        throw fetchError;
      }

      if (isOperationSuccess(data)) {
        res.json({
          ...data,
          success: true,
        });
      } else {
        const errorMsg = data.error || data.message || data.details || 'Submission failed on target server';
        res.status(400).json({
          success: false,
          error: errorMsg,
          details: data,
        });
      }
    } catch (error: any) {
      console.error('Error in /api/submit:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
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
