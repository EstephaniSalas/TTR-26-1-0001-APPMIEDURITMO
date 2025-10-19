const { response, request } = require("express");


const crearUsuario = (req = request, res = response) => {
  res.json({
    msg: "crear usuario - controlador",
  });
};

const obtenerUsuario = (req = request, res = response) => {
  res.json({
    msg: "obtener usuario - controlador",
  });
};

const actualizarUsuario = (req, res = response) => {
  res.json({
    msg: "actualizar usuario - controlador",
  });
};

module.exports = {
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
};
