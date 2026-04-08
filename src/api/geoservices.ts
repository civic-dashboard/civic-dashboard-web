/**
 * Fetches ward IDs for a given postal code from the Toronto Geoservices API.
 */
export async function fetchWardsForPostalCode(
  postalCode: string,
): Promise<string[]> {
  const cleaned = postalCode.trim().replace(/\s+/g, '').toLowerCase();
  if (cleaned.length < 5) {
    return [];
  }

  const apiUrl = `https://map.toronto.ca/geoservices/rest/search/rankedsearch?searchArea=1&matchType=1&projectionType=1&retRowLimit=50&areaTypeCode1=CITW&areaTypeCode2=WD03&searchString=${encodeURIComponent(cleaned)}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch from Toronto Geoservices');
  }

  const data = await response.json();
  const results = [
    ...(data.result?.bestResult || []),
    ...(data.result?.likelyResults || []),
  ];

  const wardIds = new Set<string>();
  for (const result of results) {
    if (result.detail) {
      const wardMatch = result.detail.match(/\((\d+)\)/);
      if (wardMatch) {
        wardIds.add(wardMatch[1]);
      }
    }
  }

  return Array.from(wardIds);
}
