const validarContraseñasIguales = (req, res, next) => {
  const { password, password2 } = req.body;
    if (password !== password2) {
        return res.status(400).json({
            msg: 'Las contraseñas no coinciden'
        });
    }
    next();
};


module.exports = {
    validarContraseñasIguales
};