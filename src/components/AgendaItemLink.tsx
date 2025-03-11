import { ExternalLink, ExternalLinkProps } from '@/components/ExternalLink';

export type AgendaItemLinkProps = Omit<ExternalLinkProps, 'href'> & {
  agendaItemNumber: string;
};

export const AgendaItemLink = (props: AgendaItemLinkProps) => {
  const { agendaItemNumber, ...linkProps } = props;
  const params = new URLSearchParams({ item: agendaItemNumber });
  const href = `https://secure.toronto.ca/council/agenda-item.do?${params}`;
  return <ExternalLink {...linkProps} href={href} />;
};
