<template>
    <div class="col-md-4">
        <div id="CourseCard" class="card p-2 h-100">
            <div class="card-body">
                <h4 class="card-title">
                    {{ newsData.name }}
                </h4>
                <p class="card-text mt-3">
                    {{ newsData.description }}
                </p>
                <p>Likes: {{ likes }}</p>
                <div class="mt-auto text-center d-grid">
                    <button
                        class="btn btn-outline-primary btn-block"
                        v-if="likes < 10"
                        v-on:click="likeNews"
                    >
                        Like
                    </button>
                    <button
                        class="btn btn-outline-danger btn-block"
                        v-else
                        disabled
                    >
                        Like
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface Props {
    newsData: {
        id: string;
        name: string;
        description: string;
        isActive: boolean;
    };
}

const { newsData } = defineProps<Props>();

const likes = ref(0);

function likeNews() {
    likes.value++;
}
</script>
