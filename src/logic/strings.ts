export const sentenceCase = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatAgendaItemStatus = (
  status: string | null | undefined,
): string => {
  if (!status) return '';

  const statusMap: Record<string, string> = {
    CONFRMED: 'Confirmed',
    DEEMADPT: 'Deemed Adopted',
    DEFERIND: 'Deferred Indefinitely',
    INT_FAIL: 'Intro Failed',
    NOQUORUM: 'No Quorum',
    NOTADOPT: 'Not Adopted',
    NO_ACTN: 'No Action is Required',
    WO_RECS: 'Without Recommendations',
    OOORDER: 'Out of Order',
    POSTPONE: 'Deferred',
    RESCIND: 'Rescinded',
    WITHDRAW: 'Withdrawn',
  };

  return statusMap[status] || sentenceCase(status);
};
