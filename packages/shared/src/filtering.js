export const buildLikeFilter = (value) => value ? { contains: value, mode: 'insensitive' } : undefined;
export const mapFilters = (query, allowed) => {
    return Object.entries(allowed).reduce((acc, [param, field]) => {
        if (query[param] !== undefined && query[param] !== '') {
            acc[field] = query[param];
        }
        return acc;
    }, {});
};
