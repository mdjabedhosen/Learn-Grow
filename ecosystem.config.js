const path = require("path");

module.exports = {
  apps: [
    {
      name: "next-app",
      script: ".next/standalone/server.js",
      cwd: path.join(__dirname, "learn-grow"),
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
    {
      name: "backend-api",
      script: "dist/server.js",
      cwd: path.join(__dirname, "grow-backend"),
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};
