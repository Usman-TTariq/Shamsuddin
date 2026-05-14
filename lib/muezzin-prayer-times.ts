/**
 * Fills header jamat dropdown + "Our Namaz Timings" section using visitor
 * IP-based location (no browser permission) + Aladhan prayer times API.
 */

type Timings = Record<string, string>;

const IQ_OFFSET_MIN: Record<string, number> = {
  Fajr: 45,
  Dhuhr: 20,
  Asr: 15,
  Maghrib: 0,
  Isha: 20,
};

const PRAYER_ROWS = ["fajr", "zuhr", "asr", "maghrib", "isha"] as const;
type RowKey = (typeof PRAYER_ROWS)[number];

const ROW_TO_API: Record<RowKey, keyof Timings> = {
  fajr: "Fajr",
  zuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

function parseHHMM(s: string): { h: number; m: number } {
  const [hs, ms] = s.trim().split(":");
  return { h: parseInt(hs, 10), m: parseInt(ms ?? "0", 10) };
}

function addMinutes24(hhmm: string, delta: number): string {
  const { h, m } = parseHHMM(hhmm);
  let t = h * 60 + m + delta;
  t = ((t % 1440) + 1440) % 1440;
  const nh = Math.floor(t / 60);
  const nm = t % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

/** 24h "HH:MM" → "h:mm AM/PM" (wall-clock only; no timezone conversion). */
function format12(hhmm: string): string {
  const { h, m } = parseHHMM(hhmm);
  const ap = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ap}`;
}

async function ipLocation(signal: AbortSignal): Promise<{
  lat: number;
  lon: number;
  country: string;
}> {
  const res = await fetch("https://ipwho.is/", { signal });
  if (!res.ok) throw new Error("ip geo failed");
  const j = (await res.json()) as {
    success?: boolean;
    latitude?: number;
    longitude?: number;
    country?: string;
  };
  if (!j.success || j.latitude == null || j.longitude == null) throw new Error("ip geo invalid");
  return { lat: j.latitude, lon: j.longitude, country: j.country || "your area" };
}

async function resolveLocationFromIp(signal: AbortSignal): Promise<{
  lat: number;
  lon: number;
  regionLabel: string;
}> {
  const ip = await ipLocation(signal);
  return {
    lat: ip.lat,
    lon: ip.lon,
    regionLabel: ip.country,
  };
}

async function fetchTimings(lat: number, lon: number, signal: AbortSignal): Promise<Timings> {
  const u = new URL("https://api.aladhan.com/v1/timings");
  u.searchParams.set("latitude", String(lat));
  u.searchParams.set("longitude", String(lon));
  u.searchParams.set("method", "2");
  const res = await fetch(u.toString(), { signal });
  if (!res.ok) throw new Error("aladhan failed");
  const j = (await res.json()) as { data?: { timings?: Timings } };
  const t = j.data?.timings;
  if (!t) throw new Error("no timings");
  return t;
}

function setText(el: Element | null | undefined, text: string) {
  if (el) el.textContent = text;
}

export async function initMuezzinPrayerTimes(signal: AbortSignal): Promise<void> {
  let timings: Timings;
  let region: string;
  try {
    const loc = await resolveLocationFromIp(signal);
    timings = await fetchTimings(loc.lat, loc.lon, signal);
    region = loc.regionLabel;
  } catch {
    return;
  }

  setText(document.querySelector("[data-muezzin-prayer-region]"), `Prayer times in ${region}`);

  for (const key of PRAYER_ROWS) {
    const apiKey = ROW_TO_API[key];
    const ad24 = timings[apiKey];
    if (!ad24) continue;
    const off = IQ_OFFSET_MIN[apiKey] ?? 0;
    const iq24 = addMinutes24(ad24, off);
    const ad12 = format12(ad24);
    const iq12 = format12(iq24);

    const row = document.querySelector(`tr[data-muezzin-prayer="${key}"]`);
    setText(row?.querySelector("[data-muezzin-adhan]"), ad12);
    setText(row?.querySelector("[data-muezzin-iqamah]"), iq12);

    const card = document.querySelector(`[data-muezzin-prayer-card="${key}"]`);
    setText(card?.querySelector("[data-muezzin-begins]"), `Begins: ${ad12}`);
    setText(card?.querySelector("[data-muezzin-iqamah]"), `Iqamah: ${iq12}`);
  }

  const dhuhr = timings.Dhuhr;
  if (dhuhr) {
    const jIq24 = addMinutes24(dhuhr, 60);
    const jBeg12 = format12(dhuhr);
    const jIq12 = format12(jIq24);
    const jcard = document.querySelector(`[data-muezzin-prayer-card="jummah"]`);
    setText(jcard?.querySelector("[data-muezzin-begins]"), `Begins: ${jBeg12}`);
    setText(jcard?.querySelector("[data-muezzin-iqamah]"), `Iqamah: ${jIq12}`);
  }
}
