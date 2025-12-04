const { request, response } = require("express");
const Tarea = require("../models/tarea");

/* ===========================
   Helper interno
   =========================== */
function normalizarFecha(fechaEntregaTarea) {
  // Si ya es Date (por .toDate()), la pasamos a YYYY-MM-DD
  if (fechaEntregaTarea instanceof Date) {
    const year = fechaEntregaTarea.getFullYear();
    const month = String(fechaEntregaTarea.getMonth() + 1).padStart(2, "0");
    const day = String(fechaEntregaTarea.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  // Si viene como string "YYYY-MM-DD", lo regresamos tal cual
  return fechaEntregaTarea;
}


/* ===========================
   Middlewares
   =========================== */

// Verifica que la tarea pertenezca al usuario
const validarTareaUsuario = async (req = request, res = response, next) => {
  const { idU, idT } = req.params;

  try {
    const tarea = await Tarea.findOne({ _id: idT, usuario: idU });

    if (!tarea) {
      return res.status(404).json({
        msg: `La tarea con id ${idT} no existe o no pertenece al usuario`,
      });
    }

    req.tarea = tarea;
    next();
  } catch (error) {
    console.error("Error en validarTareaUsuario:", error);
    res.status(500).json({
      msg: "Error interno del servidor - validarTareaUsuario",
      error: error.message,
    });
  }
};


// Confirmación para borrar (una o todas)
const validarEliminarTarea = (req = request, res = response, next) => {
  try {
    const { confirmacion } = req.body;

    if (confirmacion !== true) {
      return res.status(400).json({
        msg: "Debe confirmar con 'confirmacion: true' para eliminar la(s) tarea(s)",
      });
    }

    next();
  } catch (error) {
    console.error("Error en validarEliminarTarea:", error);
    res.status(500).json({
      msg: "Error interno del servidor al validar confirmación",
    });
  }
};


// Validar horaEntregaTarea en formato 24h obligatorio (para crear)
const validarHoraEntrega24 = (req = request, res = response, next) => {
  let { horaEntregaTarea } = req.body;

  if (!horaEntregaTarea) {
    return res.status(400).json({
      msg: "La hora de entrega es obligatoria",
    });
  }

  horaEntregaTarea = horaEntregaTarea.toLowerCase().replace(/\s+/g, "");

  if (horaEntregaTarea.includes("am") || horaEntregaTarea.includes("pm")) {
    return res.status(400).json({
      msg: "La hora de entrega debe estar en formato 24h (no AM/PM), ejemplo: 14:30",
    });
  }

  const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!regexHora.test(horaEntregaTarea)) {
    return res.status(400).json({
      msg: `La horaEntregaTarea '${horaEntregaTarea}' no tiene un formato válido HH:MM`,
    });
  }

  req.body.horaEntregaTarea = horaEntregaTarea;
  next();
};


// Versión opcional para PUT: solo valida si viene
const validarHoraEntrega24Opcional = (req = request, res = response, next) => {
  let { horaEntregaTarea } = req.body;

  if (horaEntregaTarea === undefined) {
    return next(); // no se está actualizando la hora
  }

  horaEntregaTarea = horaEntregaTarea.toLowerCase().replace(/\s+/g, "");

  if (horaEntregaTarea.includes("am") || horaEntregaTarea.includes("pm")) {
    return res.status(400).json({
      msg: "La hora de entrega debe estar en formato 24h (no AM/PM), ejemplo: 14:30",
    });
  }

  const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!regexHora.test(horaEntregaTarea)) {
    return res.status(400).json({
      msg: `La horaEntregaTarea '${horaEntregaTarea}' no tiene un formato válido HH:MM`,
    });
  }

  req.body.horaEntregaTarea = horaEntregaTarea;
  next();
};


// Forzar que en el PUT venga al menos un campo para actualizar
const validarCamposTareaUpdate = (req = request, res = response, next) => {
  const {
    nombreTarea,
    materiaTarea,
    descripcionTarea,
    tipoTarea,
    fechaEntregaTarea,
    horaEntregaTarea,
    estatusTarea,
  } = req.body;

  const todosUndefined = [
    nombreTarea,
    materiaTarea,
    descripcionTarea,
    tipoTarea,
    fechaEntregaTarea,
    horaEntregaTarea,
    estatusTarea,
  ].every((v) => v === undefined);

  if (todosUndefined) {
    return res.status(400).json({
      msg: "Debes enviar al menos un campo para actualizar la tarea",
    });
  }

  next();
};


/* ============================================================
   VALIDAR FECHA + HORA (POST) — usando normalizarFecha
   ============================================================ */
const validarFechaHoraTarea = (req = request, res = response, next) => {
  try {
    let { fechaEntregaTarea, horaEntregaTarea } = req.body;

    if (!fechaEntregaTarea || !horaEntregaTarea) {
      return res.status(400).json({
        msg: "La fecha y hora de entrega son obligatorias"
      });
    }

    const fechaNormal = normalizarFecha(fechaEntregaTarea);

    const [hh, mm] = horaEntregaTarea.split(":").map(Number);

    if (
      isNaN(hh) || isNaN(mm) ||
      hh < 0 || hh > 23 ||
      mm < 0 || mm > 59
    ) {
      return res.status(400).json({
        msg: "La hora de entrega debe tener formato válido HH:MM"
      });
    }

    const fecha = new Date(`${fechaNormal}T${horaEntregaTarea}:00`);

    if (isNaN(fecha.getTime())) {
      return res.status(400).json({
        msg: "Fecha de entrega inválida"
      });
    }

    const ahora = new Date();

    if (fecha <= ahora) {
      return res.status(400).json({
        msg: "No puedes registrar tareas con fecha u hora pasada"
      });
    }

    next();
  } catch (error) {
    console.error("Error en validarFechaHoraTarea:", error);
    return res.status(500).json({
      msg: "Error interno al validar fecha/hora de la tarea"
    });
  }
};


/* ============================================================
   VALIDAR FECHA + HORA (PUT) — opcional
   ============================================================ */
const validarFechaHoraTareaOpcional = (req = request, res = response, next) => {
  try {
    let { fechaEntregaTarea, horaEntregaTarea } = req.body;

    // Si no vienen, no validamos nada
    if (!fechaEntregaTarea && !horaEntregaTarea) {
      return next();
    }

    // Si viene uno pero no el otro → error
    if (fechaEntregaTarea && !horaEntregaTarea) {
      return res.status(400).json({
        msg: "Si actualizas la fecha de entrega, debes enviar también la horaEntregaTarea",
      });
    }

    if (!fechaEntregaTarea && horaEntregaTarea) {
      return res.status(400).json({
        msg: "Si actualizas la hora de entrega, debes enviar también la fechaEntregaTarea",
      });
    }

    const fechaNormal = normalizarFecha(fechaEntregaTarea);

    const [hh, mm] = horaEntregaTarea.split(":").map(Number);
    if (
      isNaN(hh) || isNaN(mm) ||
      hh < 0 || hh > 23 ||
      mm < 0 || mm > 59
    ) {
      return res.status(400).json({
        msg: "La hora de entrega debe tener formato válido HH:MM"
      });
    }

    const fecha = new Date(`${fechaNormal}T${horaEntregaTarea}:00`);

    if (isNaN(fecha.getTime())) {
      return res.status(400).json({
        msg: "Fecha de entrega inválida"
      });
    }

    const ahora = new Date();

    if (fecha <= ahora) {
      return res.status(400).json({
        msg: "No puedes actualizar la tarea a una fecha u hora pasada respecto a la actual"
      });
    }

    next();
  } catch (error) {
    console.error("Error en validarFechaHoraTareaOpcional:", error);
    return res.status(500).json({
      msg: "Error interno al validar fecha/hora de tarea (opcional)"
    });
  }
};


module.exports = {
  validarTareaUsuario,
  validarEliminarTarea,
  validarHoraEntrega24,
  validarHoraEntrega24Opcional,
  validarCamposTareaUpdate,
  validarFechaHoraTarea,
  validarFechaHoraTareaOpcional,
};
