const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { existeUsuarioPorId, existeMateriaPorId } = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  crearMateria,
  obtenerMateria,
  obtenerMaterias,
  modificarMateria,
  borrarMateria,
  borrarMaterias,
} = require("../controllers/materias");

const {
  validarMateriaPorUsuario,
  validarMateriaUsuario,
  validarEliminarMateria,
  validarMateriasUsuario,
  validarHorariosMateria,
  validarTraslapesHorariosMateria,
} = require("../middlewares/materias");

const router = Router();

// ::: POST - Crear materia para un usuario por id :::
router.post("/idUsuario/:idU", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("nombreMateria")
    .notEmpty().withMessage("El nombre de la materia es obligatorio"),
  check("horariosMateria")
    .isArray({ min: 1 }).withMessage("horariosMateria debe ser un arreglo con al menos un horario"),
  validarCampos,
  validarMateriaPorUsuario, // evitar duplicados por usuario
  validarHorariosMateria,   // validar formato y orden de horarios
  validarTraslapesHorariosMateria,
], crearMateria);



// ::: GET - Obtener todas las materias de un usuario :::
router.get("/idUsuario/:id", [
  validarJWT,
  check('id').notEmpty().withMessage('El id es obligatorio'),
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], obtenerMaterias);



// ::: GET - Obtener materia por idMateria :::
router.get("/:id", [
  validarJWT,
  check('id').notEmpty().withMessage('El id es obligatorio'),
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeMateriaPorId),
  validarCampos
], obtenerMateria);


// ::: PUT - Modificar materia por idUsuario + idMateria :::
router.put("/idUsuario/:idU/idMateria/:idM", [
  validarJWT,
  check('idU').notEmpty().withMessage('El id de usuario es obligatorio'),
  check('idU', 'No es un ID válido de MongoDB').isMongoId(),
  check('idU').custom(existeUsuarioPorId),
  check('idM').notEmpty().withMessage('El id de la materia es obligatorio'),
  check('idM', 'No es un ID válido de MongoDB').isMongoId(),
  check('idM').custom(existeMateriaPorId),
  // CAMBIO: actualización parcial
  check('nombreMateria').optional()
    .notEmpty().withMessage('El nombre de la materia es obligatorio'),
  check('profesorMateria').optional(),
  check('edificioMateria').optional(),
  check('salonMateria').optional(),
  // CAMBIO: si viene horariosMateria, debe ser array
  check('horariosMateria').optional()
    .isArray({ min: 1 }).withMessage('horariosMateria debe ser un arreglo con al menos un horario'),
  validarCampos,
  validarHorariosMateria,  // valida si viene horariosMateria
  validarMateriaUsuario,
  validarTraslapesHorariosMateria,
], modificarMateria);

// ::: DELETE - Eliminar una materia de un usuario :::
router.delete("/idUsuario/:idU/idMateria/:idM", [
  validarJWT,
  check('idU').notEmpty().withMessage('El id de usuario es obligatorio'),
  check('idU', 'No es un ID válido de MongoDB').isMongoId(),
  check('idU').custom(existeUsuarioPorId),
  check('idM').notEmpty().withMessage('El id de la materia es obligatorio'),
  check('idM', 'No es un ID válido de MongoDB').isMongoId(),
  check('idM').custom(existeMateriaPorId),
  check('confirmacion')
    .notEmpty().withMessage('La confirmación es obligatoria')
    .isBoolean().withMessage('El dato debe ser un booleano'),
  validarCampos,
  validarEliminarMateria,
  validarMateriaUsuario,
], borrarMateria);

// ::: DELETE - Borrar TODAS las materias de un usuario :::
router.delete("/idUsuario/:idU", [
  validarJWT,
  check('idU').notEmpty().withMessage('El id de usuario es obligatorio'),
  check('idU', 'No es un ID válido de MongoDB').isMongoId(),
  check('idU').custom(existeUsuarioPorId),
  check('confirmacion')
    .notEmpty().withMessage('La confirmación es obligatoria')
    .isBoolean().withMessage('El dato debe ser un booleano'),
  validarCampos,
  validarMateriasUsuario,
  validarEliminarMateria,
], borrarMaterias);

module.exports = router;
