const { Router } = require("express");
const { check } = require("express-validator");

const {
  crearTarea,
  obtenerTarea,
  obtenerTareas,
  actualizarTarea,
  borrarTarea,
  cambiarStatusTarea,
  borrarTareas,
} = require("../controllers/tareas");

const {
  existeUsuarioPorId,
  existeMateriaPorId,
  existeTareaPorId,
} = require("../helpers/db-validators");

const { validarCampos } = require("../middlewares/validar-campos");
const {
  validarTareaUsuario,
  validarEliminarTarea,
  validarHoraEntrega24,
  validarHoraEntrega24Opcional,
  validarCamposTareaUpdate,
} = require("../middlewares/tareas");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();



//:: POST - Crear tarea para un usuario ::
router.post("/idUsuario/:idU", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("nombreTarea", "El nombre de la tarea es obligatorio").not().isEmpty(),
  check("materiaTarea")
    .optional()
    .isMongoId().withMessage("ID de materia inválido")
    .custom(existeMateriaPorId),
  check("tipoTarea")
    .optional()
    .isIn(["Tarea", "Proyecto", "Examen"])
    .withMessage("Tipo de tarea inválido"),
  check("fechaEntregaTarea")
    .notEmpty().withMessage("La fecha de entrega es obligatoria")
    .isISO8601().withMessage("La fecha debe tener formato válido (YYYY-MM-DD)")
    .toDate(),
  check("horaEntregaTarea")
    .notEmpty().withMessage("La hora de entrega es obligatoria"),
  check("descripcionTarea")
    .optional()
    .isString().withMessage("La descripción debe ser texto"),
  check("estatusTarea")
    .optional()
    .isIn(["Pendiente", "Completada"])
    .withMessage("Estatus inválido"),
  validarCampos,
  validarHoraEntrega24, // valida formato HH:MM y rango
], crearTarea);



//:: GET - Obtener una tarea ::
router.get("/idUsuario/:idU/idTarea/:idT", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El ID del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("idT")
    .notEmpty().withMessage("El ID de la tarea es obligatorio")
    .isMongoId().withMessage("No es un ID válido de MongoDB")
    .custom(existeTareaPorId),
  validarCampos,
  validarTareaUsuario,
], obtenerTarea);



//:: GET - Obtener todas las tareas de un usuario ::
router.get("/idUsuario/:idU", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id es obligatorio")
    .isMongoId().withMessage("No es un ID válido de MongoDB")
    .custom(existeUsuarioPorId),
  validarCampos,
], obtenerTareas);



//:: PUT - Actualizar tarea de un usuario ::
router.put("/idUsuario/:idU/idTarea/:idT", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id de usuario es obligatorio")
    .isMongoId().withMessage("No es un ID válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("idT")
    .notEmpty().withMessage("El id de la tarea es obligatorio")
    .isMongoId().withMessage("No es un ID válido de MongoDB")
    .custom(existeTareaPorId),
  check("nombreTarea").optional()
    .notEmpty().withMessage("El nombre de la tarea no puede ir vacío"),
  check("materiaTarea").optional()
    .isMongoId().withMessage("ID de materia inválido")
    .custom(existeMateriaPorId),
  check("tipoTarea").optional()
    .isIn(["Tarea", "Proyecto", "Examen"])
    .withMessage("Tipo de tarea inválido"),
  check("fechaEntregaTarea").optional()
    .isISO8601().withMessage("La fecha debe tener formato válido (YYYY-MM-DD)")
    .toDate(),
  check("horaEntregaTarea").optional()
    .notEmpty().withMessage("La hora de entrega no puede ir vacía"),
  check("descripcionTarea").optional()
    .isString().withMessage("La descripción debe ser texto"),
  check("estatusTarea").optional()
    .isIn(["Pendiente", "Completada", "Vencida"])
    .withMessage("Estatus inválido"),
  validarCampos,
  validarTareaUsuario,
  validarCamposTareaUpdate,     // al menos un campo
  validarHoraEntrega24Opcional, // valida hora si viene
], actualizarTarea);



//:: PATCH - Cambiar estatus de tarea ::
router.patch("/idUsuario/:idU/idTarea/:idT/estatus", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El ID del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("idT")
    .notEmpty().withMessage("El ID de la tarea es obligatorio")
    .isMongoId().withMessage("No es un ID válido de MongoDB")
    .custom(existeTareaPorId),
  check("estatusTarea")
    .notEmpty().withMessage("El estatus es obligatorio")
    .isIn(["Pendiente", "Completada", "Vencida"])
    .withMessage("Estatus inválido"),
  validarCampos,
  validarTareaUsuario,
], cambiarStatusTarea);



//:: DELETE - Eliminar una tarea de un usuario ::
router.delete("/idUsuario/:idU/idTarea/:idT", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id de usuario es obligatorio")
    .isMongoId().withMessage("No es un ID válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("idT")
    .notEmpty().withMessage("El id de la tarea es obligatorio")
    .isMongoId().withMessage("No es un ID válido de MongoDB")
    .custom(existeTareaPorId),
  check("confirmacion")
    .notEmpty().withMessage("La confirmación es obligatoria")
    .isBoolean().withMessage("El dato debe ser un booleano"),
  validarCampos,
  validarEliminarTarea,
  validarTareaUsuario,
], borrarTarea);



//:: DELETE - Borrar todas las tareas de un usuario ::
router.delete("/idUsuario/:idU/todas", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id de usuario es obligatorio")
    .isMongoId().withMessage("No es un ID válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("confirmacion")
    .notEmpty().withMessage("La confirmación es obligatoria")
    .isBoolean().withMessage("El dato debe ser un booleano"),
  validarCampos,
  validarEliminarTarea,
], borrarTareas);

module.exports = router;
