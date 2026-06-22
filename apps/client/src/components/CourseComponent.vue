<template>
    <div class="col-12 col-md-6 col-lg-4 my-3">
        <div id="CourseCard" class="card p-2 h-100">
            <img
                class="card-img-top"
                :src="`https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(courseData.name)}`"
                :alt="courseData.name"
            />

            <div class="card-body">
                <h4 class="card-title fw-bold mb-2">
                    {{ courseData.name }}
                </h4>
                <p class="card-text mt-3">
                    {{ courseData.description }}
                </p>
                <p class="mb-1">
                    <span class="fw-bold">Price:</span> PHP
                    {{ courseData.price }}
                </p>
                <p>Enrollees: {{ enrollees }}</p>
                <p>Seats: {{ seats }}</p>
                <div class="mt-auto text-center d-grid">
                    <router-link
                        class="btn btn-outline-primary d-block"
                        :to="{ path: `/courses/${courseData._id}` }"
                        >View Course</router-link
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Notyf } from "notyf";

import { useGlobalStore } from "../stores/global.js";

const notyf = new Notyf();

const props = defineProps<{ courseData: any }>();

const enrollees = props.courseData.enrollees || 0;
const seats = props.courseData.seats || 0;

const { user } = useGlobalStore();
</script>
