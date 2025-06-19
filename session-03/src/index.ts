import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import {
  MAX_HEADER_LENGTH,
  MAX_HEADER_COUNT,
  MAX_LENGTH,
  MAX_ID_LENGTH
} from './constants';
import {
  getBlobPath,
  getMetaPath,
  validateQuota,
  saveMetadata,
  loadMetadata,
  deleteBlob
} from './blobStorage';

const app = express();
const port = 4000;

function isValidId(id: string): boolean {
  return /^[a-zA-Z0-9._-]{1,200}$/.test(id);
}

function extractAllowedHeaders(headers: Record<string, string | string[] | undefined>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    const val = Array.isArray(value) ? value[0] : value ?? '';
    const k = key.toLowerCase();
    if ((k === 'content-type' || k.startsWith('x-rebase-')) &&
        key.length <= MAX_HEADER_LENGTH &&
        val.length <= MAX_HEADER_LENGTH) {
      result[key] = val;
    }
  }
  if (Object.keys(result).length > MAX_HEADER_COUNT) {
    throw new Error('Too many headers');
  }
  return result;
}

app.post('/blobs/:id', (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).send('Invalid ID');

    const contentLength = req.headers['content-length'];
    if (!contentLength) return res.status(411).send('Missing Content-Length');

    const size = parseInt(contentLength, 10);
    if (isNaN(size) || size > MAX_LENGTH) return res.status(413).send('Payload too large');

    const headers = extractAllowedHeaders(req.headers as Record<string, string>);
    let metaSize = 0;
    for (const [k, v] of Object.entries(headers)) {
      metaSize += k.length + v.length;
    }
    if (size + metaSize > MAX_LENGTH) return res.status(413).send('Total size exceeds limit');

    const blobPath = getBlobPath(id);
    const tempPath = blobPath + '.tmp';
    await fs.promises.mkdir(path.dirname(blobPath), { recursive: true });

    const writeStream = fs.createWriteStream(tempPath);
    let written = 0;
    let errored = false;

    req.on('data', chunk => {
      written += chunk.length;
      if (written > MAX_LENGTH) {
        errored = true;
        req.destroy(new Error('Payload too large'));
      }
    });

    req.pipe(writeStream);

    writeStream.on('close', async () => {
      if (errored) {
        await fs.promises.rm(tempPath, { force: true });
        return res.status(413).send('Stream too large');
      }

      try {
        await validateQuota(written);
        await fs.promises.rename(tempPath, blobPath);
        await saveMetadata(id, {
          id,
          headers,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        res.status(201).send('Blob stored');
      } catch (err: any) {
        await fs.promises.rm(tempPath, { force: true });
        res.status(500).json({ error: err.message });
      }
    });

    writeStream.on('error', async () => {
      await fs.promises.rm(tempPath, { force: true });
      res.status(500).send('Failed to write');
    });
  })().catch(next);
});

app.get('/blobs/:id', async (req, res) => {
  const id = req.params.id;
  const blobPath = getBlobPath(id);

  try {
    const meta = await loadMetadata(id);
    const contentType = meta.headers['content-type'] || mime.lookup(blobPath) || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    for (const [k, v] of Object.entries(meta.headers)) {
      if (k.toLowerCase().startsWith('x-rebase-')) {
        res.setHeader(k, v);
      }
    }
    fs.createReadStream(blobPath).pipe(res);
  } catch {
    res.status(404).send('Not found');
  }
});

app.delete('/blobs/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await deleteBlob(id);
    res.status(204).send();
  } catch {
    res.status(500).send('Failed to delete');
  }
});

app.listen(port, () => {
  console.log(`Blob server running at http://localhost:${port}`);
});
