import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { BlobMeta } from './blob';
import {
  MAX_DISK_QUOTA,
  MAX_BLOBS_IN_FOLDER
} from './constants';

const BASE_DIR = path.resolve('blobs');

export function getBlobPath(id: string): string {
  const subfolder = id.slice(0, 2) || '00';
  return path.join(BASE_DIR, subfolder, id);
}

export function getMetaPath(id: string): string {
  return getBlobPath(id) + '.meta.json';
}

export async function validateQuota(fileSize: number) {
  let total = 0;
  let count = 0;
  const entries = await fsPromises.readdir(BASE_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subFiles = await fsPromises.readdir(path.join(BASE_DIR, entry.name));
      count += subFiles.length / 2; // one blob + one metadata
      for (const file of subFiles) {
        const stat = await fsPromises.stat(path.join(BASE_DIR, entry.name, file));
        total += stat.size;
      }
    }
  }

  if (count >= MAX_BLOBS_IN_FOLDER) throw new Error('Too many blobs');
  if (total + fileSize > MAX_DISK_QUOTA) throw new Error('Disk quota exceeded');
}

export async function saveMetadata(id: string, meta: BlobMeta): Promise<void> {
  const metaPath = getMetaPath(id);
  await fsPromises.mkdir(path.dirname(metaPath), { recursive: true });
  await fsPromises.writeFile(metaPath, JSON.stringify(meta, null, 2));
}

export async function loadMetadata(id: string): Promise<BlobMeta> {
  const raw = await fsPromises.readFile(getMetaPath(id), 'utf-8');
  return JSON.parse(raw);
}

export async function deleteBlob(id: string): Promise<void> {
  await fsPromises.rm(getBlobPath(id), { force: true });
  await fsPromises.rm(getMetaPath(id), { force: true });
}
