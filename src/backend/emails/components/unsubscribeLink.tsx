import { Link } from '@react-email/components';

type Props = React.PropsWithChildren<{
  unsubscribeToken: string;
}>;
export const UnsubscribeLink = ({ unsubscribeToken, children }: Props) => {
  return (
    <Link
      href={`${process.env.HOSTNAME_FOR_EMAIL_LINKS}/subscription/${unsubscribeToken}`}
    >
      {children}
    </Link>
  );
};
