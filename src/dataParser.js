export const parseCSV = async () => {
  const response = await fetch('/data.csv');
  const text = await response.text();

  const rows = text.split('\n').slice(1);
  return rows.map(row => {
    const [id, building, coordinates, area_value] = row.split(',');
    return {
      id: id.trim(),
      building: building.trim(),
      area_value: area_value.trim(),
      coordinates: JSON.parse(coordinates)
    };
  });
};
