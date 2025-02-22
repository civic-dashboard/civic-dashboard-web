export const createColumnMapper =
  (headerMappings: Record<string, string>) =>
  (receivedHeaders: unknown[]): string[] => {
    const expectedHeaders = Object.keys(headerMappings);
    const aliasedHeaders = receivedHeaders.map((receivedHeader: unknown) => {
      if (typeof receivedHeader !== 'string') {
        throw new Error(`Non-string in CSV header "${receivedHeader}"`, {
          cause: {
            receivedHeader,
            receivedHeaderType: typeof receivedHeader,
            expectedHeaders,
          },
        });
      }
      if (!Object.hasOwn(headerMappings, receivedHeader)) {
        throw new Error(`Unexpected column in CSV "${receivedHeader}"`, {
          cause: {
            receivedHeader,
            receivedHeaders,
            expectedHeaders,
          },
        });
      }
      return headerMappings[receivedHeader];
    });

    if (aliasedHeaders.length !== expectedHeaders.length) {
      const missingHeaders = expectedHeaders.filter(
        (expectedColumn) => !receivedHeaders.includes(expectedColumn),
      );
      console.warn(`Missing headers in CSV`, {
        missingHeaders,
        expectedHeaders,
      });
    }

    return aliasedHeaders;
  };

type ValueOf<T> = T[keyof T];
export type CsvRow<T extends Record<string, string>> = Partial<
  Record<ValueOf<T>, string | null>
>;

export const verifyFieldsAreNotNullish = <T>(
  requiredFields: ReadonlyArray<keyof T>,
  target: Partial<T>,
): target is { [key in keyof T]: Exclude<T[key], null | undefined> } => {
  for (const field of requiredFields) {
    if (target[field] === null || target[field] === undefined) return false;
  }
  return true;
};

export const isTextNullish = (text: string) => {
  switch (text.toLocaleLowerCase().trim()) {
    case '':
    case 'null':
    case 'none':
    case 'nil':
      return true;
    default:
      return false;
  }
};

export const castNullishText = (
  text: string | null | undefined,
): string | null => {
  if (!text) return null;
  if (isTextNullish(text)) return null;
  return text;
};
