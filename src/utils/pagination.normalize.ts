export const paginationNormalizer = (page: number, limit: number) => {
  return {
    page: isNaN(page) ? 1 : page,
    limit: isNaN(limit) ? 10 : limit,
  };
};
