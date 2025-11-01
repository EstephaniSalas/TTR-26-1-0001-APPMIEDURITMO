const Usuario = require("../models/usuario");
const Materia = require("../models/materia");

//Verificar si el correo existe
const existeCorreo = async (correo = "") => {
  const existeCorreo = await Usuario.findOne({ correo });
  if (existeCorreo) {
    throw new Error(`El correo: ${correo}, ya está registrado`);
  }
};

//Verificar si existe usuario por id
const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id: ${id}, no existe`);
  }
};

// Verificar si existe materia por id (para futuras rutas)
const existeMateriaPorId = async (id) => {
  const existeMateria = await Materia.findById(id);
  if (!existeMateria) {
    throw new Error(`La materia con id: ${id}, no existe`);
  }
};

module.exports = {
  existeCorreo,
  existeUsuarioPorId,
  existeMateriaPorId,
};
