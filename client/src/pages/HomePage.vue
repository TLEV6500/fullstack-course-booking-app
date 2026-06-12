<!-- ACTIVITY SOLUTION START -->
<script>
  import BannerComponent from '../components/BannerComponent.vue';
  import HighlightsComponent from '../components/HighlightsComponent.vue';

  export default {
    components: {
      BannerComponent,
      HighlightsComponent
  },
    //data() method is used to return the "reactive states" managed by a component using the Options API. It returns an object containing the initial values for the component's reactive state.
    //In Vue JS, a "reactive state" refers to any data or variables that are associated with a component and can change during the component's lifecycle, causing the component to update and re-render.
    //Re-render means to update and re-display component.
    //States can be passed as a prop to another component.
  data() {
    return {
      bannerProps: {
        title: "Zuitt Course Booking System",
        tagline: "Opportunuties for everyone, everywhere",
        destination: "Courses",
        buttonLabel: "View Our Courses"
      }
    }
  }

  }
</script>

<template>
  <div class="container-fluid">
    <!-- Values can be passed as a props using HTML like attributges. This custome attribute names must be the same as the name of the props defined in the child component -->
    <BannerComponent :bannerProps="bannerProps" />
    <HighlightsComponent />
  </div>
</template>
<!-- ACTIVITY SOLUTION END -->