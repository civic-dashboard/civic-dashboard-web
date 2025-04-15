import * as cheerio from 'cheerio';

// NOTE:  Can only scrape active councillors, not past ones
// TODO: place file somewhere better
function parseWardHTML(
  html: string,
  wardNum: number | string,
  wardName: string,
) {
  const $ = cheerio.load(html);

  const headerName: string =
    $('#page-header--title').text().trim() || `Ward ${wardNum}`;

  const wardNameToMatch = wardName.toLowerCase().split(/\s+/);
  const wardHeaderNameToMatch = headerName.trim().toLowerCase();
  const isWardNameMatch = wardNameToMatch.some((word) =>
    wardHeaderNameToMatch.includes(word),
  );

  if (!isWardNameMatch) {
    console.warn(
      `Warning: "${wardName}" does not match site councillor header name "${headerName}".`,
    );
    return null;
  }

  const imgUrl: string | undefined = $(
    '#page-content > div > p > img, #page-content > div > h2 > img',
  ).attr('src');

  if (imgUrl) {
    console.log(`Retrieved image src URL for ${headerName}`);
  } else {
    console.log(`No image found for ${headerName}`);
  }

  return imgUrl;
}

export async function getMemberSitePortrait(
  wardNum: number | string,
  wardName: string,
): Promise<string | null> {
  const councillorUrl = `https://www.toronto.ca/city-government/council/members-of-council/councillor-ward-${wardNum}/`;

  try {
    const response = await fetch(councillorUrl);
    const pageHtml: string = await response.text();

    if (!response.ok) {
      throw new Error(
        `Failed to fetch toronto.ca councillor page ${response.status}`,
      );
    }

    console.log('Retrieving img url for ward:', wardNum);

    const imgUrl: string | null =
      parseWardHTML(pageHtml, wardNum, wardName) ?? null;

    if (imgUrl) {
      console.log(`Retrieved image councillorUrl for ward ${wardNum}:`, imgUrl);
    } else {
      console.log(`No image found for ward ${wardNum}. Returning null`);
    }
    return imgUrl;
  } catch (error) {
    console.error('Error fetching img url for ward:', wardNum, error);
  }
  return null;
}
