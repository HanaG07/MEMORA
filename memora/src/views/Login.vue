<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/Config";

const router = useRouter();

const correo = ref("");
const contrasena = ref("");
const error = ref("");
const cargando = ref(false);
const mostrarContrasena = ref(false);

async function iniciarSesion() {
  if (cargando.value) return;

  error.value = "";
  cargando.value = true;

  try {
    await signInWithEmailAndPassword(
      auth,
      correo.value.trim(),
      contrasena.value,
    );

    // Redirigir al Dashboard
    await router.push("/dashboard");
  } catch (err) {
    console.error("Error al iniciar sesión:", err.code);

    if (
      err.code === "auth/invalid-credential" ||
      err.code === "auth/wrong-password" ||
      err.code === "auth/user-not-found"
    ) {
      error.value = "Correo o contraseña incorrectos.";
    } else if (err.code === "auth/too-many-requests") {
      error.value = "Demasiados intentos. Intenta nuevamente más tarde.";
    } else if (err.code === "auth/network-request-failed") {
      error.value =
        "Error de conexión. Revisa tu internet e intenta nuevamente.";
    } else {
      error.value = "No se pudo iniciar sesión. Intenta nuevamente.";
    }
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="login-container">
    <!-- Sección izquierda -->
    <section class="login-info">
      <div class="marca">
        <h1>MEMORA</h1>
        <p>HARD ROCK RIVIERA MAYA</p>
      </div>

      <div class="descripcion">
        <h2>Gestión documental de equipos y cuentas</h2>
        <p>Todo en un solo lugar</p>
      </div>

      <div class="pie">Departamento de TI · Hard Rock Riviera Maya</div>
    </section>

    <!-- Sección derecha -->
    <section class="login-formulario">
      <div class="login-card">
        <div class="icono">
          <i class="bi bi-file-earmark-text"></i>
        </div>

        <h2>Bienvenido a Memora</h2>

        <p class="subtitulo">Inicia sesión para acceder al sistema</p>

        <form @submit.prevent="iniciarSesion">
          <!-- Correo electrónico -->
          <div class="campo">
            <label for="correo">Correo electrónico</label>

            <input
              id="correo"
              v-model="correo"
              type="email"
              placeholder="Ingresa tu correo"
              autocomplete="username"
              :disabled="cargando"
              required
            />
          </div>

          <!-- Contraseña -->
          <div class="campo">
            <label for="contrasena">Contraseña</label>

            <div class="password-container">
              <input
                id="contrasena"
                v-model="contrasena"
                :type="mostrarContrasena ? 'text' : 'password'"
                placeholder="Ingresa tu contraseña"
                autocomplete="current-password"
                :disabled="cargando"
                required
              />

              <button
                type="button"
                class="mostrar-password"
                :aria-label="
                  mostrarContrasena
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                "
                :disabled="cargando"
                @click="mostrarContrasena = !mostrarContrasena"
              >
                <i
                  :class="mostrarContrasena ? 'bi bi-eye-slash' : 'bi bi-eye'"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </div>

          <!-- Mensaje de error -->
          <p v-if="error" class="mensaje-error" role="alert">
            <i class="bi bi-exclamation-circle"></i>
            {{ error }}
          </p>

          <!-- Botón iniciar sesión -->
          <button type="submit" class="btn-login" :disabled="cargando">
            <template v-if="cargando">
              <i class="bi bi-arrow-repeat"></i>
              Iniciando sesión...
            </template>

            <template v-else> Iniciar sesión </template>
          </button>
        </form>

        <p class="acceso">
          <i class="bi bi-shield-lock"></i>
          Acceso exclusivo para TI
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  font-family: Arial, sans-serif;

  background:
    linear-gradient(rgba(54, 7, 23, 0.78), rgba(129, 7, 46, 0.523)),
    url("../assets/hardrock.jpg");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

/* Sección izquierda */
.login-info {
  width: 50%;
  color: white;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.marca h1 {
  font-size: 38px;
  margin: 0;
  letter-spacing: 2px;
}

.marca p {
  font-size: 13px;
  letter-spacing: 3px;
  color: #e4c9d0;
}

.descripcion h2 {
  font-size: 36px;
  max-width: 500px;
  line-height: 1.2;
}

.descripcion p {
  font-size: 16px;
  line-height: 1.7;
  color: #e9d9dd;
  max-width: 450px;
}

.pie {
  font-size: 12px;
  color: #d8bdc4;
}

/* Sección derecha */
.login-formulario {
  width: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 45px 38px;
  border-radius: 16px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  text-align: center;
  box-sizing: border-box;
}

.icono {
  font-size: 42px;
  color: #8b1530;
  margin-bottom: 15px;
}

.login-card h2 {
  margin: 0 0 10px;
  font-size: 26px;
  color: #202127;
}

.subtitulo {
  color: #777;
  font-size: 14px;
  margin-bottom: 32px;
}

/* Campos */
.campo {
  text-align: left;
  margin-bottom: 22px;
}

.campo label {
  display: block;
  margin-bottom: 9px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.campo input {
  width: 100%;
  padding: 13px;
  border: 1px solid #d5d8df;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  background: white;
}

.campo input:focus {
  outline: none;
  border-color: #8b1530;
  box-shadow: 0 0 0 3px rgba(139, 21, 48, 0.08);
}

.campo input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* Mostrar u ocultar contraseña */
.password-container {
  position: relative;
}

.password-container input {
  padding-right: 55px;
}

.mostrar-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #8b1530;
  cursor: pointer;
  padding: 8px;
  font-size: 17px;
}

.mostrar-password:hover {
  color: #6d1025;
}

/* Mensaje de error */
.mensaje-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #fce8ec;
  color: #a12643;
  border: 1px solid #efc5d0;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 15px;
  text-align: center;
}

/* Botón iniciar sesión */
.btn-login {
  width: 100%;
  padding: 14px;
  background: #8b1530;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.btn-login:hover:not(:disabled) {
  background: #6d1025;
}

.btn-login:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-login i {
  margin-right: 6px;
}

/* Pie del formulario */
.acceso {
  margin-top: 25px;
  font-size: 12px;
  color: #888;
}

.acceso i {
  margin-right: 5px;
  color: #8b1530;
}

/* Responsivo */
@media (max-width: 800px) {
  .login-container {
    flex-direction: column;
  }

  .login-info,
  .login-formulario {
    width: 100%;
  }

  .login-info {
    padding: 35px;
    gap: 25px;
  }

  .descripcion h2 {
    font-size: 25px;
  }

  .login-card {
    padding: 35px 25px;
  }
}

@media (max-width: 480px) {
  .login-info {
    padding: 25px;
  }

  .login-formulario {
    padding: 20px;
  }

  .marca h1 {
    font-size: 30px;
  }

  .login-card {
    padding: 30px 20px;
  }

  .login-card h2 {
    font-size: 23px;
  }
}
</style>
