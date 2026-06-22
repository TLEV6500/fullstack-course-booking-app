<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount, watch } from "vue";
import api from "../api.js";

import CourseComponent from "../components/CourseComponent.vue";
import UserView from "../components/UserView.vue";
import AdminView from "../components/AdminView.vue";

import { useGlobalStore } from "../stores/global.js";
const { user } = useGlobalStore();
const courses = reactive({ data: [] });

watch(
    [user],
    async () => {
        if (user.isAdmin) {
            let { data } = await api.get("/courses/all");
            courses.data = data;
        } else {
            let { data } = await api.get("/courses");
            courses.data = data;
        }
    },
    { immediate: true },
);
</script>

<template>
    <div class="container">
        <AdminView v-if="user.isAdmin" :coursesData="courses.data" />
        <UserView v-if="!user.isAdmin" :coursesData="courses.data" />
        <CourseComponent v-for="course in courses.data" :courseData="course" />
    </div>
</template>
