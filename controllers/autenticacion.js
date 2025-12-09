const { request, response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

// :::::: LOGIN USUARIO - POST ::::::
const loginUsuario = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario || !usuario.estado) {
      return res.status(400).json({
        msg: "Correo o contraseña incorrectos",
      });
    }
    const passValida = bcrypt.compareSync(password, usuario.password);
    if (!passValida) {
      return res.status(400).json({
        msg: "Correo o contraseña incorrectos",
      });
    }
    const token = await generarJWT(usuario.id);
    return res.json({
      msg: "Inicio de sesión exitoso",
      usuario,
      token,               // ← AQUÍ se regresa el JWT
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al intentar iniciar sesión",
    });
  }
};


const verificarJWT = (req = request, res = response) => {
  res.json({
    msg: "verificar JWT - controlador",
  });
};
const cerrarSesion = (req = request, res = response) => {
  res.json({
    msg: "cerrar sesion - controlador",
  });
};
module.exports = {
  loginUsuario,
  verificarJWT,
  cerrarSesion,
};
