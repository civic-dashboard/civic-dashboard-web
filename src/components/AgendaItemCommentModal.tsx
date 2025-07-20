'use client';

import { DecisionBody } from '@/api/decisionBody';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { AgendaItem } from '@/database/queries/agendaItems';
import {
  CopyIcon,
  ExternalLink,
  InfoIcon,
  MessageSquarePlus,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  agendaItem: AgendaItem;
  decisionBody: DecisionBody;
}

function Fieldset({ children }: { children: ReactNode }) {
  return <fieldset className="block mb-4">{children}</fieldset>;
}

function ReadonlyTextField({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <fieldset className="flex mb-2">
      <label className="block w-1/2 text-sm" htmlFor={id}>
        {label}
      </label>
      <Input
        className="border-none h-auto p-0 text-sm font-semibold"
        id={id}
        value={value}
        type="text"
        readOnly
      />
    </fieldset>
  );
}

export function AgendaItemCommentModal({ agendaItem, decisionBody }: Props) {
  const [comment, setComment] = useState('');
  const [commenterName, setCommenterName] = useState('');

  const formattedDate = new Date(agendaItem.meetingDate).toLocaleString(
    'default',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  );
  const subject = `My comments for ${agendaItem.reference} on ${formattedDate} ${decisionBody.decisionBodyName}`;
  const bodyStartParagraphs = [
    'To the City Clerk:',
    `Please add my comments to the agenda for the ${formattedDate} ${decisionBody.decisionBodyId} meeting on item ${agendaItem.reference}, ${agendaItem.agendaItemTitle}`,
    'I understand that my comments and the personal information in this email will form part of the public record and that my name will be listed as a correspondent on agendas and minutes of City Council or its committees. Also, I understand that agendas and minutes are posted online and my name may be indexed by search engines like Google.',

    'Comments:',
  ];
  const closing = `Sincerely,`;

  const getFullBodyText = () => {
    const closingWithName = `${closing}\n${commenterName}`;
    const textArray = [...bodyStartParagraphs, comment, closingWithName];
    return textArray.join('\n\n');
  };
  const makeMailtoLink = () => {
    const body = getFullBodyText();
    return `mailto:${decisionBody.email}?subject=${subject}&body=${body.replaceAll('\n', '%0A')}`;
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
      {/* TODO: This duplicates styling for DropdownMenuItem... */}
      <DialogTrigger className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
        <MessageSquarePlus />
        Submit a comment (NEW!)
      </DialogTrigger>
      <DialogContent className="flex flex-col w-full md:max-w-6xl h-[calc(100vh-4rem)] overflow-y-scroll">
        <h1 className="text-2xl leading-snug">
          Submit a comment for
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
            Submitting a comment involves sending an email to the relevant
            decision body! This form helps you put together this email.
            <ol className="list-decimal mt-2 pl-4">
              <li className="ml-4">Fill out the form</li>
              <li className="ml-4">
                Use the Copy buttons to copy the text into your email client of
                choice, and send it off! Or, use the create email button, which
                will automatically open your email client with the text already
                filled in for you.
              </li>
            </ol>
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
        <div className="flex flex-col grow w-full">
          {/* email subject row */}
          <div className="flex flex-col md:flex-row mb-6">
            <div className="flex flex-col grow w-full md:w-2/3">
              <h2 className="grow text-sm font-semibold mb-2">Email subject</h2>
              <div className="text-base">{subject}</div>
            </div>
            <div className="w-full mt-2 md:w-1/3"></div>
          </div>
          {/* email body opening row */}
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col grow w-full md:w-2/3">
              <h2 className="grow text-sm font-semibold mb-2">Email body</h2>
              {bodyStartParagraphs.map((s, i) => (
                <p key={i} className="mb-3">
                  {s}
                </p>
              ))}
            </div>

            <div className="w-full md:w-1/3"></div>
          </div>
          {/* comments + rest row */}
          <div className="flex flex-col md:flex-row mb-6 gap-4">
            <div className="flex flex-col grow w-full md:w-2/3">
              <Fieldset>
                <label className="sr-only" htmlFor="comment">
                  Your comments
                </label>
                <TextArea
                  id="comment"
                  placeholder="Your comments"
                  aria-describedby="comment-detailed-description"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Fieldset>
              <p className="mb-3">{closing}</p>
              <Fieldset>
                <label className="sr-only" htmlFor="commenterName">
                  Your name
                </label>
                <Input
                  id="commenterName"
                  type="text"
                  placeholder="Your name"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                />
              </Fieldset>

              <p className="text-base text-sm mt-4 mb-2">
                All done? Use these buttons to copy the text into an email, and
                send that email to: <b>{decisionBody.email}</b>
              </p>
              <div className="flex gap-2 mb-4">
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
                  <a href={makeMailtoLink()}>
                    <ExternalLink />
                    Create email (opens your mail client)
                  </a>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <div
                className="text-base text-sm space-y-2"
                id="comment-detailed-description"
              >
                <p>Describe:</p>
                <ul className="list-disc">
                  <li className="ml-4">
                    <b>Who you are:</b> Your name, where you live (if relevant),
                    and any relevant communities you are part of
                  </li>
                  <li className="ml-4">
                    <b>Your relationship to the item:</b> Why do you care about
                    it? How does it affect you? Why do you think it&rsquo;s
                    important?
                  </li>
                  <li className="ml-4">
                    <b>What you want:</b> What would you like this committee to
                    do? Do you want them to vote yes or no on this item? Do you
                    want them to amend/change it in some way?
                  </li>
                </ul>
                <h3 className="font-semibold">Example:</h3>
                <p>
                  My name is Lisa Michaels, I&rsquo;m a 20 year resident of the
                  High Park neighbourhood, and I&rsquo;m a lifelong birder and
                  animal lover.
                </p>
                <p>
                  This item is meant to protect wildlife, and yet it will
                  greatly increase the level of noise in High Park, which scares
                  and disorients birds, damages the ecosystem, and makes the
                  park less enjoyable for everyone! Parks are about bringing
                  people and nature together, and this would do the opposite.
                </p>
                <p>
                  I ask that this committee either vote No on this item, or find
                  a way to amend it that does not increase the level of noise in
                  the park. My family, my birding group and I will be following
                  this committee&rsquo;s actions closely!
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
