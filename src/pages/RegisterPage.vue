<script setup>
	 /* ACTIVITY SOLUTION START */
	import { watch, ref, onBeforeMount } from 'vue';

	import { Notyf } from 'notyf';
	import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global.js';
	/* ACTIVITY SOLUTION END */
	import api from '../api.js';

	/*
	When the input value is updated so will the reactive state it is bound, vice versa
	*/
	const firstName = ref("");
	const lastName = ref("");
	const mobileNum = ref("");
	const email = ref("");
	const password = ref("");
	const confirmPassword = ref("");
	const isEnabled = ref(false);

	const notyf = new Notyf();

	/* ACTIVITY SOLUTION START */
    const router = useRouter()

    const { user } = useGlobalStore();
    /* ACTIVITY SOLUTION END */

	watch([email, password, confirmPassword, firstName, lastName, mobileNum], (currentValue, oldValue) => {
		// console.log(currentValue);

		if(currentValue.every(input => input !== "") && currentValue[1] === currentValue[2]) {
			isEnabled.value = true
		} else {
			isEnabled.value = false
		}
	});

	async function handleSubmit(e) {
		e.preventDefault();

		// console.log(email.value);
		// console.log(password.value);
		// console.log(confirmPassword.value);

		try {

			await api.post('/users/check-email', {
				email: email.value
			})

			let response = await api.post('/users/register', {
				firstName: firstName.value,
				lastName: lastName.value,
				email: email.value,
				mobileNo: mobileNum.value,
				password: password.value
			})

			if(response.status === 201) {

				notyf.success(response.data.message);

				firstName.value = "";
				lastName.value = "";
				mobileNum.value = "";
				email.value = "";
				password.value = "";
				confirmPass.value = "";

				router.push({ path: '/login'})

			} else {

				notyf.error("Registration Failed. Please contact admin.");
			}

		} catch(e) {

			if( e.response.status === 404 || e.response.status === 401 || e.response.status === 400 || e.response.status === 409) {

				notyf.error(e.response.data.message);

			} else {

				console.error(e);
				notyf.error("Registration Failed. Please contact admin.")
			}
		}
		
	}

	/* ACTIVITY SOLUTION START */
    onBeforeMount(() => {
        if(user.email){
            router.push({path: '/courses'})
        }
    })
    /* ACTIVITY SOLUTION END */

</script>

<template>
	
	<div class="container-fluid">
		<h1 class="my-5 pt-3 text-primary text-center">
			Register Page
		</h1>
		<div class="row d-flex justify-content-center">
			<div class="col-md-5 mx-auto">
			<form v-on:submit="handleSubmit">
				<div class="mb-3">
					<label for="fName" class="form-label">FirstName</label>
					<input type="text" class="form-control" id="fName" v-model="firstName">
				</div>
				<div class="mb-3">
					<label for="lName" class="form-label">Last Name</label>
					<input type="text" class="form-control" id="lName" v-model="lastName">
				</div>
				<div class="mb-3">
					<label for="mobile" class="form-label">Mobile Number</label>
					<input type="text" class="form-control" id="mobile" v-model="mobileNum">
				</div>
				<div class="mb-3">
					<label for="emailInput" class="form-label">
						Email Address
					</label>
					 <!-- v-bind:value = allows us to bind the value of this input to an exposed variable -->
                        <!-- v-on:input is an event listener directive that allow us to run a given function as the user types in an input. -->
                        <!-- 
                            $event - is the event object which contains information about "what happened" in the element. This event object can be passed into the event listener function for processing.

                            $event.target - is the element where the event happened.
                            $event.target.value - the value of the element where the event happened.

                            email = $event.target.value - update the value of the email state with the current value of the element.
                        -->
					<input type="email" class="form-control" id="emailInput" v-model="email">
				</div>
				 <!-- v-model is a directive which also allows for binding the value of an element to an exposed variable. However, v-model also automatically adds the current value of the element into the reactive state upon user input-->
				<div class="mb-3">
					<label for="passwordInput" class="form-label">
						Password
					</label>
					<input type="password" class="form-control" id="passwordInput" v-model="password">
				</div>

				<div class="mb-3">
					<label for="cpasswordInput" class="form-label">
						Confirm Password
					</label>
					<input type="password" class="form-control" id="cpasswordInput" v-model="confirmPassword">
				</div>

				<div class="d-grid mt-5">
					<button type="submit" class="btn btn-primary btn-block" v-if="isEnabled">Submit</button>
					<button type="submit" class="btn btn-danger btn-block" disabled v-else>Submit</button>
				</div>
			</form>
			</div>
		</div>
	</div>

</template>