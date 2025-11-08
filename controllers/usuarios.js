const { response, request } = require("express");
const bcryptjs = require("bcryptjs"); //libreria para encriptar contraseñas

const Usuario = require("../models/usuario");
const {
  generarCodigoVerificacion,
  enviarCorreo,
} = require("../helpers/correo");
const usuario = require("../models/usuario");


//:::::: CREAR USUARIO - POST :::::::
const crearUsuario = async (req = request, res = response) => {
  const { nombre, correo, password } = req.body;

  //  guardar usuario en base de datos
  const usuario = new Usuario({
    nombre,
    correo,
    password,
  });

  //  encriptar la contraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  //  guardar en bd
  await usuario.save();

  res.json({
    msg: "usuario creado correctamente",
    usuario,
  });
};

//:::::: OBTENER USUARIO - GET ::::::
const obtenerUsuario = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findById(id)
      .populate('materias', 'nombreMateria -_id')
      .populate('tareas', 'nombreTarea estatusTarea -_id')
      .populate('notas', 'nombreNota contenidoNota -_id');
      // .populate('flashcards') 
      // .populate('eventos');  
    res.status(200).json({
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Error al obtener el usuario con id: ${id} fallo`,
    });
  }
};

//:::::: ACTUALIZAR USUARIO - PUT ::::::
const actualizarUsuario = async (req, res = response) => {
  const { id } = req.params;
  const { nombre } = req.body; //RESTO = Datos que e pueden ser actualizados


  const usuario = await Usuario.findByIdAndUpdate(id, nombre,{new: true});

  res.json({
    msg: "actualizar usuario - controlador",
    usuario,
  });
};

const borrarUsuario = async (req, res = response) => {
  const { id } = req.params;

  //Borrar fisicamente
  //const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({
    msg: "borrar usuario - controlador",
    usuario,
  });
};

const solicitarCambioPassword = async (req, res = response) => {
  try {
    const { correo } = req.body;
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario no encontrado",
      });
    }
    // Generar código y fecha de expiración (15 minutos)
    const codigo = generarCodigoVerificacion();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    // Guardar código en el usuario
    usuario.codigoVerificacion = codigo;
    usuario.expiracionCodigo = expiracion;
    usuario.intentosCodigo = 0;

    await usuario.save();
    // Enviar email
    await enviarCorreo(usuario.correo, usuario.nombre, codigo);

    res.json({
      msg: "Código de verificación enviado a tu correo",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Error al solicitar cambio de contraseña ${error}`,
    });
  }
};

const confirmarCambioPassword = async (req, res = response) => {
  try {
    const { correo, codigo, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario no encontrado",
      });
    }
    // Limitar intentos
    if (usuario.intentosCodigo >= 5) {
      return res.status(400).json({
        msg: "Demasiados intentos fallidos. Solicita un nuevo código",
      });
    }

    // Verificar código y expiración
    if (usuario.codigoVerificacion !== codigo) {
      usuario.intentosCodigo += 1;
      await usuario.save();

      return res.status(400).json({
        msg: "Código de verificación incorrecto",
      });
    }

    if (new Date() > usuario.expiracionCodigo) {
      return res.status(400).json({
        msg: "El código ha expirado",
      });
    }


    // Hashear nueva contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Limpiar código de verificación
    usuario.codigoVerificacion = null;
    usuario.expiracionCodigo = null;
    usuario.intentosCodigo = 0;

    await usuario.save();

    res.json({
      msg: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor.",
    });
  }
};

module.exports = {
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
  solicitarCambioPassword,
  confirmarCambioPassword,
};
