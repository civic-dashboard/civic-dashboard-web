export const logAnalytics = async (
  eventName: string,
  eventData?: Record<string, unknown>,
) => {
  // eslint-disable-next-line no-restricted-globals
  if (typeof umami !== 'undefined') {
    // eslint-disable-next-line no-restricted-globals
    return await umami.track(eventName, eventData);
  }
};
