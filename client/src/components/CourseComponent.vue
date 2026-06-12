<!-- ACTIVITY SOLUTION START -->
<template>
    <div class="col-12 col-md-6 col-lg-4 my-3">
    <div id="CourseCard" class="card p-2 h-100">
        <img 
        class="card-img-top"
        :src="`https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(courseData.name)}`"
        :alt="courseData.name"
        >

        <div class="card-body">
            <h4 class="card-title fw-bold mb-2">
                {{courseData.name}}
            </h4>
            <p class="card-text mt-3">
                {{courseData.description}}
            </p>
            <p class="mb-1">
                <span class="fw-bold">Price:</span> PHP {{courseData.price}}
            </p>
            <p>
                Enrollees: {{enrollees}}
            </p>
            <!-- ACTIVITY SOLUTION START -->
            <p>
                Seats: {{seats}}
            </p>
            <div class="mt-auto text-center d-grid">
             <!--
            add v-on: to listen to an event. 
            v-on is a Vue JS directive that allow us to easily allow an element to listen to an event.
            click is an event where the user clicks on an element.
            v-on: takes an exposed function as a value and runs it when the event occurs.
            Whenever the Enroll button is clicked the exposed function enroll from the script block is run.
          -->
            <!--  <button class="btn btn-outline-primary btn-block" v-if="isEnabled" v-on:click="enroll">Enroll</button>
             <button class="btn btn-outline-danger btn-block" v-else disabled>Enroll</button> -->
             <router-link class="btn btn-outline-primary d-block" :to="{ path: `/courses/${courseData._id}`}">View Course</router-link>
        </div>
    </div>
</div>
</div>
</template>
<!-- ACTIVITY SOLUTION END -->

<script>
    //import ref() from vue to create a reactive reference.
    import { ref, watch, onMounted } from 'vue';

    /* ACTIVITY SOLUTION START */
    import { Notyf } from 'notyf';

    import { useGlobalStore } from '../stores/global.js';

    const notyf = new Notyf();
    /* ACTIVITY SOLUTION END */

    export default {
        props: {
            courseData: Object
        },
        setup({courseData}) {

            const { user } = useGlobalStore();
            // const enrollees = ref(0);

             /* ACTIVITY SOLUTION START */
            // const seats = ref(30);

            // const isEnabled = ref(true);

            // function enroll() {
            //     enrollees.value++;
            //     seats.value--;

            //     //Emit a custom event to the parent component which also sends a value of one into the handling function.
            //     //Every time we use the enroll button, a value of one is added into the count state in the parent component
            //     //The emit method's first argument is the name of the custom event to be triggered in the parent component.
            //     //The second argument is the value passed to the parent component.
            //     //When emit method is run from the enroll method here, the "enrollment" custom event in the parent component will be triggered and run the function that is attached to it.
            //     //The value from the emit will be received by the function attached to the custom event.
            //     emit('enrollment', 1);
            // }

            //Use the watch() hook to track the changes made to a reactive reference/object and perform a task when the value changes.
            //watch() hook has two arguments, first is the reactive state to track and the second is the function that is run when the tracked state is is updated.
            //The callback function receives 2 values, the updated value of the state and its old value.
            //Every time the seats state is updated we will check its current value. If it is equal to 0, we will update the isEnabled ref/state to false which will disable the enroll button. Else, we will update the isEnabled value to true.
            // watch(seats, (currentValue, oldValue) => {
            //     if(currentValue === 0) {
            //         isEnabled.value = false;
            //         /* ACTIVITY SOLUTION START */
            //   notyf.error("No more seats available");
            //   /* ACTIVITY SOLUTION END */
            //     } else {
            //         isEnabled.value = true;
            //     }
            // });

            return {
                // courseData,
                // enrollees,
                // enroll,
                // seats,
                // isEnabled
                user
            }
            /* ACTIVITY SOLUTION END */
        }
    }
</script>