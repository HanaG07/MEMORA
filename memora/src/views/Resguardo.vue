<script setup>
import { ref, onMounted, computed } from "vue";
import Sidebar from "../components/SideBar.vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Config";

const busqueda = ref("");
const tipoSeleccionado = ref("");
const departamentoSeleccionado = ref("");
const fechaSeleccionada = ref("");

const resguardos = ref([]);

// Obtener resguardos de Firebase
async function obtenerResguardos() {
  try {
    const datos = await getDocs(collection(db, "Resguardos"));

    resguardos.value = datos.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Resguardos obtenidos:", [...resguardos.value]);
  } catch (error) {
    console.error("Error al obtener los resguardos:", error);
  }
}

// Filtrar resguardos
const resguardosFiltrados = computed(() => {
  return resguardos.value.filter((resguardo) => {
    const texto = busqueda.value.trim().toLowerCase();

    const coincideBusqueda =
      (resguardo.personaNombre || "").toLowerCase().includes(texto) ||
      (resguardo.equipo || "").toLowerCase().includes(texto) ||
      (resguardo.folio || "").toLowerCase().includes(texto);

    const coincideTipo =
      !tipoSeleccionado.value || resguardo.tipo === tipoSeleccionado.value;

    const coincideDepartamento =
      !departamentoSeleccionado.value ||
      resguardo.departamento === departamentoSeleccionado.value;

    const coincideFecha =
      !fechaSeleccionada.value || resguardo.fecha === fechaSeleccionada.value;

    return (
      coincideBusqueda && coincideTipo && coincideDepartamento && coincideFecha
    );
  });
});

// Obtener departamentos para el filtro
const departamentos = computed(() => {
  return [
    ...new Set(
      resguardos.value
        .map((resguardo) => resguardo.departamento)
        .filter(Boolean),
    ),
  ];
});

onMounted(() => {
  obtenerResguardos();
});
</script>

<template>
  <div class="layout-resguardos">
    <Sidebar />

    <main class="resguardos">
      <!-- Encabezado -->
      <div class="encabezado">
        <div>
          <h1>Resguardos</h1>
          <p>Consulta y administra los documentos registrados en el sistema.</p>
        </div>

        <button class="btn-nuevo" type="button">
          <i class="bi bi-plus-lg"></i>
          Nuevo resguardo
        </button>
      </div>

      <!-- Buscador y filtros -->
      <section class="panel-filtros">
        <div class="buscador">
          <i class="bi bi-search"></i>

          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por colaborador, equipo o folio..."
          />
        </div>

        <div class="filtros">
          <select v-model="tipoSeleccionado">
            <option value="">Todos los tipos</option>
            <option value="computadora">Computadoras</option>
            <option value="telefono">Teléfonos</option>
            <option value="cuenta">Cuentas</option>
          </select>

          <select v-model="departamentoSeleccionado">
            <option value="">Todos los departamentos</option>
            <option
              v-for="departamento in departamentos"
              :key="departamento"
              :value="departamento"
            >
              {{ departamento }}
            </option>
          </select>

          <input v-model="fechaSeleccionada" type="date" />
        </div>
      </section>

      <!-- Tabla de resguardos -->
      <section class="panel-tabla">
        <div class="tabla-encabezado">
          <div>
            <h2>Todos los resguardos</h2>
            <p>Listado de documentos registrados</p>
          </div>

          <span class="contador"> {{ resguardosFiltrados.length }} </span>
        </div>

        <div class="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Folio</th>
                <th>Colaborador</th>
                <th>Departamento / Tienda</th>
                <th>Equipo / Cuenta</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="resguardo in resguardosFiltrados" :key="resguardo.id">
                <td>{{ resguardo.folio || "—" }}</td>
                <td>{{ resguardo.personaNombre || "—" }}</td>
                <td>{{ resguardo.tienda || resguardo.departamento || "—" }}</td>
                <td>{{ resguardo.equipo || "—" }}</td>
                <td>{{ resguardo.tipo || "—" }}</td>
                <td>{{ resguardo.fecha || "—" }}</td>

                <td>
                  <a
                    v-if="resguardo.pdfUrl"
                    :href="resguardo.pdfUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-ver"
                  >
                    <i class="bi bi-file-earmark-pdf"></i>
                    Ver PDF
                  </a>

                  <span v-else>Sin PDF</span>
                </td>
              </tr>

              <tr v-if="resguardosFiltrados.length === 0">
                <td colspan="7" class="sin-registros">
                  <i class="bi bi-folder2-open"></i>
                  <p>No hay resguardos registrados</p>
                  <span> No se encontraron documentos para mostrar. </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout-resguardos {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.resguardos {
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
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-left: 55px;
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

.btn-nuevo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 20px;
  background-color: #81223c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-nuevo:hover {
  background-color: #691a30;
}

/* Buscador y filtros */

.panel-filtros {
  background: white;
  border: 1px solid #e8e8ec;
  border-radius: 12px;
  padding: 25px;
  margin-top: 30px;
}

.buscador {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #d9d9df;
  border-radius: 8px;
  padding: 0 15px;
}

.buscador i {
  color: #999;
}

.buscador input {
  width: 100%;
  padding: 14px 0;
  border: none;
  outline: none;
  font-size: 14px;
}

.filtros {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  margin-top: 18px;
}

.filtros select,
.filtros input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9df;
  border-radius: 8px;
  background-color: white;
  color: #555;
  font-size: 13px;
  box-sizing: border-box;
}

/* Tabla */

.panel-tabla {
  background: white;
  border: 1px solid #e8e8ec;
  border-radius: 12px;
  padding: 25px;
  margin-top: 30px;
}

.tabla-encabezado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.tabla-encabezado h2 {
  font-size: 20px;
  color: #252525;
  margin: 0 0 8px;
}

.tabla-encabezado p {
  font-size: 13px;
  color: #888;
  margin: 0;
}

.contador {
  font-size: 13px;
  color: #81223c;
  font-weight: 600;
}

.tabla-contenedor {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  background-color: #f6f6f8;
  padding: 15px;
  font-size: 13px;
  color: #555;
  white-space: nowrap;
}

.sin-registros {
  text-align: center;
  padding: 55px 15px;
}

.sin-registros i {
  font-size: 36px;
  color: #aaa;
}

.sin-registros p {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin: 12px 0 6px;
}

.sin-registros span {
  font-size: 12px;
  color: #999;
}
td {
  padding: 15px;
  font-size: 13px;
  color: #555;
  border-bottom: 1px solid #eee;
}

.btn-ver {
  color: #81223c;
  text-decoration: none;
  font-weight: 600;
}

.btn-ver:hover {
  text-decoration: underline;
}
</style>
