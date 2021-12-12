interface IPagination {
  current: number;
  pageSize: number;
  total: number;
}

interface ILimitOffset {
  limit: number;
  offset: number;
  total: number;
}

export const paginationToLimit = ({
  current,
  pageSize,
  total,
}: IPagination): ILimitOffset => {
  return {
    limit: pageSize,
    offset: (current - 1) * pageSize,
    total,
  };
};

export const limitToPagination = ({
  limit,
  offset,
  total,
}: ILimitOffset): IPagination => {
  return {
    current: Math.floor(offset / limit) + 1,
    pageSize: limit,
    total,
  };
};
