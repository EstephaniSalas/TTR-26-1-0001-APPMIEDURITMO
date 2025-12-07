/**
 * Plantilla de calendario SEP Ciclo escolar 2025-2026
 *
 * IMPORTANTE:
 * - formato fecha: "YYYY-MM-DD"
 * - tipo: ["DIA_FESTIVO", "SUSPENSION_CLASES", "VACACIONES"]
 * - esHabil casi siempre false para días oficiales no laborales
 */

module.exports = {
  ciclo: "2025-2026",
  diasInhabiles: [
    // =========================
    // VACACIONES (RANGOS)
    // =========================
    {
      descripcion: "Vacaciones de Invierno",
      fecha_inicio: "2025-12-22",
      fecha_fin: "2026-01-06",
      tipo: "VACACIONES",
      esHabil: false,
    },
    {
      descripcion: "Vacaciones de Semana Santa",
      fecha_inicio: "2026-03-30",
      fecha_fin: "2026-04-10",
      tipo: "VACACIONES",
      esHabil: false,
    },
    {
      descripcion: "Vacaciones de Verano",
      fecha_inicio: "2026-07-15",
      fecha_fin: "2026-08-24",
      tipo: "VACACIONES",
      esHabil: false,
    },

    // =========================
    // DÍAS FESTIVOS 
    // =========================
    {
      fecha: "2025-09-16",
      descripcion: "Día de la Independencia",
      tipo: "DIA_FESTIVO",
      esHabil: false,
    },
    {
      fecha: "2025-11-03",
      descripcion: "02 de noviembre Día de Muertos (Puente 03 de noviembre",
      tipo: "DIA_FESTIVO",
      esHabil: false,
    },
    {
      fecha: "2025-11-17",
      tipo: "DIA_FESTIVO",
      esHabil: false,
      descripcion: "20 de noviembre (se recorre al 17 de noviembre)",
    },
    {
      fecha: "2025-12-25",
      descripcion: "Navidad",
      tipo: "DIA_FESTIVO",
      esHabil: false,
    },
    {
      fecha: "2026-01-01",
      descripcion: "Año Nuevo",
      tipo: "DIA_FESTIVO",
      esHabil: false,
    },
    {
      fecha: "2026-02-02",
      tipo: "DIA_FESTIVO",
      esHabil: false,
      descripcion:
        "5 de febrero día de la Constitución (se recorre al 2 de febrero)",
    },
    {
      fecha: "2026-03-16",
      tipo: "DIA_FESTIVO",
      esHabil: false,
      descripcion:
        "21 de marzo Natalicio de Benito Juárez (se recorre al 16 de marzo)",
    },
    {
      fecha: "2026-05-01",
      descripcion: "Día del Trabajo",
      tipo: "DIA_FESTIVO",
      esHabil: false,
    },
    {
      fecha: "2026-05-05",
      descripcion: "Batalla de Puebla",
      tipo: "DIA_FESTIVO",
      esHabil: false,
    },
    {
      fecha: "2026-05-15",
      descripcion: "Día del Maestro",
      tipo: "DIA_FESTIVO",
      esHabil: false,
    },
  ],
};
