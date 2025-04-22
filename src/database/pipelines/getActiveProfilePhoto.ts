import * as cheerio from 'cheerio';

// NOTE:  Can only scrape active council members, not past ones
// TODO: place file somewhere better
function parseWardHTML(html: string, councilMemberName: string) {
  const $ = cheerio.load(html);

  const headerName: string = $('#page-header--title').text().trim();

  const councilMemberNameToMatch = councilMemberName.toLowerCase().split(/\s+/);
  const wardHeaderNameToMatch = headerName.trim().toLowerCase();
  const isWardNameMatch = councilMemberNameToMatch.some((word) =>
    wardHeaderNameToMatch.includes(word)
  );

  if (!isWardNameMatch) {
    console.warn(
      `Warning: "${councilMemberName}" does not match council member name in site header "${headerName}".`
    );
    return null;
  }

  const imgUrl: string | undefined = $('#page-content > div img').attr('src');

  if (imgUrl) {
    console.log(`Retrieved image src URL for ${headerName}`);
  } else {
    console.log(`No image found for ${headerName}`);
  }

  return imgUrl;
}

export async function getMemberSitePortrait(
  wardNum: number | string | null,
  councilMemberName: string,
  primaryRole: string
): Promise<string | null> {
  let councilMemberUrl: URL;
  if (wardNum === null && primaryRole === 'Mayor') {
    councilMemberUrl = new URL(
      `https://www.toronto.ca/city-government/council/office-of-the-mayor/about-mayor/`
    );
  } else if (primaryRole === 'Councillor' && wardNum !== null) {
    councilMemberUrl = new URL(
      `https://www.toronto.ca/city-government/council/members-of-council/councillor-ward-${wardNum}/`
    );
  } else {
    throw new Error('Invalid primary role or missing ward number.');
  }

  try {
    const response = await fetch(councilMemberUrl);
    const pageHtml: string = await response.text();

    if (!response.ok) {
      throw new Error(
        `Failed to fetch toronto.ca council member page ${response.status}`
      );
    }

    const imgUrl: string | null =
      parseWardHTML(pageHtml, councilMemberName) ?? null;

    if (imgUrl) {
      console.log(
        `Retrieved image URL for council member ${councilMemberName}${
          wardNum !== null ? ` (Ward ${wardNum})` : ''
        }:`,
        imgUrl
      );
    } else {
      console.log(`No image found for ward ${wardNum}. Returning null`);
    }
    return imgUrl;
  } catch (error) {
    console.error('Error fetching img url for ward:', wardNum, error);
  }
  return null;
}
