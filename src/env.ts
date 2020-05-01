import dotenv from "dotenv";
dotenv.config();

interface Env extends NodeJS.ProcessEnv {
  NODE_ENV?: "development" | "production";
  REDIS_URL?: string;
  PORT?: string;
  CORS?: string;
  CORS_ALLOW_UNKNOWN_ORIGIN?: "true" | "false";
}

const {
  NODE_ENV,
  REDIS_URL,
  PORT,
  CORS,
  CORS_ALLOW_UNKNOWN_ORIGIN,
}: Env = process.env;
const VERSION: string = process.env.npm_package_version;

if (NODE_ENV === "development") {
  console.log({
    NODE_ENV,
    REDIS_URL,
    PORT,
    CORS,
    VERSION,
    CORS_ALLOW_UNKNOWN_ORIGIN,
  });
}

export { NODE_ENV, REDIS_URL, PORT, CORS, VERSION, CORS_ALLOW_UNKNOWN_ORIGIN };
