// controllers/calendarioSep.js
const { request, response } = require("express");
const CalendarioSep = require("../models/calendarioSep");

/**
 * GET /api/calendario-sep
 * Query params opcionales:
 *  - desde: YYYY-MM-DD
 *  - hasta: YYYY-MM-DD
 *  - tipo: CLASES | SUSPENSION | VACACIONES | PERIODO_EVALUACION | OTRO
 *  - ciclo: etiqueta de ciclo (ej. "2024-2025")
 */
const obtenerCalendarioSep = async (req = request, res = response) => {
  try {
    let { desde, hasta, tipo, ciclo } = req.query;

    const filtro = {};

    if (ciclo) {
      filtro.ciclo = ciclo;
    }

    if (tipo) {
      filtro.tipo = tipo.toUpperCase();
    }

    if (desde || hasta) {
      filtro.fecha = {};
      if (desde) {
        filtro.fecha.$gte = new Date(desde + "T00:00:00.000Z");
      }
      if (hasta) {
        filtro.fecha.$lte = new Date(hasta + "T23:59:59.999Z");
      }
    }

    const dias = await CalendarioSep.find(filtro).sort({ fecha: 1 });

    res.json({
      msg: "Calendario SEP obtenido correctamente",
      total: dias.length,
      dias,
    });
  } catch (error) {
    console.error("Error en obtenerCalendarioSep:", error);
    res.status(500).json({
      msg: "Error interno del servidor - obtenerCalendarioSep",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerCalendarioSep,
};
