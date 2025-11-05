const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { existeUsuarioPorId, existeMateriaPorId } = require("../helpers/db-validators");
const {
  crearMateria,
  obtenerMateria,
  obtenerMaterias,
  modificarMateria,
  borrarMateria,
  borrarMaterias,
} = require("../controllers/materias");
const { validarMateriaPorUsuario, validarMateriaUsuario, validarEliminarMateria, validarMateriasUsuario } = require("../middlewares/materias");

const router = Router();

//Crear materia para un usuario por id
//falta validar horarios cruzados
router.post("/:id", [
  check('id').notEmpty().withMessage("El id es obligatorio").isMongoId().withMessage("No es un ID válido de MongoDB"),
  check('id').custom(existeUsuarioPorId),
  check('nombreMateria', 'El nombre de la materia es obligatorio').not().isEmpty(),
  check('profesorMateria', 'El nombre del profesor es obligatorio').optional().not().isEmpty(),
  check('edificioMateria', 'El edificio es obligatorio').optional().not().isEmpty(),
  check('salonMateria', 'El salón es obligatorio').optional().not().isEmpty(),
  check('diasMateria', 'Los días de la semana son obligatorios').isArray({ min: 1 }),
  check('horaInicioMateria', 'La hora de inicio es obligatoria'),
  check('horaFinMateria', 'La hora de fin es obligatoria'),
  validarCampos,
  validarMateriaPorUsuario,
], crearMateria);

//Obtener materia por id de la materia
router.get("/:id",[
  check('id').notEmpty().withMessage('El id es obligatorio'),
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeMateriaPorId),
  validarCampos
], obtenerMateria);
//Obtener todas las materias de un usuario
router.get("/idUsuario/:id",[
  check('id').notEmpty().withMessage('El id es obligatorio'),
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], obtenerMaterias);
//modificar materia  por id
//--falta validar si son los mismos datos que ya tenia
//falta validar que si cambia el nombre o horario no se traslape o sea duplicada
router.put("/idUsuario/:idU/idMateria/:idM", [
  check('idU').notEmpty().withMessage('El id de usuario es obligatorio'),
  check('idU', 'No es un ID válido de MongoDB').isMongoId(),
  check('idU').custom(existeUsuarioPorId),
  check('idM').notEmpty().withMessage('El id de la materia es obligatorio'),
  check('idM', 'No es un ID válido de MongoDB').isMongoId(),
  check('idM').custom(existeMateriaPorId),
  check('nombreMateria', 'El nombre de la materia es obligatorio').not().isEmpty(),
  check('profesorMateria', 'El nombre del profesor es obligatorio').optional().not().isEmpty(),
  check('edificioMateria', 'El edificio es obligatorio').optional().not().isEmpty(),
  check('salonMateria', 'El salón es obligatorio').optional().not().isEmpty(),
  check('diasMateria', 'Los días de la semana son obligatorios').isArray({ min: 3 }),
  check('horaInicioMateria', 'La hora de inicio es obligatoria').notEmpty(),
  check('horaFinMateria', 'La hora de fin es obligatoria').notEmpty(),
  validarCampos,
  validarMateriaUsuario
], modificarMateria);

router.delete("/idUsuario/:idU/idMateria/:idM", [
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

// Borrar TODAS las materias de un usuario
router.delete("/idUsuario/:idU", [
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
