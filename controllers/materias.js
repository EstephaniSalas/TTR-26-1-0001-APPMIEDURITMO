const { response, request } = require("express");

const crearMateria = (req = request, res = response) => {
    res.json({
    msg: "Crear materia- controlador",
  });
};

const obtenerMateria = (req = request, res = response) => {
    res.json({
    msg: "obtener materia - controlador",
  });
};

const obtenerMaterias = (req = request, res = response) => {
    res.json({
    msg: "obtener materias - controlador",
  });
};

const modificarMateria = (req = request, res = response) => {
    res.json({
    msg: "modificar materia - controlador",
  });
};

const borrarMateria = (req = request, res = response) => {
    res.json({
    msg: "borrar materia - controlador",
  });
};


module.exports = {
    crearMateria,
    obtenerMateria,
    obtenerMaterias,
    modificarMateria,
    borrarMateria,
};