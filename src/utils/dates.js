
export function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 52) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}m ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

export function getExpiryDate(deletedDate, graceDays) {
  const d = new Date(deletedDate);
  d.setDate(d.getDate() + graceDays);
  return d;
}

export function getGracePeriod(deletedDate, graceDays) {
  if (deletedDate == null) return "";
  const now = new Date();
  const expiry = getExpiryDate(deletedDate, graceDays);

  let diff = Math.max(0, expiry - now); // ms remaining
  const seconds = Math.floor(diff / 1000);

  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;

  const parts = [
    days && `${days}d`,
    hours && `${hours}h`,
    minutes && `${minutes}m`,
    secs && `${secs}s`
  ].filter(Boolean);

  return parts.length ? parts.join(" ") : "0s";
}

export function isExpired(deletedDate, graceDays) {
  const now = new Date();
  const expiry = getExpiryDate(deletedDate, graceDays);
  const expired = now >= expiry;
  return expired;
}
