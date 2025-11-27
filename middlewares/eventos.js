const { request, response } = require("express");
const Evento = require("../models/evento");



// Valida formato 24h obligatorio (crear)
const validarHora24 = (req = request, res = response, next) => {
  let { horaInicio, horaFin } = req.body;

  horaInicio = horaInicio.toLowerCase().replace(/\s+/g, "");
  horaFin = horaFin.toLowerCase().replace(/\s+/g, "");

  if (
    horaInicio.includes("am") ||
    horaInicio.includes("pm") ||
    horaFin.includes("am") ||
    horaFin.includes("pm")
  ) {
    return res.status(400).json({
      msg: "Las horas deben estar en formato 24h (no se permite AM/PM) ejemplo: 14:30",
    });
  }

  const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!regexHora.test(horaInicio)) {
    return res.status(400).json({
      msg: `La horaInicio '${horaInicio}' no tiene un formato válido HH:MM`,
    });
  }

  if (!regexHora.test(horaFin)) {
    return res.status(400).json({
      msg: `La horaFin '${horaFin}' no tiene un formato válido HH:MM`,
    });
  }

  const [hiH, hiM] = horaInicio.split(":").map(Number);
  const [hfH, hfM] = horaFin.split(":").map(Number);

  const inicioMin = hiH * 60 + hiM;
  const finMin = hfH * 60 + hfM;

  if (inicioMin >= finMin) {
    return res.status(400).json({
      msg: "La horaInicio debe ser menor que la horaFin",
    });
  }

  req.body.horaInicio = horaInicio;
  req.body.horaFin = horaFin;

  next();
};



// Versión opcional: solo valida si vienen horas (para PUT)
const validarHora24Opcional = (req = request, res = response, next) => {
  let { horaInicio, horaFin } = req.body;

  if (horaInicio === undefined && horaFin === undefined) {
    return next(); // no hay horas que validar
  }

  // Si viene una, deben venir ambas
  if (!horaInicio || !horaFin) {
    return res.status(400).json({
      msg: "Si actualizas horaInicio u horaFin debes enviar ambas en formato HH:MM",
    });
  }

  horaInicio = horaInicio.toLowerCase().replace(/\s+/g, "");
  horaFin = horaFin.toLowerCase().replace(/\s+/g, "");

  if (
    horaInicio.includes("am") ||
    horaInicio.includes("pm") ||
    horaFin.includes("am") ||
    horaFin.includes("pm")
  ) {
    return res.status(400).json({
      msg: "Las horas deben estar en formato 24h (no se permite AM/PM) ejemplo: 14:30",
    });
  }

  const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!regexHora.test(horaInicio) || !regexHora.test(horaFin)) {
    return res.status(400).json({
      msg: "Las horas deben tener formato HH:MM",
    });
  }

  const [hiH, hiM] = horaInicio.split(":").map(Number);
  const [hfH, hfM] = horaFin.split(":").map(Number);

  const inicioMin = hiH * 60 + hiM;
  const finMin = hfH * 60 + hfM;

  if (inicioMin >= finMin) {
    return res.status(400).json({
      msg: "La horaInicio debe ser menor que la horaFin",
    });
  }

  req.body.horaInicio = horaInicio;
  req.body.horaFin = horaFin;

  next();
};



// Verifica que el evento pertenece al usuario
const validarEventoUsuario = async (req = request, res = response, next) => {
  const { idU, idE } = req.params;

  try {
    const evento = await Evento.findOne({ _id: idE, usuario: idU });

    if (!evento) {
      return res.status(404).json({
        msg: `El evento con id: ${idE} no existe o no pertenece al usuario`,
      });
    }

    req.evento = evento; // lo usamos en los controladores
    next();
  } catch (error) {
    console.error("Error en validarEventoUsuario:", error);
    res.status(500).json({
      msg: "Error interno del servidor - validarEventoUsuario",
      error: error.message,
    });
  }
};



// Asegura que en el PUT venga al menos un campo a actualizar
const validarCamposEventoUpdate = (req = request, res = response, next) => {
  const {
    tituloEvento,
    descripcionEvento,
    fechaEvento,
    horaInicio,
    horaFin,
    importante,
  } = req.body;

  const todosUndefined = [
    tituloEvento,
    descripcionEvento,
    fechaEvento,
    horaInicio,
    horaFin,
    importante,
  ].every((v) => v === undefined);

  if (todosUndefined) {
    return res.status(400).json({
      msg: "Debes enviar al menos un campo para actualizar el evento",
    });
  }

  next();
};

module.exports = {
  validarHora24,
  validarHora24Opcional,
  validarEventoUsuario,
  validarCamposEventoUpdate,
};
