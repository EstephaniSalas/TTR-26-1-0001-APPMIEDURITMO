const { request, response } = require("express");
const Flashcard = require("../models/flashcard");
const Usuario = require("../models/usuario");

// Validar que el usuario actual sí tenga registrada la flashcard
const validarFlashcardUsuario = async (req = request, res = response, next) => {
  const { idU, idF } = req.params;
  try {
    const flashcard = await Flashcard.findOne({
      _id: idF,
      usuario: idU,
    });
    if (!flashcard) {
      return res.status(404).json({
        msg: `La flashcard con id: ${idF} no existe o no pertenece al usuario`,
      });
    }
    const usuario = await Usuario.findById(idU);
    if (usuario.estado === false) {
      return res.status(400).json({
        msg: `El usuario con id ${idU} está desactivado`,
      });
    }
    req.flashcard = flashcard;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor - validarFlashcardUsuario",
      error: error.message
    });
  }
};
const validarCamposFlashcard = (req = request, res = response, next) => {
  const { delanteFlashcard, reversoFlashcard } = req.body;
  const quiereActualizar =
    delanteFlashcard !== undefined || reversoFlashcard !== undefined;
  if (!quiereActualizar) {
    return res.status(400).json({
      msg: "Debes enviar al menos un campo para actualizar (delanteFlashcard o reversoFlashcard)"
    });
  }
  next();
};

const validarEliminarFlashcards = (req = request, res = response, next) => {
  try {
    const { confirmacion } = req.body;
    if (confirmacion !== true) {
      return res.status(400).json({
        msg: "no se confirmo la eliminacion de las flashcards"
      });
    }
    next();
  } catch (error) {
    console.error("Error en validarEliminarFlashcards:", error);
    return res.status(500).json({
      msg: "Error interno del servidor al validar confirmación"
    });
  }
};

module.exports = {
  validarFlashcardUsuario,
  validarCamposFlashcard,
  validarEliminarFlashcards,
};
