<script setup>
import Sidebar from "../components/SideBar.vue";
</script>

<template>
  <div class="layout-dashboard">
    <!-- Menú lateral -->
    <Sidebar />

    <!-- Contenido principal -->
    <main class="dashboard">
      <!-- Encabezado -->
      <div class="encabezado">
        <div>
          <h1>Dashboard</h1>
          <p>Bienvenido al sistema de gestión de resguardos.</p>
        </div>

        <button class="btn-nuevo">
          <i class="bi bi-plus-lg"></i>
          Nuevo resguardo
        </button>
      </div>

      <!-- Tarjetas de estadísticas -->
      <div class="estadisticas">
        <!-- Total de resguardos -->
        <div class="tarjeta">
          <div class="tarjeta-superior">
            <span>Total de resguardos</span>
            <i class="bi bi-files"></i>
          </div>

          <h2>0</h2>
          <p>Documentos registrados</p>
        </div>

        <!-- Computadoras -->
        <div class="tarjeta">
          <div class="tarjeta-superior">
            <span>Computadoras</span>
            <i class="bi bi-pc-display"></i>
          </div>

          <h2>0</h2>
          <p>Resguardos de computadoras</p>
        </div>

        <!-- Teléfonos -->
        <div class="tarjeta">
          <div class="tarjeta-superior">
            <span>Teléfonos</span>
            <i class="bi bi-phone"></i>
          </div>

          <h2>0</h2>
          <p>Resguardos de teléfonos</p>
        </div>

        <!-- Cuentas -->
        <div class="tarjeta">
          <div class="tarjeta-superior">
            <span>Cuentas</span>
            <i class="bi bi-key"></i>
          </div>

          <h2>0</h2>
          <p>Resguardos de cuentas</p>
        </div>
      </div>

      <!-- Resguardos recientes -->
      <section class="panel-recientes">
        <div class="panel-encabezado">
          <div>
            <h2>Resguardos recientes</h2>
            <p>Últimos documentos registrados en el sistema</p>
          </div>

          <button class="btn-ver-todos">
            Ver todos
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>

        <!-- Tabla -->
        <div class="tabla-contenedor">
          <table class="tabla-resguardos">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Colaborador</th>
                <th>Departamento</th>
                <th>Tipo</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              <!-- Mensaje cuando no hay registros -->
              <tr>
                <td colspan="5" class="sin-registros">
                  <i class="bi bi-folder2-open"></i>

                  <p>No hay resguardos registrados</p>

                  <span>
                    Los documentos aparecerán aquí cuando se registren en el
                    sistema.
                  </span>
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
/* Estructura principal */
.layout-dashboard {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Contenido del Dashboard */
.dashboard {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  padding: 35px;
  box-sizing: border-box;
  background-color: #f5f5f7;
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
  margin: 0;
}

/* Botón nuevo resguardo */
.btn-nuevo {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #8b1530;
  color: white;
  padding: 13px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-nuevo:hover {
  background-color: #6e1026;
}

/* Tarjetas de estadísticas */
.estadisticas {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.tarjeta {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e8e8ec;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s;
}

.tarjeta:hover {
  transform: translateY(-4px);
}

.tarjeta-superior {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.tarjeta-superior span {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.tarjeta-superior i {
  font-size: 25px;
  color: #8b1530;
}

.tarjeta h2 {
  font-size: 34px;
  color: #252525;
  margin: 18px 0 8px;
}

.tarjeta p {
  font-size: 12px;
  color: #929292;
  margin: 0;
}

/* Resguardos recientes */
.panel-recientes {
  margin-top: 30px;
  background: white;
  border: 1px solid #e8e8ec;
  border-radius: 12px;
  padding: 25px;
}

.panel-encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.panel-encabezado h2 {
  font-size: 20px;
  color: #252525;
  margin: 0 0 8px;
}

.panel-encabezado p {
  font-size: 13px;
  color: #888;
  margin: 0;
}

/* Botón ver todos */
.btn-ver-todos {
  background: transparent;
  border: none;
  color: #8b1530;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.btn-ver-todos i {
  margin-left: 6px;
}

.btn-ver-todos:hover {
  text-decoration: underline;
}

/* Tabla */
.tabla-contenedor {
  overflow-x: auto;
}

.tabla-resguardos {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.tabla-resguardos th {
  background: #f6f6f8;
  padding: 15px;
  font-size: 13px;
  color: #555;
}

/* Mensaje sin registros */
.sin-registros {
  text-align: center;
  padding: 50px 15px !important;
}

.sin-registros i {
  font-size: 35px;
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

/* Diseño responsivo */
@media (max-width: 1200px) {
  .estadisticas {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .dashboard {
    padding: 20px;
  }

  .encabezado {
    flex-direction: column;
    align-items: flex-start;
  }

  .estadisticas {
    grid-template-columns: 1fr;
  }

  .panel-encabezado {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
