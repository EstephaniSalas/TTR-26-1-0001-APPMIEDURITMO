const { response, request } = require("express");
const Usuario = require("../models/usuario");
const Flashcard = require("../models/flashcard");
const Materia = require("../models/materia");

// Crear flashcard por usuario y materia.
const crearFlashcard = async (req = request, res = response) => {
  try {
    const { idU, idM } = req.params;
    const { delanteFlashcard, reversoFlashcard } = req.body;

    // Crear la flashcard
    const flashcard = new Flashcard({
      usuario: idU,
      materia: idM,
      delanteFlashcard,
      reversoFlashcard,
    });

    // Guardar en la base de datos
    const flashcardNueva = await flashcard.save();

    // Agregar flashcard al schema Usuario
    await Usuario.findByIdAndUpdate(idU, {
      $push: { flashcards: flashcardNueva._id },
    });

    // Obtener la flashcard creada con populate si es necesario
    const flashcardCreada = await Flashcard.findById(flashcardNueva._id)
      .populate("usuario", "nombre -_id")
      .populate("materia", "nombreMateria -_id");

    res.status(201).json({
      msg: "Flashcard creada exitosamente",
      flashcardCreada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor - crearFlashcard",
      error: error.message,
    });
  }
};

// :: GET - Obtener una flashcard específica por ID
const obtenerFlashcard = (req = request, res = response) => {
  // req.flashcard del Middleware validarFlashcardUsuario
  const { flashcard } = req;

  res.json({
    msg: "Flashcard obtenida exitosamente",
    flashcard,
  });
};

// :: GET - Obtner todas las flashcards por materia - listo
const obtenerFlashcardsPorMateria = async (req = request, res = response) => {
  try {
    const { idU, idM } = req.params;
    const flashcards = await Flashcard.find({
      usuario: idU,
      materia: idM,
    })
      .populate("materia", "nombreMateria -_id")
      .populate("usuario", "nombre -_id");
    res.json({
      msg: "Flashcards obtenidas correctamente",
      total: flashcards.length,
      flashcards,
    });
  } catch (error) {
    console.log("Error en obtenerFlashcardsPorMateria:", error);
    res.status(500).json({
      msg: "Error interno del servidor - obtenerFlashcardsPorMateria",
      error: error.message,
    });
  }
};

const modificarFlascard = async (req = request, res = response) => {
  const { delanteFlashcard, reversoFlashcard } = req.body;
  const cambios = {};
  if (delanteFlashcard !== undefined) cambios.delanteFlashcard = delanteFlashcard;
  if (reversoFlashcard !== undefined) cambios.reversoFlashcard = reversoFlashcard;
  try {
    const { flashcard } = req;
    const flashcardActualizada = await Flashcard.findByIdAndUpdate(
      flashcard._id,
      cambios,
      { new: true }
    );
    res.json({
      msg: "Flashcard actualizada correctamente",
      flashcard: flashcardActualizada
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor al actualizar flashcard",
      error: error.message,
    });
  }
};


const borrarFlashcard = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const { flashcard } = req; 
    await Flashcard.findByIdAndDelete(flashcard._id);
    await Usuario.findByIdAndUpdate(idU, {
      $pull: { flashcards: flashcard._id }
    });
    res.json({
      msg: "Flashcard eliminada correctamente",
      flashcardEliminada: flashcard
    });
  } catch (error) {
    console.log("Error en borrarFlashcard:", error);
    res.status(500).json({
      msg: "Error interno del servidor - borrarFlashcard",
      error: error.message
    });
  }
};



// Borrar todas las flashcard por seccion materia
const borrarFlashcardsPorMateria = async (req = request, res = response) => {
  try {
    const { idU, idM } = req.params;

    const flashcardsMateria = await Flashcard.find({
      usuario: idU,
      materia: idM,
    }).select("_id");

    if (flashcardsMateria.length === 0) {
      return res.status(404).json({
        msg: "El usuario no tiene flashcards para esa materia",
        totalFlashcards: 0,
      });
    }

    const resultado = await Flashcard.deleteMany({
      usuario: idU,
      materia: idM,
    });

    await Usuario.findByIdAndUpdate(idU, {
      $pull: { flashcards: { $in: flashcardsMateria.map(f => f._id) } },
    });

    res.json({
      msg: "Todas las flashcards de la materia han sido eliminadas",
      totalEliminadas: resultado.deletedCount,
    });
  } catch (error) {
    console.log("Error en borrarFlashcardsPorMateria:", error);
    res.status(500).json({
      msg: "Error interno del servidor - borrarFlashcardsPorMateria",
      error: error.message,
    });
  }
};



const borrarFlashcards = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const flashcardsUsuario = await Flashcard.find({ usuario: idU }).select("_id");
    if (flashcardsUsuario.length === 0) {
      return res.status(404).json({
        msg: "El usuario no tiene flashcards para eliminar",
        totalFlashcards: 0
      });
    }
    const resultado = await Flashcard.deleteMany({ usuario: idU });
    await Usuario.findByIdAndUpdate(idU, { flashcards: [] });
    res.json({
      msg: "Todas las flashcards del usuario han sido eliminadas",
      totalEliminadas: resultado.deletedCount
    });
  } catch (error) {
    console.log("Error en borrarFlashcards:", error);
    res.status(500).json({
      msg: "Error interno del servidor - borrarFlashcards",
      error: error.message
    });
  }
};

// Obtener materias que tienen al menos una flashcard para un usuario
const obtenerMateriasConFlashcards = async (req = request, res = response) => {
  try {
    const { idU } = req.params;

    // 1) IDs de materias que tienen flashcards de este usuario
    const materiasIds = await Flashcard.distinct('materia', {
      usuario: idU,
    });

    if (!materiasIds || materiasIds.length === 0) {
      return res.json({
        ok: true,
        materias: [],
      });
    }

    // 2) Traer la info de esas materias
    const materias = await Materia.find({
      _id: { $in: materiasIds },
      // si manejas campo "usuario" en Materia, puedes filtrarlo también:
      // usuario: idU,
    }).lean();

    return res.json({
      ok: true,
      materias,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al obtener materias con flashcards',
    });
  }
};


module.exports = {
  crearFlashcard,
  obtenerFlashcard,
  obtenerFlashcardsPorMateria,
  obtenerMateriasConFlashcards,
  modificarFlascard,
  borrarFlashcard,
  borrarFlashcardsPorMateria,
  borrarFlashcards,
};
