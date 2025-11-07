const { request, response } = require("express");
const Tarea = require("../models/tarea");
const Materia = require("../models/materia"); 
const Usuario = require("../models/usuario");

const verificarMaterias = async (req, res) => {
  try {
    const materias = await Materia.find({});
    console.log("Materias en la BD:", materias);
    
    res.json({
      total: materias.length,
      materias: materias.map(m => ({ id: m._id, nombre: m.nombreMateria }))
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Validar que el usuario es dueño de la tarea
const validarTareaUsuario = async (req = request, res = response, next) => {
 try {
    const { idU, idT } = req.params; // ID usuario y tarea

    // Validar que la tarea existe Y pertenece al usuario
    const tarea = await Tarea.findById(idT);
    if (!tarea) {
      return res.status(404).json({
        msg: `No se encontró la tarea con id ${idT}`
      });
    }

    if (tarea.usuario.toString() !== idU) {
      return res.status(403).json({
        msg: 'No tienes permisos para modificar esta tarea'
      });
    }

    req.tarea = tarea; // Guardar para usar en el controller
    next();
  } catch (error) {
    console.error("Error en validarTareaUsuario:", error);
    res.status(500).json({
      msg: "Error interno del servidor al validar propiedad"
    });
  }
};

//Validar la confimación para eliminar tarea 
const validarEliminarTarea = (req = request, res = response, next) => {
  try {
    const { confirmacion } = req.body;
    if (confirmacion !== true) {
      return res.status(400).json({
        msg: "Se debe confirmar para eliminar la materia",
      });
    }
    next();
  } catch (error) {
    console.error("Error en validarEliminarMateria:", error);
    return res.status(500).json({
      msg: "Error interno del servidor al validar confirmación",
    });
  }
};


module.exports = {
  validarTareaUsuario,
  verificarMaterias,
  validarEliminarTarea
};