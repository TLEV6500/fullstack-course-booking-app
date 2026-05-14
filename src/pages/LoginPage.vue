<script setup>
    /* ACTIVITY SOLUTION START */
    import { watch, ref, onBeforeMount } from 'vue';
    import { useGlobalStore } from '../stores/global';
    import { Notyf } from 'notyf';

    // import axios from 'axios';
    import api from '../api';

    //import global store, which contains our global states
    const { getUserDetails, user } = useGlobalStore();
    /* ACTIVITY SOLUTION END */

    //import useRouter from vue-router to import our router and be able to access it's redirecting methods instead of changing the page via href to force a page to refresh
    import { useRouter } from 'vue-router';

    //page navigation
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const isEnabled = ref(false);

    const notyf = new Notyf();

    watch([email,password], (currentValue, oldValue) => {

        if(currentValue.every(input => input !== "")){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }
    });

    async function handleSubmit(e){
        e.preventDefault();

        try {


            let res = await api.post('/users/login', {

                email: email.value,
                password: password.value
            })
            console.log(res.data)
            if(res.data) {
                notyf.success("Login Successful");

                localStorage.setItem("token", res.data.access);

                getUserDetails(res.data.access);

                email.value = "";
                password.value = "";

                // window.location.reload();
                router.push({ path: '/courses'});

            }

        } catch(e) {

            if(e.response.status === 404 || e.response.status === 401 || e.response.status === 400) {
                notyf.error(e.response.data.message)
            } else {
                notyf.error("Login Failed. Please contact admin.");
            }
        }

        
    }

     /* ACTIVITY SOLUTION START */
    onBeforeMount(()=>{
        if(user.email){
            router.push({path: "/courses"})
        }
    })
    /* ACTIVITY SOLUTION END */
</script>

<template>
    <div class="container-fluid">
        <h1 class="my-5 pt-3 text-primary text-center">Login Page</h1> 
        <div class="row d-flex justify-content-center">
            <div class="col-md-5 border border rounded-3 mx-auto p-5">
                <form v-on:submit="handleSubmit">
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="emailInput" v-model="email" />
                        <span v-if="email === ''" class="text-danger small">Email is required.</span>
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input type="password" class="form-control" id="passwordInput" v-model="password" />
                        <span v-if="password === ''" class="text-danger small">Password is required.</span>
                    </div>
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-block"  v-if="isEnabled">Login</button>
                        <button type="submit" class="btn btn-danger btn-block" disabled v-else>Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<!-- ACTIVITY SOLUTION END -->