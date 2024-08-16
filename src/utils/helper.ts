export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
