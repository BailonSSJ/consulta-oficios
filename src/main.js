import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "firebase/firestore";

const consultarBtn = document.getElementById("consultarBtn");
const folioInput = document.getElementById("folio");
const resultDiv = document.getElementById("result");

function limpiarTexto(texto) {
  return texto ? texto.replace(/\s+/g, ' ').trim() : "Sin comentarios.";
}

consultarBtn.addEventListener("click", async () => {
  const folio = folioInput.value.trim();
  if (!/^\d+$/.test(folio)) {
    alert("Por favor, ingrese un folio válido (solo números).");
    return;
  }

  try {
    const ref = collection(db, "oficios");
    const q = query(ref, where("folio", "==", folio));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      resultDiv.innerHTML = `<p>No se encontró información para el folio <strong>${folio}</strong>.</p>`;
      resultDiv.style.display = "block";
      resultDiv.style.backgroundColor = "#f0f0f0";
      resultDiv.style.color = "black";
      return;
    }

    const data = snapshot.docs[0].data();
    const rawFecha = data.timestamp;

    let fechaActualizacion = "No disponible";
    if (rawFecha && typeof rawFecha.toDate === "function") {
      fechaActualizacion = rawFecha.toDate().toLocaleString("es-MX", {
        dateStyle: "long",
        timeStyle: "short",
      });
    }

  // Color según estatus
      let estatusMostrado = data.estatus;
      let colorEstatus = "black";

      if (estatusMostrado === "Aceptado") {
        estatusMostrado = "Autorizado";
        colorEstatus = "green";
      } else if (estatusMostrado === "Pendiente") {
        estatusMostrado = "En Proceso";
        colorEstatus = "orange";
      } else if (estatusMostrado === "Rechazado") {
        colorEstatus = "red";
      }


    // Motivo de rechazo si aplica
    let motivoRechazoHTML = "";
    if (data.estatus === "Rechazado") {
      motivoRechazoHTML = `<p><strong>Motivo de Rechazo:</strong> ${data.motivoRechazo || "No aplica"}</p>`;
    }

    resultDiv.innerHTML = `
      <p><strong>Folio:</strong> ${data.folio}</p>
      <p><strong>Fecha de Actualización:</strong> ${fechaActualizacion}</p>
      <p><strong>Estatus:</strong> <span style="color: ${colorEstatus}; font-weight: bold;">${estatusMostrado}</span></p>
      ${motivoRechazoHTML}
      <p><strong>Asunto:</strong> ${data.asunto || "No disponible"}</p>
      <p><strong>Comentarios:</strong></p>
      <p class="result-comentarios">${limpiarTexto(data.comentarios)}</p>
    `;

    resultDiv.style.display = "block";
    resultDiv.style.backgroundColor = "#f0f0f0";
    resultDiv.style.color = "black";

  } catch (error) {
    console.error("Error consultando la base de datos:", error);
    alert("Ocurrió un error al consultar. Intenta más tarde.");
  }
});
