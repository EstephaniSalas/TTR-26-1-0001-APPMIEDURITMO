// controllers/eventos.js - ACTUALIZADO
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

    // Calcular fechaHoraCompleta para notificaciones
    const fechaHoraCompleta = new Date(`${fechaEvento.toISOString().split('T')[0]}T${horaInicio}:00`);

    res.status(201).json({
      msg: "Evento creado correctamente",
      evento: {
        ...eventoGuardado.toJSON(),
        fechaHoraCompleta: fechaHoraCompleta.toISOString(), // Para Flutter
      },
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
  const { evento } = req;

  // 🔔 NUEVO: Agregar fechaHoraCompleta
  const fechaHoraCompleta = new Date(`${evento.fechaEvento.toISOString().split('T')[0]}T${evento.horaInicio}:00`);

  res.json({
    msg: "Evento obtenido correctamente",
    evento: {
      ...evento.toJSON(),
      fechaHoraCompleta: fechaHoraCompleta.toISOString(),
    },
  });
};



// ::: GET - Obtener todos los eventos de un usuario :::
const obtenerEventos = async (req = request, res = response) => {
  try {
    const { idU } = req.params;

    const eventos = await Evento.find({ usuario: idU })
      .sort({ fechaEvento: 1, horaInicio: 1 });

    // 🔔 NUEVO: Agregar fechaHoraCompleta a cada evento
    const eventosConFechaCompleta = eventos.map(evento => {
      const fechaHoraCompleta = new Date(`${evento.fechaEvento.toISOString().split('T')[0]}T${evento.horaInicio}:00`);
      return {
        ...evento.toJSON(),
        fechaHoraCompleta: fechaHoraCompleta.toISOString(),
      };
    });

    res.json({
      msg: "Eventos obtenidos correctamente",
      total: eventos.length,
      eventos: eventosConFechaCompleta,
    });
  } catch (error) {
    console.error("Error en obtenerEventos:", error);
    res.status(500).json({
      msg: "Error interno del servidor al obtener los eventos",
      error: error.message,
    });
  }
};



// 🔔 NUEVO: GET - Obtener eventos FUTUROS (para sincronización de notificaciones)
const obtenerEventosFuturos = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const ahora = new Date();

    const eventos = await Evento.find({ 
      usuario: idU,
      fechaEvento: { $gte: ahora } // Solo eventos futuros
    }).sort({ fechaEvento: 1, horaInicio: 1 });

    // Filtrar eventos cuya hora también sea futura (mismo día)
    const eventosFuturos = eventos.filter(evento => {
      const fechaHoraCompleta = new Date(`${evento.fechaEvento.toISOString().split('T')[0]}T${evento.horaInicio}:00`);
      return fechaHoraCompleta > ahora;
    });

    const eventosConFechaCompleta = eventosFuturos.map(evento => {
      const fechaHoraCompleta = new Date(`${evento.fechaEvento.toISOString().split('T')[0]}T${evento.horaInicio}:00`);
      return {
        uid: evento._id.toString(),
        tituloEvento: evento.tituloEvento,
        descripcionEvento: evento.descripcionEvento,
        fechaHoraCompleta: fechaHoraCompleta.toISOString(),
        importante: evento.importante,
        tipo: 'evento', // Para identificar el tipo en Flutter
      };
    });

    res.json({
      msg: "Eventos futuros obtenidos correctamente",
      total: eventosConFechaCompleta.length,
      eventos: eventosConFechaCompleta,
    });
  } catch (error) {
    console.error("Error en obtenerEventosFuturos:", error);
    res.status(500).json({
      msg: "Error interno del servidor al obtener eventos futuros",
      error: error.message,
    });
  }
};



// ::: PUT - Modificar un evento :::
const modificarEvento = async (req = request, res = response) => {
  try {
    const { evento } = req;

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

    // 🔔 NUEVO: Calcular nueva fechaHoraCompleta
    const fechaFinal = cambios.fechaEvento || evento.fechaEvento;
    const horaFinal = cambios.horaInicio || evento.horaInicio;
    const fechaHoraCompleta = new Date(`${fechaFinal.toISOString().split('T')[0]}T${horaFinal}:00`);

    res.json({
      msg: "Evento actualizado correctamente",
      evento: {
        ...eventoActualizado.toJSON(),
        fechaHoraCompleta: fechaHoraCompleta.toISOString(),
      },
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
    const { evento } = req;

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
  obtenerEventosFuturos, // Endpoint para notificaciones
  modificarEvento,
  borrarEvento,
  borrarEventos,
};