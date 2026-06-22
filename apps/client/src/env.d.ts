/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

import "pinia";
import type { Router } from "vue-router";

declare module "pinia" {
    export interface PiniaCustomProperties {
        router: Router;
    }
}
