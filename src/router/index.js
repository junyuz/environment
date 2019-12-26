import Vue from "vue";
import VueRouter from "vue-router";
import {
  Home,
  Login,
  GIS,
  Notice,
  Facilities,
  Quality,
  Statistics
} from "../views";

Vue.use(VueRouter);

const routes = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: Home,
    children: [
      { path: "/", component: GIS },
      { path: "/notice", component: Notice },
      { path: "/quality", component: Quality },
      { path: "/facilities", component: Facilities },
      { path: "/statistics", component: Statistics }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  // base: 'environment',
  routes
});

export default router;
