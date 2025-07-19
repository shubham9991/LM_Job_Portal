export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0]; // returns "YYYY-MM-DD"
};

