const Usuario = require("../models/usuario");
const Materia = require("../models/materia");
const Tarea = require("../models/tarea");
const Nota = require("../models/nota");

// :: CORREO
//Verificar si el correo existe
const existeCorreo = async (correo = "") => {
  const existeCorreo = await Usuario.findOne({ correo });
  if (existeCorreo) {
    throw new Error(`El correo: ${correo}, ya está registrado`);
  }
};


// :: USUARIO
//Verificar si existe usuario por id
const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id: ${id}, no existe`);
  }
};


// :: MATERIA
// Verificar si existe materia por id (para futuras rutas)
const existeMateriaPorId = async (id) => {
  const existeMateria = await Materia.findById(id);
  if (!existeMateria) {
    throw new Error(`La materia con id: ${id}, no existe`);
  }
};


// :: TAREA
//Verificar si existe tarea por ID para futuras rutas
const existeTareaPorId = async (id) => {
  const existeTarea = await Tarea.findById(id);
  if (!existeTarea) {
    throw new Error(`La tarea con id: ${id}, no existe`);
  }
};


// :: NOTA
//Verificar si existe tarea por ID para futuras rutas
const existeNotaPorId = async (id) => {
  const existeNota = await Nota.findById(id);
  if (!existeNota) {
    throw new Error(`La nota con id: ${id}, no existe`);
  }
};


module.exports = {
  existeCorreo,
  existeUsuarioPorId,
  existeMateriaPorId,
  existeTareaPorId,
  existeNotaPorId
};
