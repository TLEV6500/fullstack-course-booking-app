<template>
	
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<div class="card shadow-sm">
					<div class="card-body">
						<h3 class="card-title mb-4">Reset Password</h3>
						<form @submit.prevent="handleReset">
							<div class="mb-3">
								<label for="newPassword" class="form-label">New Password</label>
								<input type="password" id="newPassword" v-model="newPassword" class="form-control" required/>
							</div>
							<button type="submit" class=
							"btn btn-primary w-100" :disabled="isLoading">{{ isLoading ? "Resetting..." : "Reset: Password"}}</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>


<script setup>
	import { ref } from 'vue';
	import { Notyf } from 'notyf';
	import { useGlobalStore } from '../stores/global.js';
	import api from '../api.js';

	const notyf = new Notyf();

	const newPassword = ref("");
	const isLoading = ref(false);

	const handleReset = async() => {

		try {
			isLoading.value = true;

			const { user } = useGlobalStore();

			if(!user.token) {
				notyf.error("You are not authorized");
				isLoading.value = false;
				return;
			}

			let res = await api.post("/users/reset-password", {
				newPassword: newPassword.value
			});

			console.log(res)

			notyf.success("Password reset successfully");
			newPassword.value = "";

		} catch(e) {
			console.log(e);
			/*
			const msg = ((e.reponse && e.response.data && e.response.data.message) || "Password reset failed")
			*/
			const msg = e.response?.data?.message || "Password reset failed";
			notyf.error(msg);
		} finally {
			isLoading.value = false;
		}
	}
</script>