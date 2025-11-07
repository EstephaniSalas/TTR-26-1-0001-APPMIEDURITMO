const { response, request } = require("express");
const Tarea = require("../models/tarea");
const Usuario = require("../models/usuario");
const Materia = require("../models/materia");

// :: POST - Crear tarea
const crearTarea = async (req = request, res = response) => {
  try {
    const {
      nombreTarea,
      materiaTarea,
      descripcionMateria,
      tipoTarea,
      fechaEntregaTarea,
      horaEntregaTarea,
      prioridadTarea = false, // Valor por defecto
      estatusTarea = 'Pendiente'
    } = req.body;

    const { id } = req.params; // ID del usuario

    // VALIDAR: Si se envía materiaTarea, verificar que existe
    if (materiaTarea) {
      const materiaExiste = await Materia.findById(materiaTarea);
      if (!materiaExiste) {
        return res.status(400).json({
          msg: `La materia con ID ${materiaTarea} no existe`
        });
      }
      
      // Verificar que la materia pertenece al usuario
      if (materiaExiste.usuario.toString() !== id) {
        return res.status(400).json({
          msg: "La materia no pertenece a este usuario"
        });
      }
    }

    // Crear la tarea
    const tarea = new Tarea({
      usuario: id,
      nombreTarea,
      materiaTarea: materiaTarea || null,
      descripcionMateria: descripcionMateria || "",
      tipoTarea: tipoTarea || "Tarea", // Valor por defecto (Tarea, Proyecto o Examen)
      fechaEntregaTarea,
      horaEntregaTarea,
      prioridadTarea,
      estatusTarea,
    });

    await tarea.save();
    // Agregar tarea a schema Usuario
    await Usuario.findByIdAndUpdate(id, {
      $push: { tareas: tarea._id },
    });
    const tareaCreada = await Tarea.findById(tarea._id)
      .populate("usuario", "nombre -_id")
      .populate("materiaTarea", "nombreMateria -_id"); //Populate de materia si existe

    res.status(201).json({
      msg: "Tarea creada correctamente",
      tareaCreada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno del servidor al crear tarea",
      error: error.message,
    });
  }
};


// :: GET - Obtner tarea por id y idUsuario, idMateria
const obtenerTarea = async (req = request, res = response) => {
  try {
    const { idT } = req.params; // ID de la tarea desde URL

    // Obtener tarea con populate completo
    const tareaCompleta = await Tarea.findById(idT)
      .populate("usuario", "nombre -_id");

    if (!tareaCompleta) {
      return res.status(404).json({
        msg: `No se encontró la tarea con id ${idT}`
      });
    }

    res.status(200).json({
      msg: "Tarea obtenida exitosamente",
      tarea: tareaCompleta
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al obtener la tarea",
      error: error.message,
    });
  }
};


// :: GET - Obtener tareas por usuario
const obtenerTareas = async(req = request, res = response) => {
  const { id } = req.params;
    const { limite = 10, desde = 0 } = req.query; // Parámetros opcionales
  
    try {
      const [total, tareas] = await Promise.all([
        Tarea.countDocuments({ usuario: id }),
        Tarea.find({ usuario: id })
          .skip(Number(desde))
          .limit(Number(limite))
          .populate("usuario", "nombre"),
      ]);
  
      res.status(200).json({
        total,
        tareas,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Error al obtener las tareas del usuario",
        error: error.message,
      });
    }
};


// :: PUT - Actualizar tarea del usuario
const actualizarTarea = async(req = request, res = response) => {
  try {
      const { idT } = req.params;
      const {
        nombreTarea,
        materiaTarea,
        tipoTarea,
        fechaEntregaTarea,
        horaEntregaTarea,
        prioridadTarea,
      } = req.body;
  
      const datosActualizados = {
        nombreTarea,
        materiaTarea,
        tipoTarea,
        fechaEntregaTarea,
        horaEntregaTarea,
        prioridadTarea,
      };
  
      const tareaActualizada = await Tarea.findByIdAndUpdate(
        idT,
        datosActualizados,
        {new: true}
      ).populate("usuario", "nombre -_id");
      res.status(202).json({
        msg: "Tarea modificada exitosamente",
        tareaActualizada
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Error interno al modificar Tarea",
        error: error.message,
      });
    }
};


// :: PATCH - Modificar estatus de tarea 
const cambiarStatusTarea = async (req = request, res = response) => {
  try {
    const { idT } = req.params; // ID de la tarea desde URL
    const { estatusTarea } = req.body; // Solo estatus desde body
    const { tarea } = req; // Viene del middleware

    // Actualizar la tarea
    const tareaActualizada = await Tarea.findByIdAndUpdate(
      idT,
      { estatusTarea },
      { new: true, runValidators: true }
    )
    .populate("usuario", "nombre -_id")
    .populate("materiaTarea", "nombreMateria -_id");

    res.json({
      msg: `Estatus actualizado exitosamente`,
      detalle: `Tarea "${tareaActualizada.nombreTarea}" marcada como ${estatusTarea}`,
      datos: {
        estatusAnterior: tarea.estatusTarea,
        estatusNuevo: estatusTarea,
        materia: tareaActualizada.materiaTarea?.nombreMateria || 'Sin materia'
      },
      tarea: tareaActualizada
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al cambiar estatus de la tarea",
      error: error.message,
    });
  }
};

// :: DELETE - Borrar una materia de un usuario  
const borrarTarea = async(req = request, res = response) => {
  try {
      const { idT } = req.params;
      const tarea = req.tarea;
      const infoTarea = {
        id: tarea._id,
        nombre: tarea.nombreTarea,
      };
  
      await Tarea.findByIdAndDelete(idT);
  
      res.json({
        msg: "Tarea eliminada exitosamente",
        tareaEliminada: infoTarea 
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Error interno al borrar tarea",
        error: error.message,
      });
    }
};

// :: DELETE - Borrar todas las tareas del usuario 
const borrarTareas = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const countTareas = req.cantMat; 

    const tareasAEliminar = await Tarea.find({ usuario: idU })
      .populate('usuario', 'nombre -_id');

    const resultado = await Tarea.deleteMany({ usuario: idU });

    res.status(200).json({
      msg: "Todas las tareas han sido eliminadas",
      resumen: {
        usuario: idU,
        totalTareas: countTareas,
        eliminadas: resultado.deletedCount,
        tareas: tareasAEliminar.map(m => ({
          nombre: m.nombreTarea
        }))
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno al eliminar las tareas",
      error: error.message,
    });
  }
};


module.exports = {
  crearTarea,
  obtenerTarea,
  obtenerTareas,
  actualizarTarea,
  borrarTarea,
  cambiarStatusTarea,
  borrarTareas,
};
