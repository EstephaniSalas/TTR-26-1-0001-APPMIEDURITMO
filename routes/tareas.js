const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {validarTareaUsuario, validarEliminarTarea} = require("../middlewares/tareas");
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

const router = Router();

//:: POST - Crear tarea para para un usuario por id
router.post(
  "/:id",
  [
    check("id").notEmpty() .withMessage("El id del usuario es obligatorio").isMongoId().withMessage("No es un ID usuario válido de MongoDB"),
    check("id").custom(existeUsuarioPorId),
    check("nombreTarea", "El nombre de la tarea es obligatorio").not().isEmpty(),
    check("materiaTarea").optional().isMongoId().withMessage("ID de materia inválido"),
    check("tipoTarea").optional().isIn(["Tarea", "Proyecto", "Examen"]).withMessage("Tipo de tarea inválido"),
    check("fechaEntregaTarea", "La fecha de entrega es obligatoria").not().isEmpty(),
    check("horaEntregaTarea", "La hora de entrega es obligatoria").not().isEmpty(),
    check("prioridadTarea").optional().isBoolean().withMessage("La prioridad debe ser un valor booleano"),
    check("estatusTarea").notEmpty().withMessage("El estatus es obligatorio").isIn(["Pendiente", "Completada"]).withMessage("Estatus inválido"),
    validarCampos,
  ],
  crearTarea
);

// :: GET - OBTNER TAREA
router.get("/idUsuario/:idU/idTarea/:idT",[
    // Validaciones de IDs en URL
    check("idU").notEmpty().withMessage("El ID del usuario es obligatorio").isMongoId().withMessage("No es un ID válido de MongoDB"),
    check("idU").custom(existeUsuarioPorId),
    check("idT").notEmpty().withMessage("El ID de la tarea es obligatorio").isMongoId().withMessage("No es un ID válido de MongoDB"),
    check("idT").custom(existeTareaPorId),
    validarCampos,
    validarTareaUsuario,
  ], obtenerTarea);


//:: GET . Obtner todas las tareas de un usuario
router.get("/idUsuario/:id", [
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id', 'No es un ID válido de MongoDB').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
  ], obtenerTareas);


// :: PUT - Actualizar tarea de un usuario por id
router.put("/idUsuario/:idU/idTarea/:idT", [
    check('idU').notEmpty().withMessage('El id de usuario es obligatorio'),
    check('idU', 'No es un ID válido de MongoDB').isMongoId(),
    check('idU').custom(existeUsuarioPorId),
    check('idT').notEmpty().withMessage('El id de la tarea es obligatorio'),
    check('idT', 'No es un ID válido de MongoDB').isMongoId(),
    check('idT').custom(existeTareaPorId),
    check("nombreTarea", "El nombre de la tarea es obligatorio").not().isEmpty(),
    check("materiaTarea").optional().isMongoId().withMessage("ID de materia inválido"),
    check("tipoTarea").optional().isIn(["Tarea", "Proyecto", "Examen"]).withMessage("Tipo de tarea inválido"),
    check("fechaEntregaTarea", "La fecha de entrega es obligatoria").not().isEmpty(),
    check("horaEntregaTarea", "La hora de entrega es obligatoria").not().isEmpty(),
    check("prioridadTarea").optional().isBoolean().withMessage("La prioridad debe ser un valor booleano"),
    validarCampos,
    validarTareaUsuario,
], actualizarTarea);


// :: PATCH - Mpdifircar estatus materia
router.patch(
  "/idUsuario/:idU/idTarea/:idT/estatus",
  [
    check("idU").notEmpty().withMessage("El ID del usuario es obligatorio").isMongoId().withMessage("No es un ID válido de MongoDB"),
    check("idU").custom(existeUsuarioPorId),
    check("idT").notEmpty().withMessage("El ID de la tarea es obligatorio").isMongoId().withMessage("No es un ID válido de MongoDB"),
    check("idT").custom(existeTareaPorId),
    // Validación del body (solo estatus)
    check("estatusTarea").notEmpty().withMessage("El estatus es obligatorio").isIn(["Pendiente", "Completada"]).withMessage("Estatus inválido"),
    validarCampos,
    validarTareaUsuario,
  ],
  cambiarStatusTarea
);


// :: DELETE - Eliminar una tarea de un usuario
router.delete("/idUsuario/:idU/idTarea/:idT", [
    check('idU').notEmpty().withMessage('El id de usuario es obligatorio'),
      check('idU', 'No es un ID válido de MongoDB').isMongoId(),
      check('idU').custom(existeUsuarioPorId),
      check('idT').notEmpty().withMessage('El id de la tarea es obligatorio'),
      check('idT', 'No es un ID válido de MongoDB').isMongoId(),
      check('idT').custom(existeTareaPorId),
      check('confirmacion')
        .notEmpty().withMessage('La confirmación es obligatoria')
        .isBoolean().withMessage('El dato debe ser un booleano'),
      validarCampos,
      validarEliminarTarea,
      validarTareaUsuario,
],borrarTarea);


// :: DELETE - Borrar todas las tareas de un usuario
router.delete("/idUsuario/:idU/todas", [
  check('idU').notEmpty().withMessage('El id de usuario es obligatorio'),
  check('idU', 'No es un ID válido de MongoDB').isMongoId(),
  check('idU').custom(existeUsuarioPorId),
  check('confirmacion')
    .notEmpty().withMessage('La confirmación es obligatoria')
    .isBoolean().withMessage('El dato debe ser un booleano'),
  validarCampos,
  validarEliminarTarea,
], borrarTareas);

module.exports = router;
