const { request, response } = require("express");
const Materia = require("../models/materia");

const validarMateriaPorUsuario = async (
  req = request,
  res = response,
  next
) => {
  try {
    const { nombreMateria } = req.body;
    const { id } = req.params; // Este es el ID del usuario
    const materiaDuplicada = await Materia.findOne({
      nombreMateria: nombreMateria.trim(),
      usuario: id,
    });
    if (materiaDuplicada) {
      return res.status(400).json({
        msg: `Ya tienes una materia registrada con el nombre: ${nombreMateria}`,
      });
    }
    next();
  } catch (error) {
    console.error("Error en middleware de validarMateriaDuplicada:", error);
    return res.status(500).json({
      msg: "Error interno del servidor al validar materia",
    });
  }
};

const validarMateriaUsuario = async (req = request, res = response, next) => {
  const { idU, idM } = req.params;
  try {
    const materia = await Materia.findById(idM);
    if (materia.usuario.toString() !== idU) {
      return res.status(403).json({
        msg: "No se tienen permisos para modificar Materia",
      });
    }
    req.materia = materia;
    next();
  } catch (error) {
        console.error("Error en validarPropiedadMateria:", error);
        res.status(500).json({
            msg: "Error interno del servidor"
        })
  }
};

module.exports = {
  validarMateriaPorUsuario,
  validarMateriaUsuario,
};
