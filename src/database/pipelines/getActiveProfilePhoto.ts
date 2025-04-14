import * as cheerio from 'cheerio';

// NOTE:  Can only scrape active councillors, not past ones
// TODO: place file somewhere better, maybe @api/cityCouncilRequest.ts or sanitize.ts
function parseWardHTML(
  html: string,
  wardNum: number | string,
  wardName: string,
) {

    const $ = cheerio.load(html);

    const headerName: string = $('#page-header--title').text().trim() || `Ward ${wardNum}`;
    
    const wardNameToMatch = wardName.toLowerCase().split(/\s+/)
    const wardHeaderNameToMatch = headerName.trim().toLowerCase()
    const isWardNameMatch = wardNameToMatch.some(word => wardHeaderNameToMatch.includes(word))
    
    if(!isWardNameMatch){
        console.warn(`Warning: "${wardName}" does not match site councillor header name "${headerName}".`);
        return null;
    }
    
    const imgUrl: string | undefined = $('#page-content > div > p > img', '.page-content > div > p > img').attr('src');

    if (imgUrl) {
        console.log(`Retrieved image src URL for ${headerName}`);
    } else {
        console.log(`No image found for ${headerName}`);
    }

    return imgUrl;
}


export async function getMemberSitePortrait (
  wardNum: number | string,
  wardName: string,
) {
    
    const URL: string = `https://www.toronto.ca/city-government/council/members-of-council/councillor-ward-${wardNum}/`;

    try {
        const response = await fetch(URL); 
        const HTML: string | null = await response.text(); 

        console.log('Retriving img url for ward:', wardNum); 

        const imgUrl = parseWardHTML(HTML, wardNum, wardName); 

        if (imgUrl) {
            console.log(`Retrieved image URL for ward ${wardNum}: ${imgUrl}`);
            return imgUrl;
        }
    } catch (error) {
        console.error('Error fetching img url for ward:', wardNum, error);
    }
    };


