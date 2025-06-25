import { getNodesArray, Node } from "./NodeRegistry";

export function hashString(str: string): number {
  // Simple deterministic hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit int
  }
  return Math.abs(hash);
}

export function pickNode(blobId: string): Node | null {
  const nodes = getNodesArray();
  if (nodes.length === 0) return null;
  const idx = hashString(blobId) % nodes.length;
  return nodes[idx];
}
