const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  try {
    // 1) Leer token desde las cookies
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({
        msg: "Token no válido - no existe token en las cookies",
      });
    }

    const { token } = req.cookies;

    // 2) Verificar token
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // 3) Buscar usuario en BD
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existe en la BD",
      });
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido - usuario desactivado",
      });
    }

    // 4) Inyectar info en la request
    req.uid = uid;
    req.usuario = usuario;

    next();
  } catch (error) {
    console.error("Error en validarJWT:", error);
    return res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};
