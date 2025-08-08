export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Copied the text: ' + text);
  } catch (error) {
    console.error('Error trying to copy to clipboard', error);
    alert('Could not copy this text automatically to the clipboard');
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
