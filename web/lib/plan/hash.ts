/** Deterministic 32-bit hash for stable picks from the same inputs. */
export function hashString(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return h >>> 0;
}

export function pickIndex(length: number, seed: number, salt: number): number {
  if (length <= 0) return 0;
  const mixed = hashString(`${seed}:${salt}`);
  return mixed % length;
}
