//yyyy.MM.dd HH:mm
export function formatDateTime(isoString) {
  if (!isoString) return "-";

  const date = isoString.substring(0, 10).replace(/-/g, ".");
  const time = isoString.substring(11, 16);

  return `${date} ${time}`;
}

//yyyy.MM.dd
export function formatDate(isoString) {
  if (!isoString) return "-";

  return isoString.substring(0, 10).replace(/-/g, ".");
}
