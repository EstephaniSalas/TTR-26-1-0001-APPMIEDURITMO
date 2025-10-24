const { response, request } = require("express");
const bcryptjs = require("bcryptjs"); //libreria para encriptar contraseñas

const Usuario = require("../models/usuario");



//:::::: CREAR USUARIO - POST :::::::
const crearUsuario = async (req = request, res = response) => {
  const { nombre, correo, password, password2 } = req.body;

  //guardar usuario en base de datos
  const usuario = new Usuario({
    nombre,
    correo,
    password,
    password2,
  });

  //encriptar la contraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  //guardar en bd
  await usuario.save();

  res.json({
    msg: "crear usuario - controlador",
    usuario,
  });
};



//:::::: OBTENER USUARIO - GET :::::: 
const obtenerUsuario = async(req = request, res = response) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findById(id);
    
    res.json({
      usuario
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error interno del servidor'
    });
  }
};



//:::::: ACTUALIZAR USUARIO - PUT :::::: 
const actualizarUsuario = async (req, res = response) => {
  const { id } = req.params;
  const { _id, correo, ...resto } = req.body; //RESTO = Datos que e pueden ser actualizados

  //Validar contra base de datos
  if (password) {
    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    msg: "actualizar usuario - controlador",
    usuario,
  });
};



const borrarUsuario = async(req, res = response) => {
  const { id } = req.params;

  //Borrar fisicamente
  //const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({
    msg: "borrar usuario - controlador",
    usuario
  });
}


module.exports = {
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
};
