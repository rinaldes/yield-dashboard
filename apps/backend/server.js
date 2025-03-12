import Fastify from "fastify";
import cors from "@fastify/cors";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

fastify.decorate("prisma", prisma);

fastify.addHook("onClose", async (instance) => {
  await instance.prisma.$disconnect();
});

fastify.register(cors, {
  origin: "https://yield-dashboard-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// Function to automatically register routes
async function registerRoutes() {
  const routesDir = path.join(__dirname, "src", "routes");

  try {
    const files = await readdir(routesDir);

    for (const file of files) {
      if (file.endsWith("Routes.js")) {
        const routePath = path.join(routesDir, file);
        const routeModule = await import(routePath);
        fastify.register(routeModule.default);
        console.log(`✅ Registered routes from: ${file}`);
      }
    }
  } catch (error) {
    console.error("❌ Error registering routes:", error);
    process.exit(1);
  }
}

// Register routes and start server
registerRoutes().then(() => {
  fastify.listen({ port: 4000, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error("❌ Server failed to start:", err);
      process.exit(1);
    }
    console.log(`🚀 Server running at ${address}`);
  });
});
