<script setup lang="ts">
import NavbarComponent from "./components/NavbarComponent.vue";
import { useGlobalStore } from "./stores/global.js";
import { onBeforeMount } from "vue";

const { getUserDetails } = useGlobalStore();

onBeforeMount(() => getUserDetails(localStorage.getItem("token")));
</script>

<template>
    <NavbarComponent />
    <router-view />
</template>

<style></style>
