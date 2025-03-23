/** Allows TS to be certain about if the input is null */
export const isNotNull = <T>(input: T | null): input is T => input !== null;

/** Allows TS to be certain about if the input is null or undefined*/
export const isNotNullish = <T>(input: T | null | undefined): input is T =>
  input !== null && input !== undefined;
