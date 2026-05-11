<script>
  // import BannerComponent from './components/BannerComponent.vue';
  import NavbarComponent from './components/NavbarComponent.vue';
  import HomePage from './pages/HomePage.vue';
  import CoursesPage from './pages/CoursesPage.vue';

  export default {
    components: {
      //BannerComponent,
      NavbarComponent,
      /* ACTIVITY SOLUTION START */
      HomePage,
      CoursesPage
      /* ACTIVITY SOLUTION END */
    }
  }

</script>

<template>
  
  <NavbarComponent />
  <!-- <BannerComponent /> -->
   <!-- ACTIVITY SOLUTION START -->
  <HomePage />
  <CoursesPage />
  <!-- ACTIVITY SOLUTION END -->

</template>

<style>
  
</style>