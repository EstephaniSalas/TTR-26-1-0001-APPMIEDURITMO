const { request, response } = require("express");
const Tarea = require("../models/tarea");
const Usuario = require("../models/usuario");


// :: POST - Crear tarea
const crearTarea = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const {
      nombreTarea,
      materiaTarea,
      descripcionTarea = "",
      tipoTarea = "Tarea",
      fechaEntregaTarea,
      horaEntregaTarea,
      estatusTarea = "Pendiente",
    } = req.body;

    const tarea = new Tarea({
      usuario: idU,
      nombreTarea,
      materiaTarea,
      descripcionTarea,
      tipoTarea,
      fechaEntregaTarea,
      horaEntregaTarea,
      estatusTarea,
    });

    const tareaGuardada = await tarea.save();

    await Usuario.findByIdAndUpdate(idU, {
      $push: { tareas: tareaGuardada._id },
    });

    res.status(201).json({
      msg: "Tarea creada correctamente",
      tarea: tareaGuardada,
    });
  } catch (error) {
    console.error("Error en crearTarea:", error);
    res.status(500).json({
      msg: "Error interno del servidor al crear la tarea",
      error: error.message,
    });
  }
};




// :: GET - Obtener una tarea
const obtenerTarea = async (req = request, res = response) => {
  try {
    const { tarea } = req; // viene del middleware validarTareaUsuario

    const tareaCompleta = await Tarea.findById(tarea._id)
      .populate("materiaTarea", "nombreMateria -_id");

    res.json({
      msg: "Tarea obtenida correctamente",
      tarea: tareaCompleta || tarea,
    });
  } catch (error) {
    console.error("Error en obtenerTarea:", error);
    res.status(500).json({
      msg: "Error interno del servidor al obtener la tarea",
      error: error.message,
    });
  }
};



// :: GET - Obtener todas las tareas de un usuario
const obtenerTareas = async (req = request, res = response) => {
  try {
    const { idU } = req.params;

    const tareas = await Tarea.find({ usuario: idU })
      .populate("materiaTarea", "nombreMateria -_id")
      .sort({ fechaEntregaTarea: 1, horaEntregaTarea: 1 });

    res.json({
      msg: "Tareas obtenidas correctamente",
      total: tareas.length,
      tareas,
    });
  } catch (error) {
    console.error("Error en obtenerTareas:", error);
    res.status(500).json({
      msg: "Error interno del servidor al obtener las tareas",
      error: error.message,
    });
  }
};



// :: PUT - Actualizar tarea
const actualizarTarea = async (req = request, res = response) => {
  try {
    const { tarea } = req; // tarea ya verificada
    const {
      nombreTarea,
      materiaTarea,
      descripcionTarea,
      tipoTarea,
      fechaEntregaTarea,
      horaEntregaTarea,
      estatusTarea,
    } = req.body;

    const cambios = {};

    if (nombreTarea !== undefined) cambios.nombreTarea = nombreTarea;
    if (materiaTarea !== undefined) cambios.materiaTarea = materiaTarea;
    if (descripcionTarea !== undefined) cambios.descripcionTarea = descripcionTarea;
    if (tipoTarea !== undefined) cambios.tipoTarea = tipoTarea;
    if (fechaEntregaTarea !== undefined) cambios.fechaEntregaTarea = fechaEntregaTarea;
    if (horaEntregaTarea !== undefined) cambios.horaEntregaTarea = horaEntregaTarea;
    if (estatusTarea !== undefined) cambios.estatusTarea = estatusTarea;

    const tareaActualizada = await Tarea.findByIdAndUpdate(
      tarea._id,
      cambios,
      { new: true }
    ).populate("materiaTarea", "nombreMateria -_id");

    res.json({
      msg: "Tarea actualizada correctamente",
      tarea: tareaActualizada,
    });
  } catch (error) {
    console.error("Error en actualizarTarea:", error);
    res.status(500).json({
      msg: "Error interno del servidor al actualizar la tarea",
      error: error.message,
    });
  }
};



// :: PATCH - Cambiar estatus de tarea
const cambiarStatusTarea = async (req = request, res = response) => {
  try {
    const { tarea } = req;
    const { estatusTarea } = req.body; // ya validado en ruta

    const tareaActualizada = await Tarea.findByIdAndUpdate(
      tarea._id,
      { estatusTarea },
      { new: true }
    ).populate("materiaTarea", "nombreMateria -_id");

    res.json({
      msg: "Estatus de la tarea actualizado correctamente",
      tarea: tareaActualizada,
    });
  } catch (error) {
    console.error("Error en cambiarStatusTarea:", error);
    res.status(500).json({
      msg: "Error interno del servidor al cambiar el estatus de la tarea",
      error: error.message,
    });
  }
};



// :: DELETE - Eliminar una tarea
const borrarTarea = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const { tarea } = req;

    await Tarea.findByIdAndDelete(tarea._id);

    await Usuario.findByIdAndUpdate(idU, {
      $pull: { tareas: tarea._id },
    });

    res.json({
      msg: "Tarea eliminada correctamente",
      tareaEliminada: tarea,
    });
  } catch (error) {
    console.error("Error en borrarTarea:", error);
    res.status(500).json({
      msg: "Error interno del servidor al eliminar la tarea",
      error: error.message,
    });
  }
};



// :: DELETE - Eliminar todas las tareas de un usuario
const borrarTareas = async (req = request, res = response) => {
  try {
    const { idU } = req.params;

    const tareasUsuario = await Tarea.find({ usuario: idU }).select("_id nombreTarea");

    if (tareasUsuario.length === 0) {
      return res.status(404).json({
        msg: "El usuario no tiene tareas para eliminar",
        totalTareas: 0,
      });
    }

    const resultado = await Tarea.deleteMany({ usuario: idU });

    await Usuario.findByIdAndUpdate(idU, { tareas: [] });

    res.json({
      msg: "Todas las tareas del usuario han sido eliminadas",
      totalEliminadas: resultado.deletedCount,
    });
  } catch (error) {
    console.error("Error en borrarTareas:", error);
    res.status(500).json({
      msg: "Error interno del servidor al eliminar todas las tareas",
      error: error.message,
    });
  }
};

// 🔔 NUEVO: GET - Obtener tareas FUTURAS (para sincronización de notificaciones)
const obtenerTareasFuturas = async (req = request, res = response) => {
  try {
    const { idU } = req.params;
    const ahora = new Date();

    const tareas = await Tarea.find({ 
      usuario: idU,
      fechaEntregaTarea: { $gte: ahora },
      estatusTarea: { $ne: "Completada" } // No incluir completadas
    })
    .populate("materiaTarea", "nombreMateria -_id")
    .sort({ fechaEntregaTarea: 1, horaEntregaTarea: 1 });

    // Filtrar tareas cuya hora también sea futura
    const tareasFuturas = tareas.filter(tarea => {
      const fechaHoraCompleta = new Date(`${tarea.fechaEntregaTarea.toISOString().split('T')[0]}T${tarea.horaEntregaTarea}:00`);
      return fechaHoraCompleta > ahora;
    });

    const tareasConFechaCompleta = tareasFuturas.map(tarea => {
      const fechaHoraCompleta = new Date(`${tarea.fechaEntregaTarea.toISOString().split('T')[0]}T${tarea.horaEntregaTarea}:00`);
      return {
        uid: tarea._id.toString(),
        nombreTarea: tarea.nombreTarea,
        descripcionTarea: tarea.descripcionTarea,
        tipoTarea: tarea.tipoTarea,
        fechaHoraCompleta: fechaHoraCompleta.toISOString(),
        materiaTarea: tarea.materiaTarea,
        tipo: tarea.tipoTarea.toLowerCase(), // 'tarea', 'proyecto', 'examen'
      };
    });

    res.json({
      msg: "Tareas futuras obtenidas correctamente",
      total: tareasConFechaCompleta.length,
      tareas: tareasConFechaCompleta,
    });
  } catch (error) {
    console.error("Error en obtenerTareasFuturas:", error);
    res.status(500).json({
      msg: "Error interno del servidor al obtener tareas futuras",
      error: error.message,
    });
  }
};


module.exports = {
  crearTarea,
  obtenerTarea,
  obtenerTareas,
  actualizarTarea,
  cambiarStatusTarea,
  borrarTarea,
  borrarTareas,
  obtenerTareasFuturas,
};
