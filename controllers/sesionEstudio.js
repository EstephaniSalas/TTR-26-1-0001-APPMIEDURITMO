// controllers/sesionEstudio.js
const { request, response } = require("express");
const SesionEstudio = require("../models/sesionEstudio");


const crearSesionEstudio = async (req = request, res = response) => {
  try {
    const { idU, idM } = req.params;
    const { duracionSegundos, fechaSesion } = req.body;

    const sesion = new SesionEstudio({
      usuario: idU,
      materia: idM,
      duracionSegundos,
      fechaSesion: fechaSesion ? new Date(fechaSesion) : new Date(),
    });

    const sesionGuardada = await sesion.save();

    const sesionConPopulate = await SesionEstudio.findById(sesionGuardada._id)
      .populate("usuario", "nombre -_id")
      .populate("materia", "nombreMateria -_id");

    res.status(201).json({
      msg: "Sesión de estudio registrada correctamente",
      sesion: sesionConPopulate,
    });
  } catch (error) {
    console.error("Error en crearSesionEstudio:", error);
    res.status(500).json({
      msg: "Error interno del servidor - crearSesionEstudio",
      error: error.message,
    });
  }
};


const obtenerResumenEstudio = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    let { desde, hasta, idMateria } = req.query;

    const hoy = new Date();

    const hoySoloFecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    // Rango por defecto: últimos 7 días
    let inicio = desde
      ? new Date(desde + "T00:00:00.000Z")
      : new Date(hoySoloFecha.getTime() - 6 * 24 * 60 * 60 * 1000);
    let fin = hasta
      ? new Date(hasta + "T23:59:59.999Z")
      : new Date(hoySoloFecha.getTime() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 999);

    const filtro = {
      usuario: idU,
      fechaSesion: { $gte: inicio, $lte: fin },
    };

    if (idMateria) {
      filtro.materia = idMateria;
    }

    const sesiones = await SesionEstudio.find(filtro)
      .populate("materia", "nombreMateria -_id")
      .sort({ fechaSesion: 1 });

    // Agregado por día
    const acumulado = {};
    sesiones.forEach((s) => {
      const key = s.fechaSesion.toISOString().substring(0, 10); // YYYY-MM-DD
      acumulado[key] = (acumulado[key] || 0) + s.duracionSegundos;
    });

    const resumenDias = Object.entries(acumulado).map(([fecha, totalSegundos]) => ({
      fecha, // YYYY-MM-DD
      totalSegundos,
      totalMinutos: Number((totalSegundos / 60).toFixed(2)),
    }));

    res.json({
      msg: "Resumen de estudio obtenido correctamente",
      rango: {
        desde: inicio,
        hasta: fin,
      },
      filtros: {
        idMateria: idMateria || null,
      },
      totalSesiones: sesiones.length,
      resumenDias,
      sesiones,
    });
  } catch (error) {
    console.error("Error en obtenerResumenEstudio:", error);
    res.status(500).json({
      msg: "Error interno del servidor - obtenerResumenEstudio",
      error: error.message,
    });
  }
};

module.exports = {
  crearSesionEstudio,
  obtenerResumenEstudio,
};
