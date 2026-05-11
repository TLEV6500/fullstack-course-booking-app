<!-- ACTIVITY SOLUTION START -->
<script>
import coursesData from "../data/coursesData.js";
import { ref, reactive, onMounted } from "vue";
import CourseComponent from "../components/CourseComponent.vue";
// import CourseComponent2 from "../components/CourseComponent2.vue";
// import CourseComponent3 from "../components/CourseComponent3.vue";
// import CourseComponent4 from "../components/CourseComponent4.vue";
// import CourseComponent5 from "../components/CourseComponent5.vue";
// import CourseComponent6 from "../components/CourseComponent6.vue";

export default {
    components: {
        CourseComponent,
        // CourseComponent2,
        // CourseComponent3,
        // CourseComponent4,
        // CourseComponent5,
        // CourseComponent6,
    },
    setup() {
        const courses = reactive(coursesData).filter(
            (course) => course.onOffer,
        );
        onMounted(() => {
            console.log(courses);
        });
        return { courses };
    },
};
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col my-5">
                <h1 class="text-center text-primary py-1">Courses Offered</h1>
                <p class="text-center">Select a course to enroll in!</p>
            </div>
        </div>
        <div class="row g-4">
            <div class="col-md-4">
                <CourseComponent
                    v-for="course in courses"
                    :key="course.id"
                    :courseData="courseData"
                />
            </div>
            <!-- <div class="col-md-4">
                <CourseComponent2 />
            </div>
            <div class="col-md-4">
                <CourseComponent3 />
            </div>
            <div class="col-md-4">
                <CourseComponent4 />
            </div>
            <div class="col-md-4">
                <CourseComponent5 />
            </div>
            <div class="col-md-4">
                <CourseComponent6 />
            </div> -->
        </div>
    </div>
</template>
<!-- ACTIVITY SOLUTION END -->
