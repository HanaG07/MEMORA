<script setup>
import { ref, computed } from "vue";
import Sidebar from "../components/SideBar.vue";

// Filtros del reporte
const mesSeleccionado = ref("");
const anioSeleccionado = ref("");
const departamentoSeleccionado = ref("");
const tipoSeleccionado = ref("");

// Aquí se cargarán los registros reales de Firebase.
const resguardos = ref([]);

// Opciones obtenidas de los registros
const anios = computed(() => {
  const valores = resguardos.value
    .map((r) => obtenerFecha(r.fecha)?.getFullYear())
    .filter((anio) => anio != null);

  return [...new Set(valores)].sort((a, b) => b - a);
});

const departamentos = computed(() => {
  const valores = resguardos.value
    .map((r) => r.tienda || r.departamento)
    .filter(Boolean);

  return [...new Set(valores)].sort();
});

function obtenerFecha(valor) {
  if (!valor) return null;

  const fecha = valor?.toDate
    ? valor.toDate()
    : valor instanceof Date
      ? valor
      : new Date(
          typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)
            ? `${valor}T12:00:00`
            : valor,
        );

  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

// Aplicar filtros a los registros
const resguardosFiltrados = computed(() => {
  return resguardos.value.filter((r) => {
    const fecha = obtenerFecha(r.fecha);

    const coincideMes =
      !mesSeleccionado.value ||
      (fecha && fecha.getMonth() + 1 === Number(mesSeleccionado.value));

    const coincideAnio =
      !anioSeleccionado.value ||
      (fecha && fecha.getFullYear() === Number(anioSeleccionado.value));

    const area = r.tienda || r.departamento;

    const coincideDepartamento =
      !departamentoSeleccionado.value ||
      area === departamentoSeleccionado.value;

    const coincideTipo =
      !tipoSeleccionado.value || r.tipo === tipoSeleccionado.value;

    return coincideMes && coincideAnio && coincideDepartamento && coincideTipo;
  });
});

// Estadísticas del periodo
const totalResguardos = computed(() => resguardosFiltrados.value.length);

const totalComputadoras = computed(
  () =>
    resguardosFiltrados.value.filter((r) => r.tipo === "computadora").length,
);

const totalTelefonos = computed(
  () => resguardosFiltrados.value.filter((r) => r.tipo === "telefono").length,
);

const totalCuentas = computed(
  () => resguardosFiltrados.value.filter((r) => r.tipo === "cuenta").length,
);

// Conteos mensuales
const nombresMeses = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const datosMensuales = computed(() =>
  nombresMeses.map((nombre, indice) => ({
    nombre,
    cantidad: resguardosFiltrados.value.filter((r) => {
      const fecha = obtenerFecha(r.fecha);
      return fecha && fecha.getMonth() === indice;
    }).length,
  })),
);

const maximoMensual = computed(() =>
  Math.max(1, ...datosMensuales.value.map((m) => m.cantidad)),
);

// Distribución por departamento o tienda
const datosDepartamentos = computed(() => {
  const conteos = {};

  resguardosFiltrados.value.forEach((r) => {
    const area = r.tienda || r.departamento;

    if (area) {
      conteos[area] = (conteos[area] || 0) + 1;
    }
  });

  return Object.entries(conteos)
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: totalResguardos.value
        ? (cantidad / totalResguardos.value) * 100
        : 0,
    }))
    .sort((a, b) => b.cantidad - a.cantidad);
});

// Porcentaje de documentos clasificados
const porcentajeClasificados = computed(() => {
  if (!totalResguardos.value) return null;

  const clasificados = resguardosFiltrados.value.filter((r) =>
    Boolean(r.departamento || r.tienda),
  ).length;

  return (clasificados / totalResguardos.value) * 100;
});

function limpiarFiltros() {
  mesSeleccionado.value = "";
  anioSeleccionado.value = "";
  departamentoSeleccionado.value = "";
  tipoSeleccionado.value = "";
}
</script>

<template>
  <div class="layout-reportes">
    <Sidebar />

    <main class="reportes">
      <!-- Encabezado -->
      <div class="encabezado">
        <div>
          <h1>Reportes</h1>
          <p>Análisis y estadísticas de los resguardos registrados.</p>
        </div>

        <button
          class="btn-exportar"
          type="button"
          disabled
          title="Disponible cuando se implemente la exportación"
        >
          <i class="bi bi-download"></i>
          Exportar
        </button>
      </div>

      <!-- Filtros -->
      <section class="panel">
        <div class="panel-titulo">
          <i class="bi bi-sliders"></i>
          <h2>Filtros de reportes</h2>
        </div>

        <div class="filtros-grid">
          <div class="campo">
            <label>Mes</label>
            <select v-model="mesSeleccionado">
              <option value="">Todos los meses</option>
              <option
                v-for="(mes, index) in nombresMeses"
                :key="mes"
                :value="String(index + 1)"
              >
                {{ mes }}
              </option>
            </select>
          </div>

          <div class="campo">
            <label>Año</label>
            <select v-model="anioSeleccionado">
              <option value="">Todos los años</option>
              <option v-for="anio in anios" :key="anio" :value="String(anio)">
                {{ anio }}
              </option>
            </select>
          </div>

          <div class="campo">
            <label>Departamento / Tienda</label>
            <select v-model="departamentoSeleccionado">
              <option value="">Todos</option>
              <option v-for="area in departamentos" :key="area" :value="area">
                {{ area }}
              </option>
            </select>
          </div>

          <div class="campo">
            <label>Tipo de resguardo</label>
            <select v-model="tipoSeleccionado">
              <option value="">Todos los tipos</option>
              <option value="computadora">Computadoras</option>
              <option value="telefono">Teléfonos</option>
              <option value="cuenta">Cuentas</option>
            </select>
          </div>
        </div>

        <div class="acciones-filtros">
          <button class="btn-limpiar" type="button" @click="limpiarFiltros">
            <i class="bi bi-arrow-counterclockwise"></i>
            Limpiar filtros
          </button>
        </div>
      </section>

      <!-- Estadísticas -->
      <section class="estadisticas">
        <div class="tarjeta">
          <div class="tarjeta-superior">
            <span>Total del periodo</span>
            <i class="bi bi-files"></i>
          </div>
          <h2>{{ totalResguardos }}</h2>
          <p>Resguardos registrados</p>
        </div>

        <div class="tarjeta">
          <div class="tarjeta-superior">
            <span>Computadoras</span>
            <i class="bi bi-pc-display"></i>
          </div>
          <h2>{{ totalComputadoras }}</h2>
          <p>Resguardos de computadoras</p>
        </div>

        <div class="tarjeta">
          <div class="tarjeta-superior">
            <span>Teléfonos</span>
            <i class="bi bi-phone"></i>
          </div>
          <h2>{{ totalTelefonos }}</h2>
          <p>Resguardos de teléfonos</p>
        </div>

        <div class="tarjeta">
          <div class="tarjeta-superior">
            <span>Cuentas</span>
            <i class="bi bi-key"></i>
          </div>
          <h2>{{ totalCuentas }}</h2>
          <p>Resguardos de cuentas</p>
        </div>
      </section>

      <!-- Gráficas -->
      <section class="graficas-grid">
        <!-- Gráfica mensual -->
        <div class="panel">
          <h2>Resguardos registrados por mes</h2>
          <p class="descripcion">Distribución mensual de los documentos.</p>

          <div v-if="totalResguardos === 0" class="sin-datos">
            <i class="bi bi-bar-chart"></i>
            <p>No hay información para mostrar</p>
          </div>

          <div v-else class="grafica-barras">
            <div
              v-for="mes in datosMensuales"
              :key="mes.nombre"
              class="columna-mes"
            >
              <span class="valor-barra">
                {{ mes.cantidad || "" }}
              </span>

              <div class="barra-area">
                <div
                  class="barra"
                  :style="{
                    height: (mes.cantidad / maximoMensual) * 100 + '%',
                  }"
                ></div>
              </div>

              <span class="nombre-mes">{{ mes.nombre }}</span>
            </div>
          </div>
        </div>

        <!-- Distribución por tipo -->
        <div class="panel">
          <h2>Distribución por tipo de resguardo</h2>
          <p class="descripcion">Cantidad de documentos según su categoría.</p>

          <div v-if="totalResguardos === 0" class="sin-datos">
            <i class="bi bi-pie-chart"></i>
            <p>No hay información para mostrar</p>
          </div>

          <div v-else class="distribucion">
            <div
              class="grafica-circular"
              :style="{
                background: `conic-gradient(
                  #81223c 0%
                  ${(totalComputadoras / totalResguardos) * 100}%,
                  #b95c75
                  ${(totalComputadoras / totalResguardos) * 100}%
                  ${((totalComputadoras + totalTelefonos) / totalResguardos) * 100}%,
                  #d8a1b0
                  ${((totalComputadoras + totalTelefonos) / totalResguardos) * 100}%
                  100%
                )`,
              }"
            >
              <div class="centro-circular">
                <strong>{{ totalResguardos }}</strong>
                <span>Total</span>
              </div>
            </div>

            <div class="leyenda">
              <div>
                <span class="punto computadora"></span>
                Computadoras: {{ totalComputadoras }}
              </div>
              <div>
                <span class="punto telefono"></span>
                Teléfonos: {{ totalTelefonos }}
              </div>
              <div>
                <span class="punto cuenta"></span>
                Cuentas: {{ totalCuentas }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabla por departamento -->
      <section class="panel">
        <div class="panel-titulo">
          <i class="bi bi-building"></i>
          <h2>Resguardos por departamento / tienda</h2>
        </div>

        <p class="descripcion">
          Distribución de documentos según el área asignada.
        </p>

        <div class="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Departamento / Tienda</th>
                <th>Cantidad</th>
                <th>Porcentaje</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="area in datosDepartamentos" :key="area.nombre">
                <td>{{ area.nombre }}</td>
                <td>{{ area.cantidad }}</td>
                <td>{{ area.porcentaje.toFixed(1) }}%</td>
              </tr>

              <tr v-if="datosDepartamentos.length === 0">
                <td colspan="3" class="tabla-vacia">
                  No hay registros disponibles
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Métrica de clasificación -->
      <section class="panel">
        <div class="panel-titulo">
          <i class="bi bi-clipboard-check"></i>
          <h2>Clasificación de resguardos</h2>
        </div>

        <p class="descripcion">
          Porcentaje de documentos con departamento o tienda asignado.
        </p>

        <div class="clasificacion">
          <strong>
            {{
              porcentajeClasificados === null
                ? "—"
                : porcentajeClasificados.toFixed(1) + "%"
            }}
          </strong>

          <span>
            {{
              porcentajeClasificados === null
                ? "Sin datos para calcular"
                : "Documentos clasificados"
            }}
          </span>
        </div>

        <div class="barra-progreso">
          <div
            class="progreso"
            :style="{
              width: (porcentajeClasificados ?? 0) + '%',
            }"
          ></div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout-reportes {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.reportes {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  padding: 35px;
  background-color: #f5f5f7;
  box-sizing: border-box;
}

/* Encabezado */
.encabezado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
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

.btn-exportar {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 13px 20px;
  background-color: #81223c;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
}

.btn-exportar:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Paneles */
.panel {
  background-color: white;
  border: 1px solid #e8e8ec;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

.panel h2 {
  font-size: 18px;
  color: #252525;
  margin: 0;
}

.panel-titulo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.panel-titulo i {
  color: #81223c;
  font-size: 20px;
}

.descripcion {
  color: #888;
  font-size: 13px;
  margin: 10px 0 22px;
}

/* Filtros */
.filtros-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.campo label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.campo select {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9df;
  border-radius: 8px;
  background-color: white;
  color: #555;
  font-size: 13px;
}

.acciones-filtros {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-limpiar {
  padding: 11px 16px;
  background: #f5f5f7;
  color: #81223c;
  border: 1px solid #e2d8dc;
  border-radius: 8px;
  cursor: pointer;
}

.btn-limpiar:hover {
  background: #f0e8eb;
}

/* Tarjetas */
.estadisticas {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.tarjeta {
  background: white;
  border: 1px solid #e8e8ec;
  border-radius: 12px;
  padding: 22px;
}

.tarjeta-superior {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.tarjeta-superior span {
  font-size: 13px;
  color: #777;
}

.tarjeta-superior i {
  color: #81223c;
  font-size: 22px;
}

.tarjeta h2 {
  font-size: 30px;
  margin: 20px 0 8px;
  color: #252525;
}

.tarjeta p {
  color: #999;
  font-size: 12px;
  margin: 0;
}

/* Gráficas */
.graficas-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 25px;
}

.graficas-grid .panel {
  min-width: 0;
}

.sin-datos {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #aaa;
  text-align: center;
}

.sin-datos i {
  font-size: 40px;
}

.sin-datos p {
  font-size: 13px;
}

/* Gráfica de barras */
.grafica-barras {
  height: 230px;
  display: flex;
  justify-content: space-between;
  gap: 5px;
  align-items: flex-end;
}

.columna-mes {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.valor-barra {
  height: 20px;
  font-size: 11px;
  color: #555;
}

.barra-area {
  flex: 1;
  width: 70%;
  display: flex;
  align-items: flex-end;
}

.barra {
  width: 100%;
  background-color: #81223c;
  border-radius: 5px 5px 0 0;
  min-height: 0;
}

.nombre-mes {
  font-size: 10px;
  color: #888;
  margin-top: 10px;
}

/* Gráfica circular */
.distribucion {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
  min-height: 220px;
}

.grafica-circular {
  width: 160px;
  height: 160px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.centro-circular {
  width: 115px;
  height: 115px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.centro-circular strong {
  font-size: 28px;
  color: #252525;
}

.centro-circular span {
  font-size: 12px;
  color: #888;
}

.leyenda {
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #555;
  font-size: 13px;
}

.leyenda div {
  display: flex;
  align-items: center;
  gap: 9px;
}

.punto {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  flex-shrink: 0;
}

.computadora {
  background: #81223c;
}

.telefono {
  background: #b95c75;
}

.cuenta {
  background: #d8a1b0;
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
}

td {
  padding: 15px;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  color: #555;
}

.tabla-vacia {
  text-align: center;
  padding: 45px;
  color: #999;
}

/* Clasificación */
.clasificacion {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.clasificacion strong {
  font-size: 30px;
  color: #252525;
}

.clasificacion span {
  font-size: 13px;
  color: #888;
}

.barra-progreso {
  height: 10px;
  background: #eeeeef;
  border-radius: 20px;
  overflow: hidden;
}

.progreso {
  height: 100%;
  background: #81223c;
  border-radius: 20px;
  transition: width 0.3s ease;
}

/* Responsivo */
@media (max-width: 1200px) {
  .estadisticas {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .graficas-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .reportes {
    padding: 25px 18px;
  }

  .filtros-grid,
  .estadisticas {
    grid-template-columns: 1fr;
  }

  .encabezado {
    align-items: flex-start;
    flex-direction: column;
  }

  .distribucion {
    flex-direction: column;
  }
}
</style>
