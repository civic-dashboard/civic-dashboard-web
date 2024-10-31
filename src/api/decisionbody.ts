interface Member {
  apptEndDate: number; // Timestamp in milliseconds
  firstName: string;
  lastName: string;
  salutationCd: string;
  memberUrl: string;
  apptStartDate: number; // Timestamp in milliseconds
  memberId: number;
}

interface CommitteeCode {
  committeeCodeId: number;
  committeeCode: string;
}

interface DecisionBodyType {
  tier: number;
}

interface Term {
  termId: number;
  termType: string;
  trmStartDate: number; // Timestamp in milliseconds
  trmEndDate: number; // Timestamp in milliseconds
}

export interface DecisionBody {
  decisionBodyId: number;
  committeeCodeId: number;
  termId: number;
  decisionBodyName: string;
  email: string;
  duties: string;
  dbdyStatusCd: string;
  phoneAreaCode: string;
  phoneNumber: string;
  faxAreaCode: string;
  faxNumber: string;
  webpostInd: string;
  contactFirstName: string;
  contactLastName: string;
  generalAddress: string;
  decisionBodyPublishLabelCd: string;
  committeeCode: CommitteeCode;
  decisionBodyType: DecisionBodyType;
  term: Term;
}

interface Record {
  members: Member[];
  decisionBody: DecisionBody;
}

interface ApiResponse {
  Record: Record;
}

export const fetchDecisionBody = async (id: number) => {
  const response = await fetch(
    `https://secure.toronto.ca/council/api/individual/decisionbody/${id}.json`,
    {
      credentials: 'include',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64; rv:129.0) Gecko/20100101 Firefox/129.0',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
      referrer: 'https://secure.toronto.ca/council/',
      method: 'GET',
      mode: 'cors',
    }
  );
  return ((await response.json()) as ApiResponse).Record.decisionBody;
};
