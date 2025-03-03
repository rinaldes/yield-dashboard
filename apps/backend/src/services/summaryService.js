export function calculateAverage(data, groupBy, targetKey) {
  const groups = {};

  data.forEach((point) => {
    const key = point[groupBy];
    if (!groups[key]) groups[key] = { sum: 0, count: 0 };

    groups[key].sum += point[targetKey];
    groups[key].count++;
  });

  return Object.keys(groups).map((key) => ({
    [groupBy]: key,
    [`avg_${targetKey}`]: (groups[key].sum / groups[key].count).toFixed(2),
  }));
}
