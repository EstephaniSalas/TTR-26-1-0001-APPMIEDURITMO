// middlewares/validar-hora.js
const { request, response } = require("express");

const validarHora24 = (req = request, res = response, next) => {
  let { horaInicio, horaFin } = req.body;
  // Normalizar: quitar espacios y pasar a minúsculas
  horaInicio = horaInicio.toLowerCase().replace(/\s+/g, "");
  horaFin = horaFin.toLowerCase().replace(/\s+/g, "");
  console.log("", horaInicio, horaFin);

  // Rechazar si contiene 'am' o 'pm'
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

  // Validar formato exacto HH:MM
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

  // Validar que horaInicio < horaFin
  const [hiH, hiM] = horaInicio.split(":").map(Number);
  const [hfH, hfM] = horaFin.split(":").map(Number);

  const inicioMin = hiH * 60 + hiM;
  const finMin = hfH * 60 + hfM;

  if (inicioMin >= finMin) {
    return res.status(400).json({
      msg: "La horaInicio debe ser menor que la horaFin",
    });
  }

  // Guardar horas normalizadas en el request
  req.body.horaInicio = horaInicio;
  req.body.horaFin = horaFin;

  next();
};

module.exports = {
  validarHora24,
};
