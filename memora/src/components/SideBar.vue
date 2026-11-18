<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { auth } from "../Firebase/Config";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

async function cerrarSesion() {
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

const menuAbierto = ref(false);

function cerrarMenu() {
  menuAbierto.value = false;
}
</script>

<template>
  <!-- Botón fijo para abrir el menú -->
  <button
    class="boton-menu"
    type="button"
    :aria-expanded="menuAbierto"
    aria-label="Abrir o cerrar menú"
    @click="menuAbierto = !menuAbierto"
  >
    <i class="bi bi-list"></i>
  </button>

  <!-- Fondo oscuro al abrir -->
  <div v-if="menuAbierto" class="menu-overlay" @click="cerrarMenu"></div>

  <!-- Barra lateral flotante -->
  <aside class="sidebar" :class="{ abierta: menuAbierto }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icono">
        <i class="bi bi-folder2-open"></i>
      </div>

      <div class="logo-texto">
        <h2>MEMORA</h2>
        <p>HARD ROCK RIVIERA MAYA</p>
      </div>
    </div>

    <!-- Menú principal -->
    <nav class="sidebar-menu">
      <p class="menu-titulo">MENÚ PRINCIPAL</p>

      <RouterLink
        to="/dashboard"
        class="menu-item"
        active-class="activo"
        @click="cerrarMenu"
      >
        <i class="bi bi-grid-1x2"></i>
        <span>Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/resguardo"
        class="menu-item"
        active-class="activo"
        @click="cerrarMenu"
      >
        <i class="bi bi-files"></i>
        <span>Resguardos</span>
      </RouterLink>

      <RouterLink
        to="/colaboradores"
        class="menu-item"
        active-class="activo"
        @click="cerrarMenu"
      >
        <i class="bi bi-people"></i>
        <span>Colaboradores</span>
      </RouterLink>

      <RouterLink
        to="/reportes"
        class="menu-item"
        active-class="activo"
        @click="cerrarMenu"
      >
        <i class="bi bi-bar-chart"></i>
        <span>Reportes</span>
      </RouterLink>
    </nav>

    <!-- Parte inferior -->
    <div class="sidebar-footer">
      <div class="usuario-info">
        <div class="usuario-icono">
          <i class="bi bi-person-circle"></i>
        </div>

        <div class="usuario-texto">
          <span>Personal de TI</span>
          <small>Acceso autorizado</small>
        </div>
      </div>

      <div class="menu-item cerrar-sesion" @click="cerrarSesion">
        <i class="bi bi-box-arrow-right"></i>
        <span>Cerrar sesión</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Botón de menú */
.boton-menu {
  position: fixed;
  top: 25px;
  left: 30px;
  z-index: 1200;

  width: 45px;
  height: 50px;

  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;

  color: #81223c;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.boton-menu i {
  font-size: 35px;
}

.boton-menu:hover {
  color: #a52c4d;
}

/* Fondo al abrir el menú */
.menu-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 1000;
}

/* Barra lateral flotante */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  height: 100dvh;
  background-color: #242329;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 85px 15px 25px;
  box-sizing: border-box;
  z-index: 1100;
  overflow-y: auto;

  /* Oculta la barra fuera de la pantalla */
  transform: translateX(-100%);
  visibility: hidden;

  transition:
    transform 0.4s ease-in-out,
    visibility 0.4s;
}

/* Barra abierta */
.sidebar.abierta {
  transform: translateX(0);
  visibility: visible;
}

/* Logo */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px 25px;
  border-bottom: 1px solid #48434b;
}

.logo-icono {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  background-color: #81223c;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icono i {
  font-size: 22px;
  color: white;
}

.logo-texto {
  min-width: 0;
}

.logo-texto h2 {
  font-size: 21px;
  letter-spacing: 1.5px;
  margin: 0;
  color: white;
}

.logo-texto p {
  font-size: 9px;
  letter-spacing: 0.5px;
  color: #c8adb5;
  margin: 5px 0 0;
  white-space: nowrap;
}

/* Menú principal */
.sidebar-menu {
  margin-top: 25px;
  flex: 1;
}

.menu-titulo {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #918b95;
  margin: 0 0 18px 15px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 15px;
  margin-bottom: 8px;
  border-radius: 8px;
  color: #d9d3d7;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;

  transition:
    background-color 0.2s,
    color 0.2s;
}

.menu-item i {
  font-size: 19px;
  width: 22px;
  text-align: center;
  flex-shrink: 0;
}

.menu-item:hover {
  background-color: #39343d;
  color: white;
}

.menu-item.activo {
  background-color: #81223c;
  color: white;
  font-weight: 600;
}

/* Parte inferior */
.sidebar-footer {
  border-top: 1px solid #48434b;
  padding-top: 18px;
}

.usuario-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px 20px;
}

.usuario-icono {
  font-size: 30px;
  color: #c8adb5;
}

.usuario-texto {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.usuario-texto span {
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.usuario-texto small {
  font-size: 11px;
  color: #aaa3ad;
}

.cerrar-sesion {
  color: #d9d3d7;
  margin-bottom: 0;
}

.cerrar-sesion:hover {
  background-color: #81223c;
  color: white;
}
</style>
