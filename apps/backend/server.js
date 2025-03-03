import Fastify from "fastify";
import dataRoutes from "./src/routes/dataRoutes.js";

const fastify = Fastify({ logger: true });

fastify.register(dataRoutes);

fastify.listen({ port: 4000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
