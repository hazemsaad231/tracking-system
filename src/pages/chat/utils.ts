export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
