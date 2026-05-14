<!-- ACTIVITY SOLUTION START -->
<script>
    import newsData from '../data/newsData.js';

     /* ACTIVITY SOLUTION START */
    import { reactive, ref, watch, onBeforeMount } from 'vue';
    /* ACTIVITY SOLUTION END */
    import { Notyf } from 'notyf';

    /* ACTIVITY SOLUTION START */
    import { useGlobalStore } from '../stores/global.js';
    /* ACTIVITY SOLUTION END */

    import NewsComponent from '../components/NewsComponent.vue';
    
    export default {
        components: {
            NewsComponent
        },
        setup() {

            const news = reactive(newsData)

            const email = ref("");
            const feedback = ref("");
            const isEnabled = ref(false);
             /* ACTIVITY SOLUTION START */
            //const userEmail = ref("");
            /* ACTIVITY SOLUTION END */

            const notyf = new Notyf();

             /* ACTIVITY SOLUTION START */
            const {user} = useGlobalStore();
            /* ACTIVITY SOLUTION END */

            watch([email,feedback], (currentValue, oldValue) => {

                if(currentValue.every(input => input !== "")){
                    isEnabled.value = true;
                } else {
                    isEnabled.value = false;
                }
            });

            function handleSubmit(e){
                
                e.preventDefault();

                notyf.success("Feedback Sent");

                email.value = "";
                feedback.value = "";
            }

             /* ACTIVITY SOLUTION START */
            // onBeforeMount(()=>{ 
            //  userEmail.value = localStorage.getItem("email")
            // });
            /* ACTIVITY SOLUTION END */

            return {
                news,
                email,
                feedback,
                isEnabled,
                handleSubmit,
                /* ACTIVITY SOLUTION START */
                user
                /* ACTIVITY SOLUTION END */
            }
        }
    }
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col my-5">
                <h1 class="text-center text-primary py-1">News</h1>
            </div>
        </div>
        <div class="row g-4">
            <NewsComponent v-for="indivNews in news" :newsData="indivNews"/>
        </div>
    </div>

    <!-- ACTIVITY SOLUTION START -->
        <div class="row" v-if="user.email">
            <h1 class="my-5 pt-3 text-primary text-center">Feedback Form</h1>

            <div class="col-md-9 border border rounded-3 mx-auto p-5">
                <form v-on:submit="handleSubmit">
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="emailInput" v-model="email" />
                    </div>
                    <div class="mb-3">
                        <label for="feedbackInput" class="form-label">Feedback</label>
                        <textarea class="form-control" id="feedbackInput" placeholder="Let us know what you think" rows="5" v-model="feedback"></textarea>
                    </div>
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-block"  v-if="isEnabled">Send Feedback</button>
                        <button type="submit" class="btn btn-danger btn-block" disabled v-else>Send Feedback</button>
                    </div>
                </form>
            </div>
        </div>
        <!-- ACTIVITY SOLUTION END -->
</template>
<!-- ACTIVITY SOLUTION END -->