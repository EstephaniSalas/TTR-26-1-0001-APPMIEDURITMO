const { response, request } = require("express");
const Usuario = require("../models/usuario");
const Nota = require("../models/nota");


// :: POST - Craer nota
const crearNota = async(req = request, res = response) => {
 try {
    const {idU} = req.params;
    const {nombreNota,contenidoNota} = req.body;
    // Crear la nota
    const nota = new Nota({
      usuario: idU,
      nombreNota,
      contenidoNota: contenidoNota || "",
    });

    const notaNueva = await nota.save();
    // Agregar tarea a schema Usuario
    await Usuario.findByIdAndUpdate(idU, {
      $push: { notas: nota._id },
    });
    const notaCreada = await Nota.findById(nota._id)
      .populate("usuario", "nombre -_id");
    res.status(201).json({
      msg: "Nota creada correctamente",
      notaCreada: notaCreada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor al crear nota",
      error: error.message,
    });
  }
};

const obtenerNota = async (req = request, res = response) => {
  try {
    const { idN } = req.params;
    const { nota } = req;

    const notaCompleta = await Nota.findById(idN)
      .populate("usuario", "nombre -_id");

    res.status(200).json({
      msg: "Nota obtenida exitosamente",
      nota: notaCompleta
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al obtener la nota",
      error: error.message,
    });
  }
};

const obtenerNotas = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const { limite = 10, desde = 0 } = req.query;

    const [total, notas] = await Promise.all([
      Nota.countDocuments({ usuario: idU }),
      Nota.find({ usuario: idU })
        .populate("usuario", "nombre -_id")
        .sort({ _id: -1 }) // Más recientes primero
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
      msg: "Notas obtenidas exitosamente",
      total,
      mostrando: notas.length,
      desde: Number(desde),
      limite: Number(limite),
      notas
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al obtener las notas",
      error: error.message,
    });
  }
};

const modificarNota = async (req = request, res = response) => {
  try {
    const { idN } = req.params;
    const { nota } = req;
    const { nombreNota, contenidoNota } = req.body;

    // Preparar actualización
    const datosActualizados = {};
    if (nombreNota !== undefined) datosActualizados.nombreNota = nombreNota;
    if (contenidoNota !== undefined) datosActualizados.contenidoNota = contenidoNota;

    if (Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({
        msg: "No se enviaron datos para actualizar",
        notaActual: nota,
      });
    }
    const notaActualizada = await Nota.findByIdAndUpdate(
      idN,
      datosActualizados,
      { new: true, runValidators: true }
    ).populate("usuario", "nombre -_id");
    res.json({
      msg: "Nota actualizada exitosamente",
      cambios: datosActualizados,
      nota: notaActualizada
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al modificar nota",
      error: error.message,
    });
  }
};

const borrarNota = async (req = request, res = response) => {
  try {
    const { idU, idN } = req.params;
    const { nota } = req;
    const infoNota = {
      id: nota._id,
      nombre: nota.nombreNota,
    };
    await Nota.findByIdAndDelete(idN);
    // Remover nota del usuario
    await Usuario.findByIdAndUpdate(idU, {
      $pull: { notas: idN }
    });

    res.json({
      msg: "Nota eliminada exitosamente",
      notaEliminada: infoNota
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al borrar nota",
      error: error.message,
    });
  }
};

const borrarNotas = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const notasAEliminar = await Nota.find({ usuario: idU })
      .select('nombreNota -_id');
    
    const totalNotas = notasAEliminar.length;

    if (totalNotas === 0) {
      return res.status(404).json({
        msg: "El usuario no tiene notas para eliminar",
        totalNotas: 0
      });
    }

    const resultado = await Nota.deleteMany({ usuario: idU });
    
    // Vaciar array de notas del usuario
    await Usuario.findByIdAndUpdate(idU, { notas: [] });

    res.json({
      msg: "Todas las notas han sido eliminadas",
      resumen: {
        usuario: idU,
        totalNotas,
        eliminadas: resultado.deletedCount,
        notasEliminadas: notasAEliminar
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al eliminar todas las notas",
      error: error.message,
    });
  }
};


module.exports = {
    crearNota,
    obtenerNota,
    obtenerNotas,
    modificarNota,
    borrarNota,
    borrarNotas,
};
