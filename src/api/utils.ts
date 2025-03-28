export const parseNumberParam = (
  searchParams: URLSearchParams,
  name: string,
) => {
  const param = searchParams.get(name);
  if (param === null) {
    return undefined;
  }
  return parseInt(param);
};

export const parseDateParam = (searchParams: URLSearchParams, name: string) => {
  const asNumber = parseNumberParam(searchParams, name);
  if (asNumber === undefined) {
    return asNumber;
  }
  return new Date(asNumber);
};
