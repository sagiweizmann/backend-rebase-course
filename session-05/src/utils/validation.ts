export function isValidHost(host: string): boolean {
  return /^[a-zA-Z0-9_-]{1,50}$/.test(host);
}

export function isValidPort(port: any): boolean {
  const n = Number(port);
  return Number.isInteger(n) && n >= 0 && n <= 65535;
}

export function isValidName(name: any): boolean {
  if (typeof name !== "string" || name.length > 50) return false;
  return name.length === 0 || /^[a-zA-Z0-9_-]{0,50}$/.test(name);
}
