const easternTime = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function easternSlot(date: Date) {
  return easternTime.format(date).replace(" ", "T");
}

export function slotWallTime(value: string) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})?$/.test(value)) return;
  const wall = value.slice(0, 19);
  const naive = new Date(wall + "Z");
  if (!Number.isFinite(naive.getTime()) || naive.toISOString().slice(0, 19) !== wall) return;
  if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return wall;
  const instant = new Date(value);
  if (Number.isFinite(instant.getTime())) return easternSlot(instant);
}

export function formatTourSlot(slot: string, includeDate = false) {
  const wall = slotWallTime(slot);
  if (!wall) return "";
  return new Date(wall + "Z").toLocaleString("en-US", {
    ...(includeDate && { weekday: "long", month: "long", day: "numeric" }),
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}
