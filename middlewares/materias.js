const { request, response } = require("express");
const Materia = require("../models/materia");

// Verificar que el usuario no tenga ya una materia con el mismo nombre
const validarMateriaPorUsuario = async (
  req = request,
  res = response,
  next
) => {
  try {
    const { nombreMateria } = req.body;
    // CAMBIO: soportar tanto /:id como /idUsuario/:idU
    const { id, idU } = req.params;
    const usuarioId = idU || id;

    if (!nombreMateria || !usuarioId) {
      return next();
    }

    const materiaDuplicada = await Materia.findOne({
      nombreMateria: nombreMateria.trim(),
      usuario: usuarioId,
    });

    if (materiaDuplicada) {
      return res.status(400).json({
        msg: `Ya tienes una materia registrada con el nombre: ${nombreMateria}`,
      });
    }
    next();
  } catch (error) {
    console.error("Error en middleware validarMateriaPorUsuario:", error);
    return res.status(500).json({
      msg: "Error interno del servidor al validar materia",
    });
  }
};

// Validar horariosMateria en formato 24h
const validarHorariosMateria = (req = request, res = response, next) => {
  const { horariosMateria } = req.body;

  // CAMBIO: si no viene en el body (por ejemplo en un PUT parcial), no validamos nada
  if (horariosMateria === undefined) {
    return next();
  }

  if (!Array.isArray(horariosMateria) || horariosMateria.length === 0) {
    return res.status(400).json({
      msg: "horariosMateria es obligatorio y debe ser un arreglo con al menos un elemento",
    });
  }

  const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const diasValidos = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  for (const [index, h] of horariosMateria.entries()) {
    const { dia, horaInicio, horaFin } = h || {};

    if (!dia || !diasValidos.includes(dia)) {
      return res.status(400).json({
        msg: `El día en horariosMateria[${index}] es inválido`,
      });
    }

    if (!horaInicio || !regexHora.test(horaInicio)) {
      return res.status(400).json({
        msg: `horaInicio inválida en horariosMateria[${index}]. Usa formato HH:MM`,
      });
    }

    if (!horaFin || !regexHora.test(horaFin)) {
      return res.status(400).json({
        msg: `horaFin inválida en horariosMateria[${index}]. Usa formato HH:MM`,
      });
    }

    const [hiH, hiM] = horaInicio.split(":").map(Number);
    const [hfH, hfM] = horaFin.split(":").map(Number);
    const inicioMin = hiH * 60 + hiM;
    const finMin = hfH * 60 + hfM;

    if (inicioMin >= finMin) {
      return res.status(400).json({
        msg: `En horariosMateria[${index}] la horaInicio debe ser menor que la horaFin`,
      });
    }
  }

  next();
};

// Evitar traslapes de horarios por usuario
const validarTraslapesHorariosMateria = async (
  req = request,
  res = response,
  next
) => {
  try {
    const { horariosMateria } = req.body;
    const { idU, id, idM } = req.params;
    const usuarioId = idU || id;

    // Si no viene horariosMateria
    if (!Array.isArray(horariosMateria) || horariosMateria.length === 0) {
      return next();
    }

    // --- 1) Validar traslapes internos dentro del mismo payload ---
    const porDia = {};

    horariosMateria.forEach((h, idx) => {
      if (!porDia[h.dia]) porDia[h.dia] = [];
      porDia[h.dia].push({
        ...h,
        _index: idx,
      });
    });

    const toMin = (hhmm) => {
      const [h, m] = hhmm.split(":").map(Number);
      return h * 60 + m;
    };

    for (const dia of Object.keys(porDia)) {
      const lista = porDia[dia]
        .map((h) => ({
          ...h,
          inicioMin: toMin(h.horaInicio),
          finMin: toMin(h.horaFin),
        }))
        .sort((a, b) => a.inicioMin - b.inicioMin);

      for (let i = 1; i < lista.length; i++) {
        const prev = lista[i - 1];
        const actual = lista[i];

        if (actual.inicioMin < prev.finMin) {
          return res.status(400).json({
            msg:
              `Traslape de horarios en '${dia}' dentro de la misma materia: ` +
              `bloque ${prev.horaInicio}-${prev.horaFin} y bloque ${actual.horaInicio}-${actual.horaFin}`,
          });
        }
      }
    }

    // --- 2) Validar traslapes contra materias ya registradas de ese usuario ---
    if (!usuarioId) {
      // si por alguna razón no hay usuario en params, mejor no reventar
      return next();
    }

    const query = { usuario: usuarioId };
    // En PUT, excluimos la propia materia actual
    if (idM) {
      query._id = { $ne: idM };
    }

    const materiasUsuario = await Materia.find(query);

    for (const nuevo of horariosMateria) {
      const diaNuevo = nuevo.dia;
      const iniNuevo = toMin(nuevo.horaInicio);
      const finNuevo = toMin(nuevo.horaFin);

      for (const mat of materiasUsuario) {
        for (const hExist of mat.horariosMateria || []) {
          if (hExist.dia !== diaNuevo) continue;

          const iniExist = toMin(hExist.horaInicio);
          const finExist = toMin(hExist.horaFin);

          // Condición de traslape: [iniNuevo, finNuevo) intersecta [iniExist, finExist)
          if (iniNuevo < finExist && finNuevo > iniExist) {
            return res.status(400).json({
              msg: `El horario ${diaNuevo} ${nuevo.horaInicio}-${nuevo.horaFin} se traslapa con la materia '${mat.nombreMateria}' (${diaNuevo} ${hExist.horaInicio}-${hExist.horaFin})`,
            });
          }
        }
      }
    }

    next();
  } catch (error) {
    console.error("Error en validarTraslapesHorariosMateria:", error);
    return res.status(500).json({
      msg: "Error interno al validar traslapes de horarios de materia",
    });
  }
};

const validarMateriaUsuario = async (req = request, res = response, next) => {
  const { idU, idM } = req.params;
  try {
    const materia = await Materia.findById(idM);
    if (!materia) {
      return res.status(404).json({
        msg: `La materia con id ${idM} no existe`,
      });
    }

    if (materia.usuario.toString() !== idU) {
      return res.status(403).json({
        msg: "No se tienen permisos para modificar Materia",
      });
    }

    req.materia = materia;
    next();
  } catch (error) {
    console.error("Error en validarMateriaUsuario:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
    });
  }
};

const validarEliminarMateria = (req = request, res = response, next) => {
  try {
    const { confirmacion } = req.body;
    if (confirmacion !== true) {
      return res.status(400).json({
        msg: "Se debe confirmar para eliminar la materia",
      });
    }
    next();
  } catch (error) {
    console.error("Error en validarEliminarMateria:", error);
    return res.status(500).json({
      msg: "Error interno del servidor al validar confirmación",
    });
  }
};

const validarMateriasUsuario = async (req = request, res = response, next) => {
  const { idU } = req.params;
  try {
    const cantidadMaterias = await Materia.countDocuments({ usuario: idU });

    if (cantidadMaterias <= 0) {
      return res.status(404).json({
        msg: "No se tienen materias para eliminar",
      });
    }

    req.cantMat = cantidadMaterias;
    next();
  } catch (error) {
    console.log("Error en validarMateriasUsuario:", error);
    return res.status(500).json({
      msg: "Error interno del servidor al verificar materias",
    });
  }
};

module.exports = {
  validarMateriaPorUsuario,
  validarHorariosMateria,
  validarTraslapesHorariosMateria,
  validarMateriaUsuario,
  validarEliminarMateria,
  validarMateriasUsuario,
};
