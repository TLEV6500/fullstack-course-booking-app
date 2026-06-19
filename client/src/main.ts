import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.min.css";

import "notyf/notyf.min.css";

import { createApp } from "vue";
//createPinia is imported from pinia
import { createPinia } from "pinia";
import App from "./App.vue";

import HomePage from "./pages/HomePage.vue";
import CoursesPage from "./pages/CoursesPage.vue";
import NewsPage from "./pages/NewsPage.vue";
import RegisterPage from "./pages/RegisterPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import LogoutPage from "./pages/LogoutPage.vue";
import ErrorPage from "./pages/ErrorPage.vue";
import ProfilePage from "./pages/ProfilePage.vue";
import ViewCourse from "./pages/ViewCourse.vue";
import AddCourse from "./pages/AddCourse.vue";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomePage,
        },
        {
            path: "/courses",
            name: "Courses",
            component: CoursesPage,
        },
        {
            path: "/register",
            name: "Register",
            component: RegisterPage,
        },
        {
            path: "/login",
            name: "Login",
            component: LoginPage,
        },
        {
            path: "/logout",
            name: "Logout",
            component: LogoutPage,
        },
        {
            path: "/news",
            name: "News",
            component: NewsPage,
        },
        {
            path: "/profile",
            name: "Profile",
            component: ProfilePage,
        },
        {
            path: "/courses/:id",
            name: "ViewCourse",
            component: ViewCourse,
        },
        /* ACTIVITY SOLUTION START */
        {
            path: "/addCourse",
            name: "AddCourse",
            component: AddCourse,
        },
        /* ACTIVITY SOLUTION END */
        {
            path: "/:catchAll(.*)",
            component: ErrorPage,
        },
    ],
});

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.mount("#app");
