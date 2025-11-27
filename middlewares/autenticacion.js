const { request, response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs"); 

const validarUsuarioLogin = async (req = request, res = response, next) => { 
  const { correo } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Correo o password no son correctos - correo",
      });
    }
    if (usuario.estado === false) {
      return res.status(400).json({
        msg: "El usuario está desactivado",
      });
    }
    // Lo guardamos en el request para usarlo después
    req.usuarioLogin = usuario;
    next();
  } catch (error) {
    console.log("Error en validarUsuarioLogin:", error);
    return res.status(500).json({
      msg: "Error interno del servidor - validarUsuarioLogin",
    });
  }
};

// Valida que la contraseña enviada coincida con la de BD
const validarPasswordLogin = (req = request, res = response, next) => {
  const { password } = req.body;
  const { usuarioLogin } = req;

  try {
    const validPassword = bcryptjs.compareSync(password, usuarioLogin.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Correo o password no son correctos - password",
      });
    }

    next();
  } catch (error) {
    console.log("Error en validarPasswordLogin:", error);
    return res.status(500).json({
      msg: "Error interno del servidor - validarPasswordLogin",
    });
  }
};

module.exports = {
  validarUsuarioLogin,
  validarPasswordLogin,
};