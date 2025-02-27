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
