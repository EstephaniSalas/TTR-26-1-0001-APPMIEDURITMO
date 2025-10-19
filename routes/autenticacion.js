const {Router} = require('express');
const { iniciarSesion, verificarJWT, cerrarSesion } = require('../controllers/autenticacion');

const router = Router();

router.post('/iniciarSesion',iniciarSesion);

router.get('/verificarJWT',verificarJWT);

router.post('/cerrarSesion',cerrarSesion);


module.exports = router;
