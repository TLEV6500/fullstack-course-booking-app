<script setup lang="ts">
import BannerComponent from "../components/BannerComponent.vue";
import HighlightsComponent from "../components/HighlightsComponent.vue";
const props = defineProps<{
    bannerProps: {
        title: string;
        tagline: string;
        destination: string;
        buttonLabel: string;
    };
}>();
</script>

<template>
    <div class="container-fluid">
        <BannerComponent :bannerProps="bannerProps" />
        <HighlightsComponent />
    </div>
</template>
