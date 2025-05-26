import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "firebase/firestore";

const consultarBtn = document.getElementById("consultarBtn");
const folioInput = document.getElementById("folio");
const resultDiv = document.getElementById("result");

consultarBtn.addEventListener("click", async () => {
  const folio = folioInput.value.trim();
  if (!/^\d+$/.test(folio)) {
    alert("Por favor, ingrese un folio válido (solo números).");
    return;
  }

  const ref = collection(db, "oficios");
  const q = query(ref, where("folio", "==", folio));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    resultDiv.innerHTML = `<p>No se encontró información para el folio <strong>${folio}</strong>.</p>`;
    resultDiv.style.display = "block";
    return;
  }

  const data = snapshot.docs[0].data();
  console.log("Datos recibidos:", data);

  // Corrección: usar el campo correcto
  const rawFecha = data.timestamp;
  console.log("Fecha bruta:", rawFecha);

  let fechaActualizacion = "No disponible";
  if (rawFecha && typeof rawFecha.toDate === "function") {
    fechaActualizacion = rawFecha.toDate().toLocaleString("es-MX", {
      dateStyle: "long",
      timeStyle: "short",
    });
  }

  resultDiv.innerHTML = `
    <p><strong>Folio:</strong> ${data.folio}</p>
    <p><strong>Fecha de Actualización:</strong> ${fechaActualizacion}</p>
    <p><strong>Estatus:</strong> ${data.estatus}</p>
    <p><strong>Motivo de Rechazo:</strong> ${data.motivoRechazo || "No aplica"}</p>
    <p><strong>Asunto:</strong> ${data.asunto}</p>
    <p><strong>Comentarios:</strong></p>
    <div style="white-space: pre-wrap; max-width: 100%; word-wrap: break-word; text-align: left;">
      ${data.comentarios}
    </div>
  `;
  resultDiv.style.display = "block";
});
