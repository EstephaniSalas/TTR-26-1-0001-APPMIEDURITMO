const { response, request } = require("express");

const Materia = require("../models/materia");

// ::: POST - Crear materia :::
const crearMateria = async (req = request, res = response) => {
  try {
    const {
      nombreMateria,
      profesorMateria,
      edificioMateria,
      salonMateria,
      diasMateria,
      horaInicioMateria,
      horaFinMateria,
    } = req.body;
    const { id } = req.params;

    const materia = new Materia({
      usuario: id,
      nombreMateria,
      profesorMateria,
      edificioMateria,
      salonMateria,
      diasMateria,
      horaInicioMateria,
      horaFinMateria,
    });
    await materia.save();
    const materiaCreada = await Materia.findById(materia._id).populate(
      "usuario",
      "nombre -_id"
    );

    res.status(201).json({
      msg: "Materia creada correctamente",
      materiaCreada,
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
    const materia = await Materia.findById(id).populate(
      "usuario",
      "nombre -_id"
    );
    res.status(200).json({
      materia,
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
  const { id } = req.params;
  const { limite = 10, desde = 0 } = req.query; // Parámetros opcionales

  try {
    const [total, materias] = await Promise.all([
      Materia.countDocuments({ usuario: id }),
      Materia.find({ usuario: id })
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("usuario", "nombre"),
    ]);

    res.status(200).json({
      total,
      materias,
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
      diasMateria,
      horaInicioMateria,
      horaFinMateria,
    } = req.body;

    const datosActualizados = {
      nombreMateria,
      profesorMateria,
      edificioMateria,
      salonMateria,
      diasMateria,
      horaInicioMateria,
      horaFinMateria
    };

    const materiaActualizada = await Materia.findByIdAndUpdate(
      idM,
      datosActualizados,
      {new: true}
    ).populate("usuario", "nombre -_id");
    res.status(202).json({
      msg: "Materia modificada exitosamente",
      materiaActualizada
    })
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
    const { idM } = req.params;
    const materia = req.materia;
    const infoMateria = {
      id: materia._id,
      nombre: materia.nombreMateria,
      profesor: materia.profesorMateria,
      dias: materia.diasMateria,
      horario: `${materia.horaInicioMateria} - ${materia.horaFinMateria}`
    };

    await Materia.findByIdAndDelete(idM);

    res.json({
      msg: "Materia eliminada exitosamente",
      materiaEliminada: infoMateria 
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
      .populate('usuario', 'nombre -_id');

    const resultado = await Materia.deleteMany({ usuario: idU });

    res.status(200).json({
      msg: "Todas las materias han sido eliminadas",
      resumen: {
        usuario: idU,
        totalMaterias: countMaterias,
        eliminadas: resultado.deletedCount,
        materias: materiasAEliminar.map(m => ({
          nombre: m.nombreMateria,
          profesor: m.profesorMateria,
          horario: `${m.diasMateria.join(', ')} de ${m.horaInicioMateria} a ${m.horaFinMateria}`,
          usuario: m.usuario.nombre
        }))
      }
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
  borrarMaterias
};
