<!-- ACTIVITY SOLUTION START -->
<script>
import BannerComponent from "../components/BannerComponent.vue";
import HighlightsComponent from "../components/HighlightsComponent.vue";

export default {
    components: {
        BannerComponent,
        HighlightsComponent,
    },
    data() {
        return {
            bannerProps: {
                title: "Zuitt Course Booking System",
                tagline: "Opportunities for everyone, everywhere",
            },
        };
    },
};
</script>

<template>
    <div class="container-fluid">
        <BannerComponent :bannerProps="bannerProps" />
        <HighlightsComponent />
    </div>
</template>
<!-- ACTIVITY SOLUTION END -->
