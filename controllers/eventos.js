const { response, request } = require("express");
const Evento = require("../models/evento");
const Usuario = require("../models/usuario");

const crearEvento = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const {
      tituloEvento,
      descripcionEvento = "",
      fechaEvento,
      horaInicio,
      horaFin,
      importante = false
    } = req.body;
    const evento = new Evento({
      usuario: idU,
      tituloEvento,
      descripcionEvento,
      fechaEvento,
      horaInicio,
      horaFin,
      importante
    });

    const eventoGuardado = await evento.save();

    await Usuario.findByIdAndUpdate(idU, {
      $push: { eventos: eventoGuardado._id }
    });

    res.status(201).json({
      msg: "Evento creado correctamente",
      evento: eventoGuardado
    });

  } catch (error) {
    console.error("Error en crearEvento:", error);
    res.status(500).json({
      msg: "Error interno del servidor al crear el evento",
      error: error.message
    });
  }
};



const obtenerEvento = async(req = request, res = response) => {
    res.json({
    msg: "obtener evento - controlador",
  });
};

const obtenerEventos = (req = request, res = response) => {
    res.json({
    msg: "obtener eventos - controlador",
  });
};

const modificarEvento = (req = request, res = response) => {
    res.json({
    msg: "modificar evento - controlador",
  });
};

const borrarEvento = (req = request, res = response) => {
    res.json({
    msg: "borrar evento - controlador",
  });
};


module.exports = {
    crearEvento,
    obtenerEvento,
    obtenerEventos,
    modificarEvento,
    borrarEvento,
};