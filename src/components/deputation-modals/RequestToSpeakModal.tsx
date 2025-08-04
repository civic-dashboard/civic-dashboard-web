'use client';

import { DecisionBody } from '@/api/decisionBody';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { AgendaItem } from '@/database/queries/agendaItems';
import { CopyIcon, ExternalLink, InfoIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReadonlyTextField } from '@/components/deputation-modals/ReadOnlyTextField';

interface Props {
  agendaItem: AgendaItem;
  decisionBody: DecisionBody;
  trigger: ReactNode;
}

function InlineFieldset({ children }: { children: ReactNode }) {
  return (
    <fieldset className="flex flex-col md:flex-row items-center">
      {children}
    </fieldset>
  );
}

export function RequestToSpeakModal({
  agendaItem,
  decisionBody,
  trigger,
}: Props) {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');

  const nameLabel = 'Name:';
  const organizationLabel = 'Organization (if applicable):';
  const addressLabel = 'Mailing Address:';
  const telephoneLabel = 'Telephone:';

  const formattedDate = new Date(agendaItem.meetingDate).toLocaleString(
    'default',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  );
  const subject = `Request to appear before ${formattedDate} ${decisionBody.decisionBodyName} on item ${agendaItem.agendaItemId}`;
  const bodyStartParagraphs = [
    'To the City Clerk:',
    `I would like to appear before the ${formattedDate} ${decisionBody.decisionBodyId} to speak on item ${agendaItem.reference}, ${agendaItem.agendaItemTitle}.`,
  ];
  const getFullBodyText = () => {
    const fields = [`${nameLabel} ${name}`];

    if (organization.trim()) {
      fields.push(`${organizationLabel} ${organization}`);
    }

    fields.push(`${addressLabel} ${address}`);
    fields.push(`${telephoneLabel} ${telephone}`);

    const textArray = [...bodyStartParagraphs, fields.join('\n')];
    return textArray.join('\n\n');
  };
  const makeMailtoLink = () => {
    const body = getFullBodyText();
    return `mailto:${decisionBody.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied the text: ' + text);
    } catch (err) {
      alert('Could not copy this text automatically to the clipboard');
      console.error(err);
    }
  };
  const copySubjectText = async () => copyToClipboard(subject);
  const copyBodyText = async () => copyToClipboard(getFullBodyText());

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex flex-col w-full md:max-w-4xl max-h-screen md:h-[calc(100vh-4rem)] overflow-y-scroll">
        <h1 className="text-2xl leading-snug">
          Request to speak on
          <br />
          <span className="inline-block font-semibold pt-1">
            {agendaItem.agendaItemTitle}
          </span>
        </h1>
        <div className="mb-4 border rounded p-4 bg-blue-900/50">
          <h2 className="text-lg flex items-center">
            <InfoIcon className="mr-2" /> How to use this page
          </h2>
          <p>
            When you request to speak, you are requesting to go to the meeting
            later to share your comments live in person. This form helps you put
            together the initial request to speak, which is sent via email.
          </p>
          <ol className="list-decimal mt-2 pl-4">
            <li className="ml-4">Fill out the form</li>
            <li className="ml-4">
              Use the Copy buttons to copy the text into your email client of
              choice, and send it off! Or use the Create Email button, which
              will automatically open your email client with the text already
              filled in for you.
            </li>
          </ol>
          <p>
            {/* When you request to speak, your name, e-mail, mailing address become part of the record of the meeting.
  - The day of the meeting, your name will appear on the "Speakers List" which is posted online
  - If you choose to speak, you will appear in the live broadcast and video archive of the meeting
  - Your name will appear online in the meeting minutes
  - For certain items, we will share your information with third-parties like the Local Planning Appeal Tribunal as required by law

We are collecting your information under the authority of the Toronto Municipal Code Chapter 27, Council Procedures or any other applicable procedural By-law. As permitted under Section 27 of the Municipal Freedom of Information and Privacy Act, we are collecting this information to create a public record. Information in public records is not subject to privacy requirements. Have questions? Call or write: 416-392-8016 or clerk@toronto.ca

To learn more about speaking to committees, visit: toronto.ca/council */}
          </p>
        </div>
        <div className="mb-4">
          <ReadonlyTextField
            id="agendaRef"
            label="Agenda reference #:"
            value={agendaItem.reference}
          />
          <ReadonlyTextField
            id="meetingDate"
            label="Meeting date:"
            value={formattedDate}
          />
          <ReadonlyTextField
            id="decisionBody"
            label="Decision body:"
            value={decisionBody.decisionBodyName}
          />
        </div>
        <div className="">
          {/* email subject */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Email subject</h2>
            <div className="text-base">{subject}</div>
          </div>
          {/* email body */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Email body</h2>
            {bodyStartParagraphs.map((s, i) => (
              <p key={i} className="mb-3">
                {s}
              </p>
            ))}
            {/* fields */}
            <InlineFieldset>
              <label className="" htmlFor="name">
                {nameLabel}
              </label>
              <Input
                className="w-auto"
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InlineFieldset>
            <InlineFieldset>
              <label className="" htmlFor="organization">
                {organizationLabel}
              </label>
              <Input
                className="w-auto"
                id="organization"
                type="text"
                placeholder="Your organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </InlineFieldset>
            <InlineFieldset>
              <label className="" htmlFor="address">
                {addressLabel}
              </label>
              <Input
                className="w-auto"
                id="address"
                type="text"
                placeholder="Your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </InlineFieldset>
            <InlineFieldset>
              <label className="" htmlFor="telephone">
                {telephoneLabel}
              </label>
              <Input
                className="w-auto"
                id="telephone"
                type="text"
                placeholder="Your telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </InlineFieldset>
          </div>
          {/* copy/send buttons */}
          <div className="">
            <p className="text-base text-sm mb-2">
              All done? Use these buttons to copy the text into an email, and
              send that email to: <b>{decisionBody.email}</b>
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                size="sm"
                onClick={() => copyToClipboard(decisionBody.email!)}
              >
                <CopyIcon />
                Copy email: {decisionBody.email}
              </Button>
              <Button size="sm" onClick={() => copySubjectText()}>
                <CopyIcon />
                Copy subject line
              </Button>
              <Button size="sm" onClick={() => copyBodyText()}>
                <CopyIcon />
                Copy email body
              </Button>
            </div>
            <p className="text-base text-sm mt-2 mb-2">
              Or, use this button, which will start a new email in your email
              client with all the text prefilled for you:
            </p>
            <div className="flex gap-2 mb-4">
              <Button asChild size="sm">
                <a
                  href={makeMailtoLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink />
                  Create email (opens your mail client)
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
