export const alphanumeric = (length: number): string => {
  if (length > 10) return alphanumeric(length - 10) + alphanumeric(10);

  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
};
