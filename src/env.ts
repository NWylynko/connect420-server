import dotenv from "dotenv";
dotenv.config();
import log from "./logger.js";

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
  log.info(`--- env ---`);
  log.info(`NODE_ENV: ${NODE_ENV}`);
  log.info(`REDIS_URL: ${REDIS_URL}`);
  log.info(`PORT: ${PORT}`);
  log.info(`CORS: ${CORS}`);
  log.info(`VERSION: ${VERSION}`);
  log.info(`CORS_ALLOW_UNKNOWN_ORIGIN: ${CORS_ALLOW_UNKNOWN_ORIGIN}`);
  log.info(`-----------`);
}

export { NODE_ENV, REDIS_URL, PORT, CORS, VERSION, CORS_ALLOW_UNKNOWN_ORIGIN };
