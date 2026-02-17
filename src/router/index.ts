import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import DetailView from "../views/DetailView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "dashboard", component: DashboardView },
    { path: "/show/:id", name: "detail", component: DetailView, props: true },
  ],
});
