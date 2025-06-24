import { toSlug } from '@/logic/toSlug';

/**
 * Finds a term e.g. "2024-2026" within a larger string
 * Throws if there is no term, or more than one term within the text
 * @param text to search within e.g. "Lorem ipsum 2024-2026 dolor isut"
 * @returns a term string e.g. "2024-2026"
 */
export function extractTermFromText(text: string): string {
  const groups = text.match(/\d\d\d\d-\d\d\d\d/g);
  if (!groups?.length) {
    throw new Error(`Input contains no Terms "${text}"`);
  }
  if (groups.length > 1) {
    throw new Error(`Input contains multiple Terms "${text}"`);
  }
  return groups[0]!;
}

/**
 * Combines first and last name into one, throwing if either is missing
 * @param firstName
 * @param lastName
 * @returns Combined name
 */
export function toContactName(firstName: string, lastName: string) {
  const trimmedFirstName = firstName.trim();
  if (!trimmedFirstName)
    throw new Error(`Cannot create contact name with firstName "${firstName}"`);

  const trimmedLastName = lastName.trim();
  if (!trimmedLastName)
    throw new Error(`Cannot create contact name with lastName "${lastName}"`);

  return `${trimmedFirstName} ${trimmedLastName}`;
}

/**
 * Grabs the mover and seconders from the agenda item title if possible.
 * @param agendaItemTitle
 * @returns
 */
export function extractDataFromTitle(agendaItemTitle: string) {
  let [firstPart, byLine] = agendaItemTitle.split(/ - by /i);
  if (!byLine) {
    // Handles cases where the word by is missing e.g."XYZ - Councillor ABC"
    [firstPart, byLine] = agendaItemTitle.split(/ - councillor /i);
  }
  if (!byLine) {
    return {
      title: agendaItemTitle.trim(),
      movedBy: null,
      secondedBy: null,
    };
  }
  const [movedByRaw, secondedByRaw] = byLine.split(/, seconded by/i);
  return {
    title: firstPart.trim(),
    movedBy: getCleanCouncillorSlug(movedByRaw),
    secondedBy: secondedByRaw
      .split(',')
      .map((chunk) => getCleanCouncillorSlug(chunk)),
  };
}

function getCleanCouncillorSlug(approximateName: string) {
  const cleanName = approximateName
    .replace(/,/g, '')
    .replace(/\bcouncillor\b/gi, '')
    .replace(/\bcouncilor\b/gi, '')
    .replace(/\bmayor\b/gi, '')
    .replace(/\bdeputy\b/gi, '')
    .replace(/\band\b/gi, '')
    .trim();
  if (!cleanName)
    throw new Error(
      `Failed to extract councillor slug from "${approximateName}"`,
    );
  return toSlug(cleanName);
}

// function normalizeTextCharsSymbols(text: string): string {
//   const replacements: Record<string, string> = {
//     '&': 'and',
//     '@': 'at',
//     '€': 'euro',
//     '£': 'pound',
//     '°': 'degree',
//     $: 'dollar',
//     '%': 'percent',
//     '§': 'section',
//     '#': 'number',
//     '-': ' ',
//     _: ' ',
//   };

//   const regex = new RegExp(Object.keys(replacements).join('|'), 'g');

//   const normalizedText = text
//     .replace(regex, (match) => replacements[match] || match)
//     .replace(/\s+/g, ' ')
//     .trim();

//   return normalizedText.length > 0 ? normalizedText : text;
// }

// function explodeSubjectTerms(textInput: string): string[] {
//   // Split on semicolons and brackets
//   return textInput
//     .split(/[({[\]});,]+/g)
//     .map((text) => text.trim())
//     .filter(Boolean);
// }

// export function processSubjectTerms(
//   subjectTerms: string,
// ): { raw: string; normalized: string }[] {
//   if (subjectTerms.length === 0)
//     throw new Error(`Can't process empty subject terms`);

//   // Explode on semicolons and commas
//   const explodeTerms = explodeSubjectTerms(subjectTerms);

//   // Return both raw and normalized term
//   return explodeTerms.map((term) => ({
//     raw: term,
//     normalized: normalizeTextCharsSymbols(term),
//   }));
// }

function normalizeTextCharsSymbols(text: string): string {
  const replacements: Record<string, string> = {
    '&': 'and',
    '@': 'at',
    '€': 'euro',
    '£': 'pound',
    '°': 'degree',
    $: 'dollar',
    '%': 'percent',
    '§': 'section',
    '#': 'number',
    '-': ' ', // Not sure if this is desirable
    _: ' ', // Not sure if this is desirable
  };

  const regex = new RegExp(Object.keys(replacements).join('|'), 'g');

  const normalizedText = text
    .replace(regex, (match) => replacements[match] || match)
    .replace(/\s+/g, ' ')
    .trim();

  return normalizedText.length > 0 ? normalizedText : text;
}

function extractBracketTerms(text: string): string[] {
  // Match text wrapped in brackets:(), {}, []
  const matches = [...text.matchAll(/[([{]([^)\]}]*)[)\]}]/g)];
  // Remove bracketed terms, returns "" if only contains bracketed terms
  const unbracketedTerms = text.replace(/[([{][^)\]}]*[)\]}]/g, '').trim();

  // Get bracketed terms and trim spaces
  const extractedTerms = matches
    .map((match) => match[1].trim())
    .filter((term) => term.length > 0);

  // Remove brackets
  const cleanedTerms =
    unbracketedTerms.length > 0
      ? [unbracketedTerms, ...extractedTerms]
      : extractedTerms;

  return cleanedTerms;
}

function explodeSubjectTerms(subjectTerms: string): string[] {
  // Split on semicolons wrapped in brackets
  return subjectTerms
    .split(/[;,]/g)
    .map((term) => term.trim())
    .filter((term) => term.length > 0);
}

export function processSubjectTerms(
  subjectTerms: string,
): { raw: string; normalized: string }[] {
  if (subjectTerms.length === 0)
    throw new Error(`Can't process empty subject terms`);

  // Explode on semicolons and commas
  const explodeTerms: string[] = explodeSubjectTerms(subjectTerms);

  // Explode terms contain in brackets
  const refinedTerms: string[] = explodeTerms.flatMap((term) =>
    extractBracketTerms(term),
  );

  // Return both raw and normalized term
  return refinedTerms.map((term) => ({
    raw: term,
    normalized: normalizeTextCharsSymbols(term),
  }));
}
