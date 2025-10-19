const {request, response} = require('express');

const iniciarSesion = (req = request, res = response) => {
    res.json({
        msg: 'iniciar Sesion - controlador'
    });
}
const verificarJWT = (req = request, res = response) => {
    res.json({
        msg: 'verificar JWT - controlador'
    });
}
const cerrarSesion = (req = request, res = response) => {
    res.json({
        msg: 'cerrar sesion - controlador'
    });
}
module.exports = {
    iniciarSesion,
    verificarJWT,
    cerrarSesion
};