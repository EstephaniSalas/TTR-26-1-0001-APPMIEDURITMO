const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { existeCorreo, existeUsuarioPorId } = require("../helpers/db-validators");

const {
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
  solicitarCambioPassword,
  confirmarCambioPassword,
  validarCodigo,
} = require("../controllers/usuarios");
const { validarPassIguales, validarPassNuevasIguales, validarPassActual} = require("../middlewares/usuarios");

const router = Router();


// ---- METODOS: ENDPOINTS ----
// ::: POST - Crear usuario :::
router.post("/", [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
  check('correo', 'El correo no es valido').notEmpty().isEmail().custom(existeCorreo),
  check('password', 'El password es obligatorio y debe de ser de al menos 8 caracteres').isLength({ min: 8 }),
  check('password2', 'El password2 es obligatorio y debe de ser de al menos 8 caracteres').isLength({ min: 8 }),
  validarCampos,
  validarPassIguales,
], crearUsuario);



// ::: GET - obtener el usuario actual :::
router.get("/:id", [
  validarJWT,
  check('id')
    .notEmpty().withMessage('El ID es obligatorio')
    .isMongoId().withMessage('No es un ID válido de MongoDB'),
  check('id').custom(existeUsuarioPorId),
  validarCampos,
], obtenerUsuario); 



// ::: PUT - Actualizar usuario actual :::
router.put("/:id", [
  validarJWT,
  check('id').notEmpty().withMessage('El id es obligatorio'),
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('nombre').optional()
    .notEmpty().withMessage('El nombre es obligatorio'),
  check('passwordActual').optional().notEmpty().withMessage('El password actual es obligatorio')
    .isLength({ min: 8 }).withMessage('El password actual debe tener al menos 8 caracteres'),
  check('passwordNueva').optional().notEmpty().withMessage('El nuevo password es obligatorio')
    .isLength({ min: 8 }).withMessage('El nuevo password debe tener al menos 8 caracteres'),
  check('passwordNueva2').optional().notEmpty().withMessage('La confirmación de password es obligatoria')
    .isLength({ min: 8 }).withMessage('La confirmación de password debe tener al menos 8 caracteres'),
    validarCampos,
    validarPassNuevasIguales,
    validarPassActual
], actualizarUsuario);



// ::: POST - Solicitar cambio de contraseña :::
router.post("/solicitud-cambio-password", [
  check("correo")
    .notEmpty().withMessage("El correo no puede estar vacío")
    .isEmail().withMessage("No es un correo válido"),
  validarCampos,
], solicitarCambioPassword);
  


// ::: POST - validar código (pantalla de “Verificar código”) :::
router.post("/validarCodigo", [
  check('correo')
    .notEmpty().withMessage("el campo no puede estar vacio")
    .isEmail().withMessage("No es un correo"),
  check('codigo', 'El codigo es obligatorio').not().isEmpty(),
  validarCampos
], validarCodigo);



// :: POST - confirmar cambio de contraseña (tercera pantalla Flutter)
router.post("/cambio-password", [
  check('correo')
    .notEmpty().withMessage("el campo no puede estar vacio")
    .isEmail().withMessage("No es un correo"),
  check('password', 'El nuevo password es obligatorio y debe tener al menos 8 caracteres')
    .notEmpty().isLength({ min: 8 }),
  check('password2', 'La confirmación de password es obligatoria y debe tener al menos 8 caracteres')
    .notEmpty().isLength({ min: 8 }),
  validarCampos,
  validarPassIguales,   // ya lo tienes, compara password y password2
], confirmarCambioPassword);



// ::: DELETE - Borrar usuario :::
router.delete("/:id", [
  validarJWT,
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos, 
], borrarUsuario);


module.exports = router;
