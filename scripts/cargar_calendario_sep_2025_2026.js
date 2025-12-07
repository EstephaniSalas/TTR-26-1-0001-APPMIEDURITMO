// scripts/cargar_calendario_sep_2025_2026.js

// COMANDO PARA CARGAR EN BD:
//   node scripts/cargar_calendario_sep_2025_2026.js

require("dotenv").config();
const mongoose = require("mongoose");
const CalendarioSep = require("../models/calendarioSep");
const { ciclo, diasInhabiles } = require("../data/calendario_sep_2025_2026");

const MONGO_CNN = process.env.MONGODB_CNN;

// Convierte "YYYY-MM-DD" en Date en UTC sin contaminación de zona horaria
function parseISODateOnly(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  // Date.UTC => siempre en UTC, sin depender de la zona horaria del servidor
  return new Date(Date.UTC(year, month - 1, day));
}

// Expande rangos fecha_inicio / fecha_fin a un array de eventos día a día
function expandirDiasInhabiles({ ciclo, diasInhabiles }) {
  const eventos = [];

  for (const item of diasInhabiles) {
    const esHabil = item.esHabil ?? false;

    // Caso 1: Rango de vacaciones u otro rango
    if (item.fecha_inicio && item.fecha_fin) {
      let d = parseISODateOnly(item.fecha_inicio);
      const fin = parseISODateOnly(item.fecha_fin);

      while (d <= fin) {
        eventos.push({
          ciclo,
          fecha: d, // ya viene en UTC "normalizada"
          tipo: item.tipo,
          descripcion: item.descripcion,
          esHabil,
        });

        // avanzar 1 día (24h en milisegundos)
        d = new Date(d.getTime() + 24 * 60 * 60 * 1000);
      }
    }
    // Caso 2: Día suelto (festivo, suspensión, etc.)
    else if (item.fecha) {
      const fecha = parseISODateOnly(item.fecha);
      eventos.push({
        ciclo,
        fecha, // UTC
        tipo: item.tipo,
        descripcion: item.descripcion,
        esHabil,
      });
    }
  }

  return eventos;
}

async function main() {
  try {
    await mongoose.connect(MONGO_CNN);
    console.log("Conectado a MongoDB");

    const eventos = expandirDiasInhabiles({ ciclo, diasInhabiles });
    console.log(`Eventos a cargar para ciclo ${ciclo}:`, eventos.length);

    for (const evento of eventos) {
      await CalendarioSep.updateOne(
        { ciclo: evento.ciclo, fecha: evento.fecha },
        { $set: evento },
        { upsert: true }
      );
    }

    console.log(
      `Calendario SEP ${ciclo} cargado/actualizado: ${eventos.length} registros`
    );
  } catch (error) {
    console.error("Error cargando calendario SEP:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
    process.exit(0);
  }
}

main();
