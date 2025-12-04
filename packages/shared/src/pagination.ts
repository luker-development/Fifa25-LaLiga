export type PaginationParams = {
  page?: number;
  pageSize?: number;
  maxPageSize?: number;
};

export const buildPagination = ({ page = 1, pageSize = 20, maxPageSize = 100 }: PaginationParams) => {
  const safePageSize = Math.min(Math.max(pageSize, 1), maxPageSize);
  const safePage = Math.max(page, 1);
  return {
    take: safePageSize,
    skip: (safePage - 1) * safePageSize
  };
};
