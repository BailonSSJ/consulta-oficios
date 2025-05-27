import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "firebase/firestore";

const consultarBtn = document.getElementById("consultarBtn");
const folioInput = document.getElementById("folio");
const resultDiv = document.getElementById("result");

function limpiarTexto(texto) {
  return texto ? texto.replace(/\s+/g, ' ').trim() : "";
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
      resultDiv.style.backgroundColor = "#f0f0f0"; // Fondo gris
      resultDiv.style.color = "black"; // Texto negro por defecto
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

    // Color de texto según estatus
    let colorEstatus = "black";
    if (data.estatus === "Aceptado") colorEstatus = "green";
    else if (data.estatus === "Pendiente") colorEstatus = "orange"; // Amarillo/naranja para mejor legibilidad
    else if (data.estatus === "Rechazado") colorEstatus = "red";

    // Mostrar motivo de rechazo solo si es Rechazado
    let motivoRechazoHTML = "";
    if (data.estatus === "Rechazado") {
      motivoRechazoHTML = `<p><strong>Motivo de Rechazo:</strong> ${data.motivoRechazo || "No aplica"}</p>`;
    }

    resultDiv.innerHTML = `
      <p><strong>Folio:</strong> ${data.folio}</p>
      <p><strong>Fecha de Actualización:</strong> ${fechaActualizacion}</p>
      <p><strong>Estatus:</strong> <span style="color: ${colorEstatus}; font-weight: bold;">${data.estatus}</span></p>
      ${motivoRechazoHTML}
      <p><strong>Asunto:</strong> ${data.asunto}</p>
      <p><strong>Comentarios:</strong></p>
      <p class="comentarios-limpios">${limpiarTexto(data.comentarios)}</p>
    `;

    resultDiv.style.display = "block";
    resultDiv.style.backgroundColor = "#f0f0f0"; // Fondo gris claro

  } catch (error) {
    console.error("Error consultando la base de datos:", error);
    alert("Ocurrió un error al consultar, intenta más tarde.");
  }
});
