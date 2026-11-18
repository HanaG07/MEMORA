import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../Firebase/Config";

import Dashboard from "../views/Dashboard.vue";
import Resguardo from "../views/Resguardo.vue";
import ColaboradorRes from "../views/ColaboradorRes.vue";
import Reportes from "../views/Reportes.vue";
import Login from "../views/Login.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard },
  { path: "/resguardo", component: Resguardo },
  { path: "/colaboradores", component: ColaboradorRes },
  { path: "/reportes", component: Reportes },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const usuario = await auth.authStateReady().then(() => auth.currentUser);

  if (!usuario && to.path !== "/login") {
    return "/login";
  }

  if (usuario && to.path === "/login") {
    return "/dashboard";
  }

  return true;
});

export default router;
