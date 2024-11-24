import { cityCouncilGet, cityCouncilXSRFPost } from '@/api/cityCouncilRequest';

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

interface InidividualApiResponse {
  Record: Record;
}

export const fetchDecisionBody = async (id: number) => {
  const response = await cityCouncilGet(
    `https://secure.toronto.ca/council/api/individual/decisionbody/${id}.json`
  );

  return ((await response.json()) as InidividualApiResponse).Record
    .decisionBody;
};
  );
  return ((await response.json()) as ApiResponse).Record.decisionBody;
};
