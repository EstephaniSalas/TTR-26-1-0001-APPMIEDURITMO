const { request, response } = require("express");
const CalendarioSep = require("../models/calendarioSep");

/**
 * Helper: de "YYYY-MM-DD" a Date normalizada a medianoche.
 */
function parseISODateOnly(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}



/**
 * POST /api/calendario-sep/cargar
 * Body:
 * {
 *   "ciclo": "2025-2026",
 *   "eventos": [
 *     {
 *       "fecha": "2025-09-16",
 *       "tipo": "DIA_FESTIVO",
 *       "descripcion": "Día de la Independencia",
 *       "esHabil": false
 *     },
 *     ...
 *   ]
 * }
 */
const cargarCalendarioSep = async (req = request, res = response) => {
  try {
    const { ciclo, eventos } = req.body;

    if (!ciclo || !Array.isArray(eventos) || eventos.length === 0) {
      return res.status(400).json({
        msg: "Debe enviar 'ciclo' y un arreglo 'eventos' con al menos un elemento",
      });
    }

    let count = 0;

    for (const ev of eventos) {
      const fechaNorm = parseISODateOnly(ev.fecha);

      const doc = {
        ciclo,
        fecha: fechaNorm,
        tipo: ev.tipo,
        descripcion: ev.descripcion,
        esHabil: ev.esHabil ?? false,
      };

      await CalendarioSep.updateOne(
        { ciclo: doc.ciclo, fecha: doc.fecha },
        { $set: doc },
        { upsert: true }
      );

      count++;
    }

    return res.status(201).json({
      msg: "Calendario SEP cargado/actualizado correctamente",
      ciclo,
      totalEventosProcesados: count,
    });
  } catch (error) {
    console.error("Error en cargarCalendarioSep:", error);
    return res.status(500).json({
      msg: "Error interno del servidor - cargarCalendarioSep",
      error: error.message,
    });
  }
};

/**
 * GET /api/calendario-sep
 * Query:
 *   ciclo (opcional)
 *   desde (opcional, YYYY-MM-DD)
 *   hasta (opcional, YYYY-MM-DD)
 *
 * Devuelve eventos entre fechas (por defecto: hoy-15 días, hoy+60 días)
 */
const obtenerEventosCalendario = async (req = request, res = response) => {
  try {
    let { ciclo, desde, hasta } = req.query;

    const hoy = new Date();
    const hoySolo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const inicio = desde
      ? new Date(desde + "T00:00:00.000Z")
      : new Date(hoySolo.getTime() - 15 * 24 * 60 * 60 * 1000);

    const fin = hasta
      ? new Date(hasta + "T23:59:59.999Z")
      : new Date(hoySolo.getTime() + 60 * 24 * 60 * 60 * 1000);

    const filtro = {
      fecha: { $gte: inicio, $lte: fin },
    };

    if (ciclo) {
      filtro.ciclo = ciclo;
    }

    const eventos = await CalendarioSep.find(filtro).sort({ fecha: 1 });

    return res.json({
      msg: "Eventos del calendario SEP obtenidos correctamente",
      rango: { desde: inicio, hasta: fin },
      filtros: { ciclo: ciclo || null },
      total: eventos.length,
      eventos,
    });
  } catch (error) {
    console.error("Error en obtenerEventosCalendario:", error);
    return res.status(500).json({
      msg: "Error interno del servidor - obtenerEventosCalendario",
      error: error.message,
    });
  }
};

/**
 * GET /api/calendario-sep/dia
 * Query:
 *   fecha (obligatorio, YYYY-MM-DD)
 *   ciclo (opcional)
 *
 * Devuelve todos los eventos del día.
 */
const obtenerEventosDia = async (req = request, res = response) => {
  try {
    const { fecha, ciclo } = req.query;

    if (!fecha) {
      return res.status(400).json({
        msg: "El parámetro 'fecha' (YYYY-MM-DD) es obligatorio",
      });
    }

    const inicio = new Date(fecha + "T00:00:00.000Z");
    const fin = new Date(fecha + "T23:59:59.999Z");

    const filtro = {
      fecha: { $gte: inicio, $lte: fin },
    };

    if (ciclo) {
      filtro.ciclo = ciclo;
    }

    const eventos = await CalendarioSep.find(filtro).sort({ fecha: 1 });

    return res.json({
      msg: "Eventos del día obtenidos correctamente",
      fecha,
      ciclo: ciclo || null,
      total: eventos.length,
      eventos,
    });
  } catch (error) {
    console.error("Error en obtenerEventosDia:", error);
    return res.status(500).json({
      msg: "Error interno del servidor - obtenerEventosDia",
      error: error.message,
    });
  }
};

/**
 * GET /api/calendario-sep/ciclos
 * Devuelve lista de ciclos distintos cargados.
 */
const obtenerCiclosCalendario = async (req = request, res = response) => {
  try {
    const ciclos = await CalendarioSep.distinct("ciclo");

    return res.json({
      msg: "Ciclos de calendario SEP obtenidos correctamente",
      ciclos,
    });
  } catch (error) {
    console.error("Error en obtenerCiclosCalendario:", error);
    return res.status(500).json({
      msg: "Error interno del servidor - obtenerCiclosCalendario",
      error: error.message,
    });
  }
};

module.exports = {
  cargarCalendarioSep,
  obtenerEventosCalendario,
  obtenerEventosDia,
  obtenerCiclosCalendario,
};
