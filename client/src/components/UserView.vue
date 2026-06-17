<!-- ACTIVITY SOLUTION START -->
<template>
    <div class="row">
        <div class="col my-5">
            <h1 class="text-center text-primary py-1">Courses Offered</h1>
            <p class="text-center">Select a course to enroll in!</p>
            <!-- Add CourseSearch component -->
            <CourseSearch />
        </div>
    </div>
    <div class="row g-4">
        <CourseComponent v-for="course in coursesData" :courseData="course" />
    </div>
</template>

<script setup>
import CourseComponent from "../components/CourseComponent.vue";
import CourseSearch from "../components/CourseSearch.vue";

const props = defineProps({
    coursesData: Array,
});
</script>
<!-- ACTIVITY SOLUTION END -->
