import { cityCouncilGet } from '@/api/cityCouncilRequest';

interface Member {
  apptEndDate: number; // Timestamp in milliseconds
  firstName: string;
  lastName: string;
  salutationCd?: string;
  memberUrl?: string;
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
  email?: string;
  duties?: string;
  dbdyStatusCd: string;
  phoneAreaCode?: string;
  phoneNumber?: string;
  faxAreaCode?: string;
  faxNumber?: string;
  webpostInd: string;
  contactFirstName?: string;
  contactLastName?: string;
  generalAddress?: string;
  decisionBodyPublishLabelCd: string;
  committeeCode: CommitteeCode;
  decisionBodyType: DecisionBodyType;
  term: Term;
  members: Member[];
}

interface DecisionBodyRecord {
  members: Member[];
  decisionBody: DecisionBody;
}

interface InidividualApiResponse {
  Record: DecisionBodyRecord;
}

export const fetchDecisionBody = async (id: number): Promise<DecisionBody> => {
  const response = await cityCouncilGet(
    `https://secure.toronto.ca/council/api/individual/decisionbody/${id}.json`,
  );

  const record = ((await response.json()) as InidividualApiResponse).Record;
  return { ...record.decisionBody, members: record.members };
};

export interface DecisionBodyBrief {
  decisionBodyId: number;
  decisionBodyName: string;
}

interface MultipleApiResponse {
  Records: DecisionBodyBrief[];
}

export const fetchDecisionBodies = async ({ termId }: { termId: number }) => {
  const response = await cityCouncilGet(
    `https://secure.toronto.ca/council/api/multiple/decisionbody-list.json?termId=${termId}`,
  );

  const decisionBodyIds = (
    (await response.json()) as MultipleApiResponse
  ).Records.map((r) => r.decisionBodyId);

  await new Promise((resolve) => setTimeout(resolve, 100));

  const result: Record<number, DecisionBody> = {};
  for (const id of decisionBodyIds) {
    result[id] = await fetchDecisionBody(id);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return result;
};
