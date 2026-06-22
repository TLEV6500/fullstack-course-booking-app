<template>
    <div class="container py-4">
        <form @submit.prevent="searchCourses" class="mb-4">
            <div class="input-group">
                <input
                    type="text"
                    v-model="courseName"
                    class="form-control"
                    placeholder="Enter course name"
                    required
                />
                <button
                    class="btn btn-primary"
                    type="submit"
                    :disabled="isLoading"
                >
                    {{ isLoading ? "Searching..." : "Search" }}
                </button>
            </div>
        </form>

        <div v-if="courses.length">
            <h5>Results:</h5>
            <div class="row">
                <CourseComponent
                    v-for="course in courses"
                    :key="course._id"
                    :courseData="course"
                />
            </div>
        </div>

        <div v-else-if="!isLoading && hasSearched">
            <p class="text-muted">No courses found.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Notyf } from "notyf";
import api from "../api.js";
import CourseComponent from "./CourseComponent.vue";

const notyf = new Notyf();

const courseName = ref("");
const courses = ref([]);
const isLoading = ref(false);
const hasSearched = ref(false);

const searchCourses = async () => {
    try {
        if (!courseName.value.trim()) {
            notyf.error("Please enter a course name");
            return;
        }

        isLoading.value = true;
        hasSearched.value = true;

        const response = await api.post("/courses/search", {
            courseName: courseName.value.trim(),
        });

        courses.value = response.data || [];

        if (courses.value.length) {
            notyf.success(`Found ${courses.value.length} course(s).`);
        } else {
            notyf.error("No courses found");
        }
    } catch (error) {
        console.error(error);
        notyf.error("Something went wrong while searching.");
    } finally {
        isLoading.value = false;
    }
};
</script>
