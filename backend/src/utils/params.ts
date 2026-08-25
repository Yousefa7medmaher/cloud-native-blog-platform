export const getParam = (value: string | string[]): string =>
  Array.isArray(value) ? value[0] : value;

export const getQuery = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
};
