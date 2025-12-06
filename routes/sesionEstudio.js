// routes/sesionEstudio.js
const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { existeUsuarioPorId, existeMateriaPorId } = require("../helpers/db-validators");
const { validarMateriaUsuario } = require("../middlewares/materias");

const {
  crearSesionEstudio,
  obtenerResumenEstudio,
} = require("../controllers/sesionEstudio");

const router = Router();

/**
 * POST - Registrar sesión de estudio
 * /api/sesiones-estudio/idUsuario/:idU/idMateria/:idM
 */
router.post("/idUsuario/:idU/idMateria/:idM", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("idM")
    .notEmpty().withMessage("El id de la materia es obligatorio")
    .isMongoId().withMessage("No es un ID materia válido de MongoDB")
    .custom(existeMateriaPorId),
  check("duracionSegundos")
    .notEmpty().withMessage("La duración de la sesión es obligatoria")
    .isInt({ min: 1 }).withMessage("La duración debe ser un entero mayor o igual a 1"),
  check("fechaSesion")
    .optional()
    .isISO8601().withMessage("fechaSesion debe ser una fecha válida"),
  validarCampos,
  validarMateriaUsuario,
], crearSesionEstudio);

/**
 * GET - Obtener resumen de estudio por usuario
 * /api/sesiones-estudio/idUsuario/:idU?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&idMateria=...
 */
router.get("/idUsuario/:idU", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  validarCampos,
], obtenerResumenEstudio);

module.exports = router;
