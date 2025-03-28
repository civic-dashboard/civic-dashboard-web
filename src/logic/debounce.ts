// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <FnType extends (...args: any[]) => void>(
  callback: FnType,
  delay: number,
) => {
  let timeoutId: number | null = null;
  return {
    debounced: (...args: Parameters<FnType>) => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    immediate: (...args: Parameters<FnType>) => {
      if (timeoutId) window.clearTimeout(timeoutId);
      callback(...args);
    },
    cancel: () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    },
  };
};
