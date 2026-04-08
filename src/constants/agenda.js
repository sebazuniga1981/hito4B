export const HORAS_AGENDA = Array.from({ length: 14 }, (_, i) =>
  `${String(i + 8).padStart(2, "0")}:00`
);
