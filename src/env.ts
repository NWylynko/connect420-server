import dotenv from "dotenv"; 
dotenv.config();

interface Env extends NodeJS.ProcessEnv {
  NODE_ENV?: 'development' | 'production';
  REDIS_URL?: string;
  PORT?: string;
  CORS?: string;
}

const { NODE_ENV, REDIS_URL, PORT, CORS } : Env = process.env
const VERSION: string = process.env.npm_package_version


if (NODE_ENV === 'development') {
  console.log({NODE_ENV, REDIS_URL, PORT, CORS, VERSION})
}

export { NODE_ENV, REDIS_URL, PORT, CORS, VERSION }