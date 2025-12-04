// routes/autenticacion.js
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { loginUsuario, verificarJWT, cerrarSesion } = require("../controllers/autenticacion");
const { validarUsuarioLogin, validarPasswordLogin } = require("../middlewares/autenticacion");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// :: POST - Login usuario
router.post("/login", [
  check('correo')
    .notEmpty().withMessage("El correo es obligatorio")
    .isEmail().withMessage("El correo no es valido"),
  check('password')
    .notEmpty().withMessage("El password es obligatorio"),
  validarCampos,
  validarUsuarioLogin, // Valida si el correo existe y si el usuario está activo
  validarPasswordLogin, // Valida que la contraseña coincida
], loginUsuario);

// Simple endpoint para probar/verificar un token
router.get("/verificarJWT",[
  validarJWT,
], verificarJWT);


module.exports = router;
