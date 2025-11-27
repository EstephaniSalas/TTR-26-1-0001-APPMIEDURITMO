const { response, request } = require("express");
const bcryptjs = require("bcryptjs"); //libreria para encriptar contraseñas

const Usuario = require("../models/usuario");
const {generarCodigoVerificacion,enviarCorreo} = require("../helpers/correo");



//:::::: CREAR USUARIO - POST :::::::
const crearUsuario = async (req = request, res = response) => {
  const { nombre, correo, password } = req.body;
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor al crear usuario.",
      error: error.message
    })
    
  }
};



//:::::: OBTENER USUARIO - GET ::::::
const obtenerUsuario = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findById(id)
      .populate("materias", "nombreMateria -_id")
      .populate("tareas", "nombreTarea estatusTarea -_id")
      .populate("notas", "nombreNota contenidoNota -_id")
      .populate("flashcards", "delanteFlashcard -_id")
      .populate("eventos", "tituloEvento fechaEvento -_id");
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
const actualizarUsuario = async (req = request, res = response) => {
  const { id } = req.params;
  const { nombre, passwordNueva } = req.body;
  const datosActualizar = { };
  if( nombre !== undefined) {
    datosActualizar.nombre = nombre;
  }
  if( passwordNueva !== undefined ) {
    //  encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    datosActualizar.password = bcryptjs.hashSync(passwordNueva, salt);
  }
  if (Object.keys(datosActualizar).length === 0) {
    return res.status(400).json({
      msg: "No hay datos para actualizar",
    });
  }
  try {
    const usuario = await Usuario.findByIdAndUpdate(id, datosActualizar, {new: true});
    res.json({
      msg: "Usuario actualizado correctamente",
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor al actualizar usuario.",
      error: error.message
    });
  }
};



//:::::: BORRAR USUARIO - DELETE ::::::
const borrarUsuario = async (req, res = response) => {
  const { id } = req.params;
  const uid = req.uid;

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
    const usuarioAutenticado = req.usuario;
    res.json({
      msg: "Usuario eliminado correctamente",
      usuario,
      usuarioAutenticado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor al desactivar usuario.",
      error: error.message
    });
  }
};



//:::::: SOLICITAR CAMBIO DE PASSWORD ::::::
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
    usuario.codigoVerificacionValidado = false;  // <<< CAMBIO CLAVE

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



//:::::: VALIDAR CÓDIGO (SOLO PARA PANTALLA DE VERIFICACIÓN) ::::::
const validarCodigo = async (req, res = response) => {
  try {
    const { correo, codigo } = req.body;

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

    const codigoGuardado = String(usuario.codigoVerificacion || "").trim();
    const codigoIngresado = String(codigo || "").trim();

    if (codigoGuardado !== codigoIngresado) {
      usuario.intentosCodigo += 1;
      await usuario.save();
      return res.status(400).json({
        msg: "Código de verificación incorrecto",
      });
    }

    if (!usuario.expiracionCodigo || new Date() > usuario.expiracionCodigo) {
      return res.status(400).json({
        msg: "El código ha expirado",
      });
    }

    // >>> AQUÍ MARCAMOS QUE EL CÓDIGO YA FUE VALIDADO <<<
    usuario.codigoVerificacionValidado = true;
    await usuario.save();

    return res.json({
      msg: "Código válido",
    });
  } catch (error) {
    console.log("Error en validarCodigo:", error);
    return res.status(500).json({
      msg: "Error interno del servidor.",
    });
  }
};




//:::::: CONFIRMAR CAMBIO DE PASSWORD (VALIDA CÓDIGO + CAMBIA PASSWORD) ::::::
const confirmarCambioPassword = async (req, res = response) => {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    // >>> BLOQUEO SI NO HA PASADO POR /validarCodigo <<<
    if (!usuario.codigoVerificacionValidado) {
      return res.status(400).json({
        msg: "Debes validar el código de verificación antes de cambiar la contraseña",
      });
    }

    // (opcional) puedes volver a checar expiración si quieres doble seguridad
    if (!usuario.expiracionCodigo || new Date() > usuario.expiracionCodigo) {
      return res.status(400).json({
        msg: "El código ha expirado, solicita uno nuevo",
      });
    }

    // Hashear nueva contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Limpiar todo lo relacionado al código
    usuario.codigoVerificacion = null;
    usuario.expiracionCodigo = null;
    usuario.intentosCodigo = 0;
    usuario.codigoVerificacionValidado = false;

    await usuario.save();

    return res.json({
      msg: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.log("Error en confirmarCambioPassword:", error);
    return res.status(500).json({
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
  validarCodigo,
};