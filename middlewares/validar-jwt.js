const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req, res, next) => {
  const token = req.header('x-token');  // ← TOKEN VIENE EN EL HEADER
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const usuario = await Usuario.findById(uid);
    if (!usuario || usuario.estado === false) {
      return res.status(401).json({
        msg: "Token no válido - usuario inexistente o desactivado",
      });
    }
    req.usuarioAuth = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};
