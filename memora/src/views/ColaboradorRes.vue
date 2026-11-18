<script setup>
import { ref, computed } from "vue";
import Sidebar from "../components/SideBar.vue";

// Datos que posteriormente vendrán de Firebase
const colaboradores = ref([]);
const resguardos = ref([]);

// Búsqueda y navegación
const busqueda = ref("");
const colaboradorSeleccionado = ref(null);

// Filtrar colaboradores por nombre
const colaboradoresFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase();

  return colaboradores.value.filter((colaborador) =>
    (colaborador.nombre || "").toLowerCase().includes(texto),
  );
});

// Resguardos pertenecientes al colaborador seleccionado
const resguardosColaborador = computed(() => {
  if (!colaboradorSeleccionado.value) return [];

  return resguardos.value.filter(
    (resguardo) => resguardo.personaId === colaboradorSeleccionado.value.id,
  );
});

// Cantidad de resguardos de cada colaborador
function contarResguardos(id) {
  return resguardos.value.filter((resguardo) => resguardo.personaId === id)
    .length;
}

function abrirCarpeta(colaborador) {
  colaboradorSeleccionado.value = colaborador;
}

function volverColaboradores() {
  colaboradorSeleccionado.value = null;
}

function formatearFecha(valor) {
  if (!valor) return "—";

  const fecha = valor?.toDate
    ? valor.toDate()
    : valor instanceof Date
      ? valor
      : new Date(
          typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)
            ? `${valor}T12:00:00`
            : valor,
        );

  if (Number.isNaN(fecha.getTime())) return "—";

  return fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function nombreTipo(tipo) {
  const nombres = {
    computadora: "Computadora",
    telefono: "Teléfono",
    cuenta: "Cuenta",
  };

  return nombres[tipo] || tipo || "—";
}

// Abrir el PDF del resguardo
function verPDF(resguardo) {
  if (!resguardo.pdfUrl) return;

  window.open(resguardo.pdfUrl, "_blank", "noopener,noreferrer");
}
</script>

<template>
  <div class="layout-colaboradores">
    <Sidebar />

    <main class="colaboradores">
      <!-- VISTA PRINCIPAL: CARPETAS -->
      <template v-if="!colaboradorSeleccionado">
        <header class="encabezado">
          <div>
            <h1>Colaboradores</h1>
            <p>Consulta los resguardos organizados por colaborador.</p>
          </div>
        </header>

        <section class="panel">
          <div class="barra-superior">
            <div class="buscador">
              <i class="bi bi-search"></i>

              <input
                v-model="busqueda"
                type="text"
                placeholder="Buscar colaborador por nombre..."
              />
            </div>
          </div>

          <div class="titulo-seccion">
            <div>
              <h2>Carpetas de colaboradores</h2>
              <p>Selecciona una carpeta para consultar sus documentos.</p>
            </div>

            <span class="contador">
              {{ colaboradoresFiltrados.length }}
              colaboradores
            </span>
          </div>

          <!-- Carpetas -->
          <div v-if="colaboradoresFiltrados.length > 0" class="grid-carpetas">
            <button
              v-for="colaborador in colaboradoresFiltrados"
              :key="colaborador.id"
              class="carpeta"
              type="button"
              @click="abrirCarpeta(colaborador)"
            >
              <div class="carpeta-icono">
                <i class="bi bi-folder-fill"></i>
              </div>

              <div class="carpeta-info">
                <h3>{{ colaborador.nombre }}</h3>

                <p>
                  {{
                    colaborador.tienda ||
                    colaborador.departamento ||
                    "Sin departamento"
                  }}
                </p>

                <span>
                  <i class="bi bi-files"></i>
                  {{ contarResguardos(colaborador.id) }}
                  resguardos
                </span>
              </div>

              <i class="bi bi-chevron-right flecha"></i>
            </button>
          </div>

          <!-- Sin colaboradores -->
          <div v-else class="estado-vacio">
            <i class="bi bi-folder2-open"></i>

            <h3>
              {{
                busqueda
                  ? "No se encontraron colaboradores"
                  : "No hay colaboradores registrados"
              }}
            </h3>

            <p>
              {{
                busqueda
                  ? "Intenta buscar con otro nombre."
                  : "Aquí aparecerán las carpetas de los colaboradores que tengan resguardos registrados."
              }}
            </p>
          </div>
        </section>
      </template>

      <!-- VISTA INTERIOR: RESGUARDOS DEL COLABORADOR -->
      <template v-else>
        <header class="encabezado encabezado-detalle">
          <div>
            <button
              class="btn-volver"
              type="button"
              @click="volverColaboradores"
            >
              <i class="bi bi-arrow-left"></i>
              Volver a colaboradores
            </button>

            <h1>Resguardos del colaborador</h1>

            <p>Consulta los documentos asignados a esta persona.</p>
          </div>
        </header>

        <section class="panel">
          <!-- Información del colaborador -->
          <div class="perfil-colaborador">
            <div class="perfil-icono">
              <i class="bi bi-folder2-open"></i>
            </div>

            <div class="perfil-info">
              <h2>{{ colaboradorSeleccionado.nombre }}</h2>

              <p>
                <i class="bi bi-building"></i>
                {{
                  colaboradorSeleccionado.tienda ||
                  colaboradorSeleccionado.departamento ||
                  "Sin departamento"
                }}
              </p>

              <span>
                <i class="bi bi-files"></i>
                {{ resguardosColaborador.length }}
                resguardos asignados
              </span>
            </div>
          </div>

          <div class="separador"></div>

          <!-- Documentos -->
          <div class="titulo-documentos">
            <div>
              <h2>Documentos del colaborador</h2>
              <p>Listado de resguardos asociados a esta persona.</p>
            </div>

            <span class="contador">
              {{ resguardosColaborador.length }} documentos
            </span>
          </div>

          <div class="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Tipo</th>
                  <th>Equipo / Cuenta</th>
                  <th>Fecha</th>
                  <th>Documento</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="resguardo in resguardosColaborador"
                  :key="resguardo.id"
                >
                  <td>{{ resguardo.folio || "—" }}</td>

                  <td>
                    <span class="etiqueta-tipo">
                      {{ nombreTipo(resguardo.tipo) }}
                    </span>
                  </td>

                  <td>
                    {{
                      resguardo.equipoNombre ||
                      resguardo.cuentaNombre ||
                      resguardo.equipo ||
                      "—"
                    }}
                  </td>

                  <td>{{ formatearFecha(resguardo.fecha) }}</td>

                  <td>
                    <button
                      v-if="resguardo.pdfUrl"
                      class="btn-pdf"
                      type="button"
                      @click="verPDF(resguardo)"
                    >
                      <i class="bi bi-file-earmark-pdf"></i>
                      Ver PDF
                    </button>

                    <span v-else class="sin-pdf"> Sin PDF </span>
                  </td>
                </tr>

                <tr v-if="resguardosColaborador.length === 0">
                  <td colspan="5">
                    <div class="estado-vacio estado-tabla">
                      <i class="bi bi-file-earmark-text"></i>

                      <h3>No hay resguardos asociados</h3>

                      <p>Los documentos de este colaborador aparecerán aquí.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.layout-colaboradores {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.colaboradores {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  padding: 35px;
  box-sizing: border-box;
  background-color: #f5f5f7;
}

/* Encabezado */
.encabezado {
  padding-left: 55px;
  margin-bottom: 30px;
}

.encabezado h1 {
  font-size: 30px;
  color: #252525;
  margin: 0 0 10px;
}

.encabezado p {
  color: #777;
  font-size: 14px;
  margin: 0;
}

/* Panel principal */
.panel {
  background-color: white;
  border: 1px solid #e8e8ec;
  border-radius: 12px;
  padding: 25px;
}

/* Buscador */
.barra-superior {
  display: flex;
  margin-bottom: 30px;
}

.buscador {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 480px;
  padding: 0 15px;
  border: 1px solid #d9d9df;
  border-radius: 8px;
  background: white;
}

.buscador i {
  font-size: 17px;
  color: #999;
}

.buscador input {
  width: 100%;
  padding: 14px 0;
  border: none;
  outline: none;
  background: transparent;
  color: #333;
  font-size: 14px;
}

.buscador:focus-within {
  border-color: #81223c;
}

/* Títulos */
.titulo-seccion,
.titulo-documentos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.titulo-seccion h2,
.titulo-documentos h2 {
  font-size: 19px;
  color: #252525;
  margin: 0 0 8px;
}

.titulo-seccion p,
.titulo-documentos p {
  font-size: 13px;
  color: #888;
  margin: 0;
}

.contador {
  color: #81223c;
  background: #f5e9ed;
  padding: 8px 13px;
  border-radius: 20px;
  font-size: 12px;
  white-space: nowrap;
}

/* Carpetas */
.grid-carpetas {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.carpeta {
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 0;
  padding: 20px;
  border: 1px solid #e8e8ec;
  border-radius: 12px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.carpeta:hover {
  border-color: #81223c;
  background-color: #fdf9fa;
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.carpeta-icono {
  flex-shrink: 0;
  font-size: 40px;
  color: #81223c;
}

.carpeta-info {
  flex: 1;
  min-width: 0;
}

.carpeta-info h3 {
  font-size: 14px;
  color: #252525;
  margin: 0 0 7px;
  overflow-wrap: anywhere;
}

.carpeta-info p {
  font-size: 12px;
  color: #888;
  margin: 0 0 10px;
}

.carpeta-info span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #81223c;
  font-size: 12px;
}

.flecha {
  color: #aaa;
  font-size: 14px;
}

/* Estados vacíos */
.estado-vacio {
  min-height: 270px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
}

.estado-vacio > i {
  font-size: 52px;
  color: #b8a4aa;
}

.estado-vacio h3 {
  font-size: 16px;
  color: #555;
  margin: 0;
}

.estado-vacio p {
  max-width: 400px;
  font-size: 13px;
  line-height: 1.6;
  color: #999;
  margin: 0;
}

/* Botón volver */
.btn-volver {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: #81223c;
  font-size: 14px;
  cursor: pointer;
}

.btn-volver:hover {
  text-decoration: underline;
}

/* Perfil */
.perfil-colaborador {
  display: flex;
  align-items: center;
  gap: 20px;
}

.perfil-icono {
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 12px;
  background-color: #f5e9ed;
  color: #81223c;
  font-size: 38px;
}

.perfil-info h2 {
  font-size: 22px;
  color: #252525;
  margin: 0 0 12px;
}

.perfil-info p,
.perfil-info span {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #777;
  font-size: 13px;
  margin: 0 0 9px;
}

.perfil-info span {
  color: #81223c;
  font-weight: 500;
}

.separador {
  height: 1px;
  background-color: #eee;
  margin: 30px 0;
}

/* Tabla */
.tabla-contenedor {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  padding: 15px;
  background: #f6f6f8;
  color: #555;
  font-size: 13px;
  white-space: nowrap;
}

td {
  padding: 17px 15px;
  border-bottom: 1px solid #eee;
  color: #555;
  font-size: 13px;
}

.etiqueta-tipo {
  display: inline-block;
  padding: 7px 12px;
  border-radius: 20px;
  background: #f5e9ed;
  color: #81223c;
  font-size: 12px;
}

.btn-pdf {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid #e2d4d9;
  border-radius: 7px;
  background: #fff;
  color: #81223c;
  cursor: pointer;
  white-space: nowrap;
}

.btn-pdf:hover {
  background: #f5e9ed;
}

.sin-pdf {
  color: #aaa;
  font-size: 12px;
}

.estado-tabla {
  min-height: 220px;
}

.estado-tabla > i {
  font-size: 42px;
}

/* Responsivo */
@media (max-width: 1150px) {
  .grid-carpetas {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .colaboradores {
    padding: 25px 18px;
  }

  .grid-carpetas {
    grid-template-columns: 1fr;
  }

  .titulo-seccion,
  .titulo-documentos {
    flex-direction: column;
    align-items: flex-start;
  }

  .perfil-colaborador {
    align-items: flex-start;
  }

  .perfil-icono {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }

  .perfil-info h2 {
    font-size: 18px;
  }

  .encabezado h1 {
    font-size: 25px;
  }
}
</style>
