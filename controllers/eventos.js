const { response, request } = require("express");

const crearEvento = (req = request, res = response) => {
    res.json({
    msg: "crear evento - controlador",
  });
};

const obtenerEvento = (req = request, res = response) => {
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