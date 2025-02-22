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
