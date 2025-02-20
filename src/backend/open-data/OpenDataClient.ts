import { Readable } from 'stream';
import type { ReadableStream } from 'node:stream/web';
import openDataCatlog from '@/backend/open-data/openDataCatalog.json';

export class OpenDataClient {
  private static readonly baseUrl = `https://ckan0.cf.opendata.inter.prod-toronto.ca`;

  private static asQueryParams(
    queryParams: Record<string, number | string | null | boolean>,
  ) {
    return new URLSearchParams(
      Object.entries(queryParams) as [string, string][],
    );
  }

  private static expectOk(response: Response) {
    if (!response.ok) {
      throw new OpenDataClientError(
        `Failed to fetch ${response.url} with ${response.status}`,
      );
    }
  }

  private async apiFetch<T>(
    path: `/api/${string}`,
    init?: RequestInit,
  ): Promise<T> {
    const url = new URL(path, OpenDataClient.baseUrl);
    const response = await fetch(url, {
      ...init,
      headers: {
        accept: 'application/json',
        ...init?.headers,
      },
    });
    OpenDataClient.expectOk(response);
    try {
      return await response.json();
    } catch (cause) {
      throw new OpenDataClientError(`Received invalid JSON`, {
        cause,
      });
    }
  }

  public async showPackage(packageKey: keyof typeof openDataCatlog) {
    const id = openDataCatlog[packageKey];
    if (!id) {
      throw new OpenDataClientError(`Unknown package key "${packageKey}"`);
    }
    return await this.apiFetch<Package>(
      `/api/3/action/package_show?${OpenDataClient.asQueryParams({ id })}`,
    );
  }

  public async fetchDataset(url: string, init?: RequestInit) {
    if (!url.startsWith(OpenDataClient.baseUrl)) {
      throw new OpenDataClientError(
        `Provided URL "${url}" is not on expected origin "${OpenDataClient.baseUrl}"`,
      );
    }
    console.log('Fetching dataset', url);
    const response = await fetch(url, init);
    OpenDataClient.expectOk(response);
    if (!response.body) {
      throw new OpenDataClientError(
        `OpenDataClient found no response body for dataset ${url}`,
      );
    }
    return Readable.fromWeb(response.body as ReadableStream);
  }
}

export class OpenDataClientError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(`OpenDataClient: ${message}`, options);
  }
}

export type Package = {
  result: {
    last_refreshed: string;
    resources: Array<PackageResource>;
  };
};
export type PackageResource = {
  format: string;
  name: string;
  id: string;
  url: string;
  is_preview: boolean | null;
};
