export function formatRemainingTime(deadlineAt: string | null | undefined): string {
  if (!deadlineAt) return "00:00:00";
  const seconds = Math.max(0, Math.floor((new Date(deadlineAt).getTime() - Date.now()) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return [hours, minutes, remainder].map((value) => String(value).padStart(2, "0")).join(":");
}
