import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "../api";
//defineStore() creates a store. It has 2 arguments, the unique id of the store and the function that defines and returns the states and actions of the store.
export const useGlobalStore = defineStore("global", () => {
    let user = reactive({
        token: localStorage.getItem("token"),
        email: null,
        isAdmin: null,
    });

    async function getUserDetails(token: string | null | undefined) {
        if (!token) {
            user.token = null;
            user.email = null;
            user.isAdmin = null;

            return;
        }

        let { data } = await api.get("/users/details", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        user.token = token;
        user.email = data.email;
        user.isAdmin = data.isAdmin;
    }

    return {
        user,
        getUserDetails,
    };
});
