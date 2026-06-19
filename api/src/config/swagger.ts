import swaggerJsdoc, { type OAS3Definition } from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Course Booking API",
            version: "1.0.0",
            description:
                "The Course Booking API allows users to book courses. This project is an improvement on the owner's submission for the Zuitt Full-Stack Web Development Bootcamp 2026",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
};

const modules = [
    { prefix: "/users", files: ["./docs/user.yaml"] },
    { prefix: "/enrollments", files: ["./docs/enrollment.yaml"] },
    { prefix: "/courses", files: ["./docs/course.yaml"] },
];

function compileModuleSpec({ prefix, files }) {
    const options = {
        definition: { openapi: "3.0.0", info: { title: "temp", version: "1" } },
        apis: files,
    };

    const compiled = swaggerJsdoc(options) as unknown as OAS3Definition;
    const prefixedPaths = {};

    if (compiled.paths) {
        Object.keys(compiled.paths).forEach((route) => {
            const formattedRoute =
                route === "/"
                    ? ""
                    : route.startsWith("/")
                      ? route
                      : `/${route}`;
            const cleanPrefix = prefix.endsWith("/")
                ? prefix.slice(0, -1)
                : prefix;

            const fullRoute = `${cleanPrefix}${formattedRoute}`.replace(
                /\/+/g,
                "/",
            );
            prefixedPaths[fullRoute] = compiled.paths![route];
        });
    }

    return {
        paths: prefixedPaths,
        components: compiled.components || {},
    };
}

// 3. Process all modules and merge into the main configuration
const finalSpec: OAS3Definition = {
    ...options.definition,
    paths: {},
    components: {},
};

modules.forEach((mod) => {
    const { paths, components } = compileModuleSpec(mod);

    // Merge paths
    if (!finalSpec.paths) finalSpec.paths = {};
    Object.assign(finalSpec.paths, paths);

    // Merge components (schemas, securitySchemes, etc.)
    if (components) {
        finalSpec.components = {
            ...finalSpec.components,
            ...components,
            schemas: {
                ...(finalSpec.components?.schemas ?? {}),
                ...(components.schemas ?? {}),
            },
            securitySchemes: {
                ...(finalSpec.components?.securitySchemes ?? {}),
                ...(components.securitySchemes ?? {}),
            },
        };
    }
});

export default finalSpec;
