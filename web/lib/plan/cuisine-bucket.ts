export type CuisineBucket = "north" | "south" | "east" | "west" | "pan" | "default";

/** Map profile strings to a coarse region for template pools (deterministic). */
export function inferCuisineBucket(
  preferredCuisine: string,
  stateOrRegion: string,
): CuisineBucket {
  const s = `${preferredCuisine} ${stateOrRegion}`.toLowerCase();

  if (
    /south|tamil|kerala|karnataka|telugu|andhra|hyderabad|dosa|idli|sambar/.test(
      s,
    )
  ) {
    return "south";
  }
  if (/bengal|odisha|eastern|assam|fish curry|luchi/.test(s)) {
    return "east";
  }
  if (/gujarat|maharashtra|mumbai|pune|misal|poha|thali.*west/.test(s)) {
    return "west";
  }
  if (
    /north|punjab|punjabi|up|uttar|delhi|rajasthan|haryana|paratha|chole|rajma/.test(
      s,
    )
  ) {
    return "north";
  }
  if (/pan|mixed|indo|fusion|multicultural|all india/.test(s)) {
    return "pan";
  }
  return "default";
}
