import nodeFetch from 'node-fetch';

type Args = {
  url: string;
  body?: BodyInit;
};

export const cityCouncilGet = async (url: string) => {
  return await fetch(url, {
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
    },
    method: 'GET',
    mode: 'cors',
  });
};

export const cityCouncilXSRFPost = async ({ url, body }: Args) => {
  // for some reason next's fetch does not receive the XSRF token
  const csrfResponse = await nodeFetch(
    'https://secure.toronto.ca/council/api/csrf.json',
  );

  const cookies = csrfResponse.headers.get('set-cookie');
  const xsrfToken = csrfResponse.headers
    .raw()
    ['set-cookie'].find((value) => value.startsWith('XSRF-TOKEN'))
    ?.match(/XSRF-TOKEN=([^;]+)/)
    ?.at(1);

  if (!cookies || !xsrfToken) {
    throw new Error(
      `Could not get XSRF token from council API: ${csrfResponse.headers.raw()}`,
    );
  }

  return await fetch(url, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/json',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      'X-XSRF-TOKEN': xsrfToken,
      Cookie: cookies,
    },
    body,
    method: 'POST',
    mode: 'cors',
  });
};
