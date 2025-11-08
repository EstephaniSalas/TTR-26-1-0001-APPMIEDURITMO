const { request, response } = require("express");
const Nota = require("../models/nota");

const validarNotaUsuario = async (req = request, res = response, next) => {
  try {
    const { idU, idN } = req.params; 
    const nota = await Nota.findById(idN);
    if(!nota){
      return res.status(404).json({
        msg: "no se encuentra el ID de la nota"
      })
    }
    if (nota.usuario.toString() !== idU) {
      return res.status(403).json({
        msg: 'No tienes permisos para acceder a esta nota'
      });
    }
    req.nota = nota;
    next();
  } catch (error) {
    console.error("Error en validarNotaUsuario:", error);
    res.status(500).json({
      msg: "Error interno del servidor al validar propiedad"
    });
  }
};

const validarEliminarNota = (req = request, res = response, next) => {
  try {
    const { confirmacion } = req.body;
    if (!confirmacion) {
      return res.status(400).json({
        msg: "Se debe confirmar para eliminar la nota",
      });
    }
    next();
    } catch (error) {
      console.error("Error en validarEliminarNota:", error);
      return res.status(500).json({
        msg: "Error interno del servidor al validar confirmación",
    });
  }
 };
module.exports = {
  validarNotaUsuario,
  validarEliminarNota
};