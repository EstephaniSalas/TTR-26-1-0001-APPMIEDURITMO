// controllers/materias.js
const { response, request } = require("express");
const Materia = require("../models/materia");
const Usuario = require("../models/usuario");



// ::: POST - Crear materia :::
const crearMateria = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const {
      nombreMateria,
      profesorMateria = "",
      edificioMateria = "",
      salonMateria = "",
      horariosMateria,
    } = req.body;

    const materia = new Materia({
      usuario: idU,
      nombreMateria,
      profesorMateria,
      edificioMateria,
      salonMateria,
      horariosMateria,
    });

    await materia.save();

    await Usuario.findByIdAndUpdate(
      idU,
      { $push: { materias: materia._id } },
    );

    const materiaCreada = await Materia.findById(materia._id)
      .populate("usuario", "nombre -_id");

    res.status(201).json({
      ok: true,
      msg: "Materia creada correctamente",
      materiaCreada,
      data: materiaCreada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};



const obtenerMateria = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const materia = await Materia.findById(id)
      .populate("usuario", "nombre -_id");

    res.status(200).json({
      ok:true,
      materia,
      data: materia,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al obtener la materia",
      error: error.message,
    });
  }
};



const obtenerMaterias = async (req = request, res = response) => {
  const { id } = req.params; // id usuario
  const { limite = 20, desde = 0 } = req.query;

  try {
    const [total, materias] = await Promise.all([
      Materia.countDocuments({ usuario: id }),
      Materia.find({ usuario: id })
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("usuario", "nombre"),
    ]);

    res.status(200).json({
      ok:true,
      total,
      materias,
      data:materias,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al obtener las materias del usuario",
      error: error.message,
    });
  }
};



const modificarMateria = async (req = request, res = response) => {
  try {
    const { idM } = req.params;
    const {
      nombreMateria,
      profesorMateria,
      edificioMateria,
      salonMateria,
      horariosMateria,
    } = req.body;

    // CAMBIO: update parcial
    const datosActualizados = {};
    if (nombreMateria !== undefined) datosActualizados.nombreMateria = nombreMateria;
    if (profesorMateria !== undefined) datosActualizados.profesorMateria = profesorMateria;
    if (edificioMateria !== undefined) datosActualizados.edificioMateria = edificioMateria;
    if (salonMateria !== undefined) datosActualizados.salonMateria = salonMateria;
    if (horariosMateria !== undefined) datosActualizados.horariosMateria = horariosMateria;

    if (Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({
        msg: "No se proporcionaron datos para actualizar",
      });
    }

    const materiaActualizada = await Materia.findByIdAndUpdate(
      idM,
      datosActualizados,
      { new: true }
    ).populate("usuario", "nombre -_id");

    res.status(202).json({
      ok:true,
      msg: "Materia modificada exitosamente",
      materiaActualizada,
      data:materiaActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al modificar materia",
      error: error.message,
    });
  }
};




const borrarMateria = async (req = request, res = response) => {
  try {
    const { idM, idU } = req.params;
    const materia = req.materia; // seteada en validarMateriaUsuario

    const infoMateria = {
      id: materia._id,
      nombre: materia.nombreMateria,
      profesor: materia.profesorMateria,
      horarios: materia.horariosMateria, // CAMBIO
    };

    await Materia.findByIdAndDelete(idM);
    await Usuario.findByIdAndUpdate(idU, { $pull: { materias: idM } });

    res.status(200).json({
      ok:true,
      msg: "Materia eliminada exitosamente",
      materiaEliminada: infoMateria,
      data: infoMateria,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al borrar materia",
      error: error.message,
    });
  }
};



const borrarMaterias = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const countMaterias = req.cantMat;

    const materiasAEliminar = await Materia.find({ usuario: idU })
      .populate("usuario", "nombre -_id");

    const resultado = await Materia.deleteMany({ usuario: idU });
    await Usuario.findByIdAndUpdate(idU, { materias: [] });

    res.status(200).json({
      ok:true,
      msg: "Todas las materias han sido eliminadas",
      resumen: {
        usuario: idU,
        totalMaterias: countMaterias,
        eliminadas: resultado.deletedCount,
        materias: materiasAEliminar.map(m => ({
          nombre: m.nombreMateria,
          profesor: m.profesorMateria,
          horarios: m.horariosMateria, // CAMBIO
          usuario: m.usuario.nombre,
        })),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al eliminar las materias",
      error: error.message,
    });
  }
};

module.exports = {
  crearMateria,
  obtenerMateria,
  obtenerMaterias,
  modificarMateria,
  borrarMateria,
  borrarMaterias,
};
