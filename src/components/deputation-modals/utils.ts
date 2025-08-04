export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Copied the text: ' + text);
  } catch (err) {
    alert('Could not copy this text automatically to the clipboard');
    console.error(err);
  }
};

export const makeMailtoLink = ({
  email,
  subject,
  body,
}: {
  email: string;
  subject: string;
  body: string;
}) => {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
