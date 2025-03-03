import { pool } from "../database.js";
import { predictNextYield } from "../services/predictionService.js";
import { calculateCorrelation } from "../services/correlationService.js";
import { calculateAverage } from "../services/summaryService.js";

export default async function routes(fastify) {
  fastify.get("/data/weekly", async (request, reply) => {
    try {
      const result = await pool.query(`
        SELECT w.week_number, w.humidity, w.rainfall, w.temperature,
               y.strawberry_yield, r.reject_due_to_pest, r.reject_due_to_disease
        FROM weather_data w
        JOIN yield_data y ON w.week_number = y.week_number
        JOIN reject_data r ON w.week_number = r.week_number
        ORDER BY w.week_number;
      `);
      reply.send(result.rows);
    } catch (err) {
      reply
        .status(500)
        .send({ error: "Database query failed", details: err.message });
    }
  });

  fastify.get("/data/predict", async (request, reply) => {
    try {
      const result = await pool.query(`
        SELECT w.week_number, w.humidity, w.rainfall, w.temperature,
               y.strawberry_yield, r.reject_due_to_pest, r.reject_due_to_disease
        FROM weather_data w
        JOIN yield_data y ON w.week_number = y.week_number
        JOIN reject_data r ON w.week_number = r.week_number
        ORDER BY w.week_number;
      `);
      const data = result.rows;
      const predictions = predictNextYield(data);
      reply.send({ message: "Next week's forecast", predictions });
    } catch (err) {
      reply
        .status(500)
        .send({ error: "Prediction failed", details: err.message });
    }
  });

  fastify.get("/data/analysis", async (request, reply) => {
    try {
      const result = await pool.query(`
        SELECT w.week_number, w.humidity, w.rainfall, w.temperature,
               y.strawberry_yield, r.reject_due_to_pest, r.reject_due_to_disease
        FROM weather_data w
        JOIN yield_data y ON w.week_number = y.week_number
        JOIN reject_data r ON w.week_number = r.week_number
        ORDER BY w.week_number;
      `);

      const data = result.rows;
      const correlations = {
        humidity_yield: calculateCorrelation(
          data,
          "humidity",
          "strawberry_yield"
        ),
        rainfall_yield: calculateCorrelation(
          data,
          "rainfall",
          "strawberry_yield"
        ),
        temperature_yield: calculateCorrelation(
          data,
          "temperature",
          "strawberry_yield"
        ),
        humidity_reject: calculateCorrelation(
          data,
          "humidity",
          "reject_due_to_pest"
        ),
        rainfall_reject: calculateCorrelation(
          data,
          "rainfall",
          "reject_due_to_pest"
        ),
        temperature_reject: calculateCorrelation(
          data,
          "temperature",
          "reject_due_to_disease"
        ),
      };

      reply.send({
        message: "Weather impact on yield and reject rates",
        insights: data,
        correlations,
      });
    } catch (err) {
      reply
        .status(500)
        .send({ error: "Analysis failed", details: err.message });
    }
  });

  fastify.get("/data/summary", async (request, reply) => {
    try {
      const result = await pool.query(`
        SELECT w.humidity, w.rainfall, w.temperature,
               y.strawberry_yield, r.reject_due_to_pest, r.reject_due_to_disease
        FROM weather_data w
        JOIN yield_data y ON w.week_number = y.week_number
        JOIN reject_data r ON w.week_number = r.week_number;
      `);

      const data = result.rows;
      const summary = {
        avg_yield_by_humidity: calculateAverage(
          data,
          "humidity",
          "strawberry_yield"
        ),
        avg_yield_by_rainfall: calculateAverage(
          data,
          "rainfall",
          "strawberry_yield"
        ),
        avg_yield_by_temperature: calculateAverage(
          data,
          "temperature",
          "strawberry_yield"
        ),
        avg_reject_by_humidity: calculateAverage(
          data,
          "humidity",
          "reject_due_to_pest"
        ),
        avg_reject_by_rainfall: calculateAverage(
          data,
          "rainfall",
          "reject_due_to_pest"
        ),
        avg_reject_by_temperature: calculateAverage(
          data,
          "temperature",
          "reject_due_to_pest"
        ),
        avg_disease_by_humidity: calculateAverage(
          data,
          "humidity",
          "reject_due_to_disease"
        ),
        avg_disease_by_rainfall: calculateAverage(
          data,
          "rainfall",
          "reject_due_to_disease"
        ),
        avg_disease_by_temperature: calculateAverage(
          data,
          "temperature",
          "reject_due_to_disease"
        ),
      };

      reply.send({ message: "Weather-based summary statistics", summary });
    } catch (err) {
      reply.status(500).send({
        error: "Summary statistics calculation failed",
        details: err.message,
      });
    }
  });
}
