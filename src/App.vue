<script>
  // import BannerComponent from './components/BannerComponent.vue';
  import NavbarComponent from './components/NavbarComponent.vue';
  import { useGlobalStore } from './stores/global.js';
  import { onBeforeMount } from 'vue';


  export default {
    components: {
      //BannerComponent,
      NavbarComponent
    },
    setup() {

      const { getUserDetails} = useGlobalStore();

      onBeforeMount(() => getUserDetails(localStorage.getItem("token")));
    }
  }
</script>

<template>
  
  <NavbarComponent />
  <!-- 
  <router-view> is a Vue Router component that is used to display the component associated with the current route.

  When a user navigates to a different route, Vue Router displays the component associated with the route inside the <router-view> component. 
  --> 
  <router-view />

</template>

<style>
  
</style>