export function getEnv(key: string, fallback = ""): string {
  const raw = process.env[key] ?? fallback;

  // 去掉可能混入的 UTF-8 BOM (U+FEFF)
  return raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
}
