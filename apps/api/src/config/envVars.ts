export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined");
}

export const API_PORT = process.env.API_PORT;
if (!API_PORT) {
    throw new Error("API_PORT is not defined");
}

export const MONGODB_STRING = process.env.MONGODB_STRING;
if (!MONGODB_STRING) {
    throw new Error("MONGODB_STRING is not defined");
}

export const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
    throw new Error("NODE_ENV is not defined");
}

export const PUBLIC_API_URL = process.env.PUBLIC_API_URL;
if (!PUBLIC_API_URL) {
    throw new Error("PUBLIC_API_URL is not defined");
}
