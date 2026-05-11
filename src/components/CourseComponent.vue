<script setup>
defineProps({
    courseData: {
        type: Object,
        required: true,
    },
});
</script>

<!-- ACTIVITY SOLUTION START -->
<template>
    <div id="CourseCard" class="card p-2 h-100">
        <div class="card-body">
            <h4 class="card-title">{{ courseData.title }}</h4>
            <p class="card-text mt-3">
                {{ courseData.description }}
            </p>
            <p>Price: PHP {{ courseData.price }}</p>
            <button class="btn btn-outline-primary">Enroll</button>
        </div>
    </div>
</template>
<!-- ACTIVITY SOLUTION END -->
