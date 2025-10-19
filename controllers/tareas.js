const { response, request } = require("express");

const crearTarea = (req = request, res = response) => {
  res.json({
    msg: "crear tarea - controlador",
  });
};

const obtenerTarea = (req = request, res = response) => {
  res.json({
    msg: "obtener tarea - controlador",
  });
};

const obtenerTareas = (req = request, res = response) => {
  res.json({
    msg: "obtener tareas - controlador",
  });
};

const actualizarTarea = (req = request, res = response) => {
  res.json({
    msg: "actualizar tarea - controlador",
  });
};

const borrarTarea = (req = request, res = response) => {
    res.json({
    msg: "borrar tarea - controlador",
  });
};

const cambiarStatusTarea = (req = request, res = response) => {
    res.json({
    msg: "Cambiar status tarea - controlador",
  });
};

module.exports = {
  crearTarea,
  obtenerTarea,
  obtenerTareas,
  actualizarTarea,
  borrarTarea,
  cambiarStatusTarea,
};
