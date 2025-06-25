import { v4 as uuidv4 } from "uuid";

export interface NodeDestination {
  host: string;
  port: number;
}

export interface Node {
  id: string;
  destination: NodeDestination;
  name: string | null;
}

// Stores registered nodes by 'host:port'
const NODES: Record<string, Node> = {};

export function upsertNode(destination: NodeDestination, name?: string | null): string {
  const id = `${destination.host}:${destination.port}`;
  NODES[id] = {
    id,
    destination,
    name: name && name.trim().length > 0 ? name.trim() : null,
  };
  return id;
}

export function listNodes(): Node[] {
  return Object.values(NODES);
}

export function getNodesArray(): Node[] {
  // Deterministic order for hashing
  return Object.values(NODES).sort((a, b) => a.id.localeCompare(b.id));
}

export function hasAnyNodes(): boolean {
  return Object.keys(NODES).length > 0;
}
