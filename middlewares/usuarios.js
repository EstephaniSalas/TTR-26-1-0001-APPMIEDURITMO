const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { validarPassBD } = require("../helpers/db-validators");


const validarPassIguales = (req, res, next) => {
  const { password, password2 } = req.body;
  if (password !== password2) {
    return res.status(400).json({
      msg: "Las contraseñas no coinciden",
    });
  }
  next();
};
const validarPassActual = async (req, res, next) => {
  try {
    const { id, idU } = req.params;
    const usuarioId = id || idU;
    const { passwordActual } = req.body;

    if (!passwordActual) {
      return next();
    }

    await validarPassBD(usuarioId, passwordActual);
    next();
  } catch (error) {
    console.log(error);
    const status = error.status || 500;
    return res.status(status).json({
      msg: error.message || "Error interno del servidor - validarPassActual",
    });
  }
};
const validarPassNuevasIguales = (req, res, next) => {
  const { passwordActual, passwordNueva, passwordNueva2 } = req.body;
  const quiereCambiar =
    passwordActual !== undefined ||
    passwordNueva !== undefined ||
    passwordNueva2 !== undefined;

  if (!quiereCambiar) return next();

  if (passwordNueva !== passwordNueva2) {
    return res.status(400).json({
      msg: "Las contraseñas no coinciden",
    });
  }
  next();
};

module.exports = {
  validarPassIguales,
  validarPassActual,
  validarPassNuevasIguales,
};
