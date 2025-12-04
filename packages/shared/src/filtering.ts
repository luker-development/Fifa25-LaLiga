type FilterConfig = Record<string, string>;

export const buildLikeFilter = (value?: string) =>
  value ? { contains: value, mode: 'insensitive' as const } : undefined;

export const mapFilters = (query: Record<string, any>, allowed: FilterConfig) => {
  return Object.entries(allowed).reduce<Record<string, unknown>>((acc, [param, field]) => {
    if (query[param] !== undefined && query[param] !== '') {
      acc[field] = query[param];
    }
    return acc;
  }, {});
};
