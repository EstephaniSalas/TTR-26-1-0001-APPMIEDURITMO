const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  crearNota,
  obtenerNota,
  obtenerNotas,
  modificarNota,
  borrarNota,
  borrarNotas,
} = require("../controllers/notas");
const {
  existeUsuarioPorId,
  existeNotaPorId,
} = require("../helpers/db-validators");
const { validarNotaUsuario, validarEliminarNota } = require("../middlewares/notas");


const router = Router();

// ::: Post - Crear nota por usuario :::
router.post("/idUsuario/:idU", [
  validarJWT,
    check("idU").notEmpty() .withMessage("El id del usuario es obligatorio")
      .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
      .custom(existeUsuarioPorId),
    check('nombreNota').notEmpty().withMessage('El nombre de la nota es obligatorio'),
    check("contenidoNota").optional(),//no es necesario que escriba algo
    validarCampos,
],crearNota); 
  


// ::: Get - Obtener Nota de usuario por ID :::
router.get("/idUsuario/:idU/idNota/:idN",[
  validarJWT,
  check('idU').notEmpty().withMessage("El id del usuario es obligatorio").bail()
    .isMongoId().withMessage("No es un ID valido de mongo")
    .custom(existeUsuarioPorId),
  check('idN').notEmpty().withMessage("El id de la nota es obligatorio").bail()
    .isMongoId().withMessage("No es un ID valido de mongo")
    .custom(existeNotaPorId),
    validarCampos,
    validarNotaUsuario,
],obtenerNota);



// ::: Get - Obtener todas las notas del usuario :::
router.get("/idUsuario/:idU",[
  validarJWT,
  check('idU').notEmpty().withMessage("El id del usuario es obligatorio")
  .isMongoId().withMessage("No es un ID valido de mongo")
  .custom(existeUsuarioPorId),
  validarCampos,
], obtenerNotas);



// ::: Put- Modificar nota de un usuario :::
router.put("/idUsuario/:idU/idNota/:idN",[
  validarJWT,
  check('idU').notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID valido de mongo")
    .custom(existeUsuarioPorId),
  check('idN').notEmpty().withMessage("El id de la nota es obligatorio")
    .isMongoId().withMessage("No es un ID valido de mongo")
    .custom(existeNotaPorId),
  check("nombreNota").optional().not().isEmpty().withMessage("El nombre no puede estar vacío")
    .isString().withMessage("el nombre de la nota debe ser un string"),
  check("contenidoNota").optional(),//no es necesario que escriba algo
  validarCampos,
  validarNotaUsuario,
],modificarNota);



// ::: Delete - borrar la nota de un usuario :::
router.delete("/idUsuario/:idU/idNota/:idN",[
  validarJWT,
  check('idU').notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID valido de mongo")
    .custom(existeUsuarioPorId),
  check('idN').notEmpty().withMessage("El id de la nota es obligatorio")
    .isMongoId().withMessage("No es un ID valido de mongo")
    .custom(existeNotaPorId),
  check('confirmacion')
    .notEmpty().withMessage('La confirmación es obligatoria')
    .isBoolean().withMessage('El dato debe ser un booleano'),
  validarCampos,
  validarEliminarNota,
  validarNotaUsuario,
],borrarNota);



// ::: Delete -Borrar todas las notas de un usuario :::
router.delete("/idUsuario/:idU",[
  validarJWT,
  check('idU').notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID valido de mongo")
    .custom(existeUsuarioPorId),
  check('confirmacion')
    .notEmpty().withMessage('La confirmación es obligatoria')
    .isBoolean().withMessage('El dato debe ser un booleano'),
  validarCampos,
  validarEliminarNota,
],borrarNotas);


module.exports = router;
