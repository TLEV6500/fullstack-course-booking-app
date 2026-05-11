<!--
  What is a component?
    A component is a reusable part of an application.

  What is a VueJS Component?
    A VueJS component is an independent reusable part of an application. In VueJS, components are usually created with the concept of Single-File Component (SFC) which simply means that in VueJS, a component holds the HTML code, JS Script and CSS altogether in a file with a .vue extension instead of having and keeping separate files for each.

  An SFC consists of three parts:
    1. Template
    2. Script
    3. Style

  This provides a convenient way to organize and reuse components in a declarative and modular way. They also allow for better separation of concerns, making it easier to reason about the functionality and styling of a component
-->
<!-- Each SFC block consists of HTML-like tags that encapsulates the block. They can be in any order. -->

<script>
export default {
    name: "BannerComponent",
    props: {
        bannerProps: Object,
    },
};
</script>

<template>
    <!-- Template: A block of HTML-like code that defines the structure of the component. -->
    <div class="container-fluid">
        <div class="row mb-5 py-5" id="banner">
            <div class="col-md-10 p-5 ms-5">
                <h1 class="mb-3" id="banner-title">
                    {{ bannerProps.title }}
                </h1>
                <p class="mb-5" id="motto">
                    {{ bannerProps.tagline }}
                </p>
                <a class="btn btn-primary btn-lg rounded-pill px-3"
                    >View Our Courses! <i class="bi bi-arrow-right"></i
                ></a>
            </div>
        </div>
    </div>
</template>

<style scoped>
/*Style: A block of CSS code that defines the styling of the component. */
h1 {
    font-family: serif;
    font-style: normal;
    font-weight: 700;
    font-size: 48px;
}
</style>
