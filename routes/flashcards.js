const { Router } = require("express");
const { check } =  require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { crearFlashcard, obtenerFlashcard, obtenerFlashcardsPorMateria,
        borrarFlashcard, modificarFlascard, 
        borrarFlashcards} = require("../controllers/flashcards");
const {existeUsuarioPorId, existeFlashcardPorId, existeMateriaPorId} = require("../helpers/db-validators");
const {validarMateriaUsuario} = require("../middlewares/materias")
const {validarFlashcardUsuario, validarCamposFlashcard, validarEliminarFlashcards} = require("../middlewares/flashcard");

const router = Router();

// :: POST - Crear flashcard por usuario - listo
router.post("/idUsuario/:idU/idMateria/:idM", [
    check("idU").notEmpty().withMessage("El id del usuario es obligatorio")
     .isMongoId().withMessage("No es un ID usuario válido de MongoDB").custom(existeUsuarioPorId),
    check("idM").notEmpty().withMessage("El id de la materia es obligatorio")
     .isMongoId().withMessage("No es un ID materia válido de MongoDB"),
    check('delanteFlashcard').notEmpty().withMessage('La pregunta o concepto de la flashcard es obligatorio'),
    check('reversoFlashcard').notEmpty().withMessage('La respuesta a la pregunta o concepto de la flashcard es obligatorio'),
    validarCampos,
    validarMateriaUsuario
], crearFlashcard ); 


// :: GET - Obtener una flashcard  por usuario y materia -listo
router.get("/idUsuario/:idU/idFlashcard/:idF", [
    check("idU").notEmpty().withMessage("El id del usuario es obligatorio")
     .isMongoId().withMessage("No es un ID usuario válido de MongoDB"),
    check("idF").notEmpty().withMessage("El id de la flashcard es obligatorio")
     .isMongoId().withMessage("No es un ID flashcard válido de MongoDB").custom(existeFlashcardPorId),
    validarCampos,
    validarFlashcardUsuario
], obtenerFlashcard );


// :: GET - Obtener todas las flashcards por materia - listo
router.get("/idUsuario/:idU/idMateria/:idM", [
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("idM")
    .notEmpty().withMessage("El id de la materia es obligatorio")
    .isMongoId().withMessage("No es un ID materia válido de MongoDB")
    .custom(existeMateriaPorId),
  validarCampos,
  validarMateriaUsuario,
], obtenerFlashcardsPorMateria);

router.put("/idUsuario/:idU/idFlashcard/:idF",[
    check("idU").notEmpty().withMessage("El id del usuario es obligatorio")
        .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
        .custom(existeUsuarioPorId),
    check("idF").notEmpty().withMessage("El id de la flashcard es obligatorio")
        .isMongoId().withMessage("No es un ID flashcard válido de MongoDB"),
    check('delanteFlashcard').optional().notEmpty().withMessage('La pregunta o concepto de la flashcard es obligatorio'),
    check('reversoFlashcard').optional().notEmpty().withMessage('La respuesta a la pregunta o concepto de la flashcard es obligatorio'),
    validarCampos,
    validarFlashcardUsuario,
    validarCamposFlashcard,
], modificarFlascard); 

router.delete("/idUsuario/:idU/idFlashcard/:idF",[
    check("idU").notEmpty().withMessage("El id del usuario es obligatorio")
        .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
        .custom(existeUsuarioPorId),
    check("idF").notEmpty().withMessage("El id de la flashcard es obligatorio")
        .isMongoId().withMessage("No es un ID flashcard válido de MongoDB"),
    check("confirmacion").notEmpty().withMessage("La confirmación es obligatoria")
        .isBoolean().withMessage("La confirmación debe ser un booleano"),
    validarCampos,
    validarFlashcardUsuario,
    validarEliminarFlashcards,
], borrarFlashcard ); 

router.delete("/idUsuario/:idU",[
    check("idU").notEmpty().withMessage("El id del usuario es obligatorio")
        .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
        .custom(existeUsuarioPorId),
    check("confirmacion").notEmpty().withMessage("La confirmación es obligatoria")
        .isBoolean().withMessage("La confirmación debe ser un booleano"),
    validarCampos,
    validarEliminarFlashcards,
], borrarFlashcards);


module.exports = router;
