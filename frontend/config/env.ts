const _env = {
  ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  BACKEND_DEVELOPMENT_URL: process.env.NEXT_PUBLIC_BACKEND_DEVELOPMENT_URL,
};

const env = Object.freeze(_env);
export default env;
