const { response, request } = require("express");

const crearNota = (req = request, res = response) => {
    res.json({
    msg: "CREAR NOTA- controlador",
  });
};

const obtenerNota = (req = request, res = response) => {
    res.json({
    msg: "obtener nota - controlador",
  });
};

const obtenerNotas = (req = request, res = response) => {
    res.json({
    msg: "obtener notas - controlador",
  });
};

const modificarNota = (req = request, res = response) => {
    res.json({
    msg: "modificar nota - controlador",
  });
};

const borrarNota = (req = request, res = response) => {
    res.json({
    msg: "borrar nota - controlador",
  });
};


module.exports = {
    crearNota,
    obtenerNota,
    obtenerNotas,
    modificarNota,
    borrarNota,
};
