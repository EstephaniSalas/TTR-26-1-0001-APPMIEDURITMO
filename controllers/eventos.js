// controllers/eventos.js
const { response, request } = require("express");
const Evento = require("../models/evento");
const Usuario = require("../models/usuario");

// ::: POST - Crear evento :::
const crearEvento = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const {
      tituloEvento,
      descripcionEvento = "",
      fechaEvento,
      horaInicio,
      horaFin,
      importante = false,
    } = req.body;

    const evento = new Evento({
      usuario: idU,
      tituloEvento,
      descripcionEvento,
      fechaEvento,
      horaInicio,
      horaFin,
      importante,
    });

    const eventoGuardado = await evento.save();

    await Usuario.findByIdAndUpdate(idU, {
      $push: { eventos: eventoGuardado._id },
    });

    res.status(201).json({
      msg: "Evento creado correctamente",
      evento: eventoGuardado,
    });
  } catch (error) {
    console.error("Error en crearEvento:", error);
    res.status(500).json({
      msg: "Error interno del servidor al crear el evento",
      error: error.message,
    });
  }
};



// ::: GET - Obtener un evento específico :::
const obtenerEvento = (req = request, res = response) => {
  const { evento } = req; // viene del middleware validarEventoUsuario

  res.json({
    msg: "Evento obtenido correctamente",
    evento,
  });
};



// ::: GET - Obtener todos los eventos de un usuario :::
const obtenerEventos = async (req = request, res = response) => {
  try {
    const { idU } = req.params;

    const eventos = await Evento.find({ usuario: idU })
      .sort({ fechaEvento: 1, horaInicio: 1 });

    res.json({
      msg: "Eventos obtenidos correctamente",
      total: eventos.length,
      eventos,
    });
  } catch (error) {
    console.error("Error en obtenerEventos:", error);
    res.status(500).json({
      msg: "Error interno del servidor al obtener los eventos",
      error: error.message,
    });
  }
};



// ::: PUT - Modificar un evento :::
const modificarEvento = async (req = request, res = response) => {
  try {
    const { evento } = req; // del middleware validarEventoUsuario

    const {
      tituloEvento,
      descripcionEvento,
      fechaEvento,
      horaInicio,
      horaFin,
      importante,
    } = req.body;

    const cambios = {};
    if (tituloEvento !== undefined) cambios.tituloEvento = tituloEvento;
    if (descripcionEvento !== undefined) cambios.descripcionEvento = descripcionEvento;
    if (fechaEvento !== undefined) cambios.fechaEvento = fechaEvento;
    if (horaInicio !== undefined) cambios.horaInicio = horaInicio;
    if (horaFin !== undefined) cambios.horaFin = horaFin;
    if (importante !== undefined) cambios.importante = importante;

    const eventoActualizado = await Evento.findByIdAndUpdate(
      evento._id,
      cambios,
      { new: true }
    );

    res.json({
      msg: "Evento actualizado correctamente",
      evento: eventoActualizado,
    });
  } catch (error) {
    console.error("Error en modificarEvento:", error);
    res.status(500).json({
      msg: "Error interno del servidor al actualizar el evento",
      error: error.message,
    });
  }
};



// ::: DELETE - Borrar un evento :::
const borrarEvento = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const { evento } = req; // del middleware validarEventoUsuario

    await Evento.findByIdAndDelete(evento._id);

    await Usuario.findByIdAndUpdate(idU, {
      $pull: { eventos: evento._id },
    });

    res.json({
      msg: "Evento eliminado correctamente",
      eventoEliminado: evento,
    });
  } catch (error) {
    console.error("Error en borrarEvento:", error);
    res.status(500).json({
      msg: "Error interno del servidor al eliminar el evento",
      error: error.message,
    });
  }
};



// ::: DELETE - Borrar TODOS los eventos de un usuario :::
const borrarEventos = async (req = request, res = response) => {
  try {
    const { idU } = req.params;

    const eventosUsuario = await Evento.find({ usuario: idU }).select("_id");
    if (eventosUsuario.length === 0) {
      return res.status(404).json({
        msg: "El usuario no tiene eventos para eliminar",
        totalEventos: 0,
      });
    }

    const resultado = await Evento.deleteMany({ usuario: idU });

    await Usuario.findByIdAndUpdate(idU, { eventos: [] });

    res.json({
      msg: "Todos los eventos del usuario han sido eliminados",
      totalEliminados: resultado.deletedCount,
    });
  } catch (error) {
    console.error("Error en borrarEventos:", error);
    res.status(500).json({
      msg: "Error interno del servidor al eliminar los eventos",
      error: error.message,
    });
  }
};

module.exports = {
  crearEvento,
  obtenerEvento,
  obtenerEventos,
  modificarEvento,
  borrarEvento,
  borrarEventos,
};
