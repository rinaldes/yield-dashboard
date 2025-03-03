import Fastify from "fastify";
import cors from "@fastify/cors";
import dataRoutes from "./src/routes/dataRoutes.js";

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: [
    "https://yield-dashboard-production.up.railway.app",
    "https://rinal.dev/yield-dashboard",
  ], // Replace with your actual Vercel domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

fastify.register(dataRoutes);

fastify.listen({ port: 4000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
