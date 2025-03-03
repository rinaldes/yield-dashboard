function predictNextWeather(data, key) {
  if (data.length < 2) return null;

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  data.forEach((point, index) => {
    sumX += index;
    sumY += point[key];
    sumXY += index * point[key];
    sumXX += index * index;
  });

  const slope =
    (data.length * sumXY - sumX * sumY) / (data.length * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / data.length;

  return Math.round(intercept + slope * data.length);
}

function predictNextYield(data) {
  if (data.length < 2) return null;

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  let sumH = 0,
    sumR = 0,
    sumT = 0,
    sumPest = 0,
    sumDisease = 0;
  let sumHY = 0,
    sumRY = 0,
    sumTY = 0,
    sumPY = 0,
    sumDY = 0;

  data.forEach(
    ({
      week_number,
      humidity,
      rainfall,
      temperature,
      strawberry_yield,
      reject_due_to_pest,
      reject_due_to_disease,
    }) => {
      sumX += week_number;
      sumY += strawberry_yield;
      sumH += humidity;
      sumR += rainfall;
      sumT += temperature;
      sumPest += reject_due_to_pest;
      sumDisease += reject_due_to_disease;
      sumXY += week_number * strawberry_yield;
      sumHY += humidity * strawberry_yield;
      sumRY += rainfall * strawberry_yield;
      sumTY += temperature * strawberry_yield;
      sumPY += reject_due_to_pest * strawberry_yield;
      sumDY += reject_due_to_disease * strawberry_yield;
      sumXX += week_number * week_number;
    }
  );

  const n = data.length;
  const coefficients = [
    (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX),
    (n * sumHY - sumH * sumY) / (n * sumXX - sumH * sumH),
    (n * sumRY - sumR * sumY) / (n * sumXX - sumR * sumR),
    (n * sumTY - sumT * sumY) / (n * sumXX - sumT * sumT),
    (n * sumPY - sumPest * sumY) / (n * sumXX - sumPest * sumPest),
    (n * sumDY - sumDisease * sumY) / (n * sumXX - sumDisease * sumDisease),
  ];

  const intercept =
    (sumY -
      coefficients.reduce(
        (acc, m, i) =>
          acc + m * [sumX, sumH, sumR, sumT, sumPest, sumDisease][i],
        0
      )) /
    n;

  const nextWeek = data[n - 1].week_number + 1;

  const predicted_weather = {
    humidity: predictNextWeather(data, "humidity"),
    rainfall: predictNextWeather(data, "rainfall"),
    temperature: predictNextWeather(data, "temperature"),
  };

  const predicted_reject = {
    reject_due_to_pest: predictNextWeather(data, "reject_due_to_pest"),
    reject_due_to_disease: predictNextWeather(data, "reject_due_to_disease"),
  };

  const predictions = {
    next_week: nextWeek,
    predicted_weather,
    predicted_reject,
    predicted_yield: Math.round(
      coefficients.reduce(
        (acc, m, i) =>
          acc +
          m *
            [
              nextWeek,
              ...Object.values(predicted_weather),
              ...Object.values(predicted_reject),
            ][i],
        intercept
      )
    ),
  };

  return predictions;
}

export { predictNextYield };
