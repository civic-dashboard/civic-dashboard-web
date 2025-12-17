'use client';

import { DecisionBody } from '@/api/decisionBody';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { AgendaItem } from '@/database/queries/agendaItems';
import { CopyIcon, ExternalLink, InfoIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ReadonlyTextField } from '@/components/deputation-modals/ReadOnlyTextField';
import {
  copyToClipboard,
  makeMailtoLink,
} from '@/components/deputation-modals/utils';

interface Props {
  agendaItem: AgendaItem;
  decisionBody: DecisionBody;
  trigger: ReactNode;
}

function Fieldset({ children }: { children: ReactNode }) {
  return <fieldset className="block mb-4">{children}</fieldset>;
}

export function SubmitCommentModal({
  agendaItem,
  decisionBody,
  trigger,
}: Props) {
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
    `Please add my comments to the agenda for the ${formattedDate} ${decisionBody.decisionBodyName} meeting on item ${agendaItem.reference}, ${agendaItem.agendaItemTitle}`,
    'I understand that my comments and the personal information in this email will form part of the public record and that my name will be listed as a correspondent on agendas and minutes of City Council or its committees. Also, I understand that agendas and minutes are posted online and my name may be indexed by search engines like Google.',
  ];
  const commentsHeading = 'Comments:';
  const closing = `Sincerely,`;

  const getFullBodyText = () => {
    const closingWithName = `${closing}\n${commenterName}`;
    const textArray = [
      ...bodyStartParagraphs,
      commentsHeading,
      comment,
      closingWithName,
    ];
    return textArray.join('\n\n');
  };
  const copySubjectText = async () => copyToClipboard(subject);
  const copyBodyText = async () => copyToClipboard(getFullBodyText());

  const mailtoLink = makeMailtoLink({
    email: decisionBody.email!,
    subject,
    body: getFullBodyText(),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex flex-col w-full md:max-w-4xl max-h-screen md:h-[calc(100vh-4rem)] overflow-y-scroll">
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
            {/* comments */}
            <Fieldset>
              <div className="relative mb-2">
                <label htmlFor="comment">{commentsHeading}</label>
                <Accordion type="multiple">
                  <AccordionItem
                    value="comment-help"
                    className="relative border-none"
                  >
                    <AccordionTrigger className="absolute -top-5 right-0">
                      Help
                    </AccordionTrigger>
                    <AccordionContent className="m-0 p-0">
                      <div className="mt-2 mb-2 border rounded p-4 bg-blue-900/50">
                        <CommentHelpContent />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <TextArea
                id="comment"
                placeholder="Your comments"
                aria-describedby="comment-detailed-description"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Fieldset>
            {/* closing */}
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
                <a href={mailtoLink} target="_blank" rel="noopener noreferrer">
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

function CommentHelpContent() {
  return (
    <div
      className="text-base text-sm space-y-2"
      id="comment-detailed-description"
    >
      <p>Describe:</p>
      <ul className="list-disc">
        <li className="ml-4">
          <b>Who you are:</b> Your name, where you live (if relevant), and any
          relevant communities you are part of
        </li>
        <li className="ml-4">
          <b>Your relationship to the item:</b> Why do you care about it? How
          does it affect you? Why do you think it&rsquo;s important?
        </li>
        <li className="ml-4">
          <b>What you want:</b> What would you like this committee to do? Do you
          want them to vote yes or no on this item? Do you want them to
          amend/change it in some way?
        </li>
      </ul>
      <h3 className="font-semibold">Example:</h3>
      <p>
        My name is Lisa Michaels, I&rsquo;m a 20 year resident of the High Park
        neighbourhood, and I&rsquo;m a lifelong birder and animal lover.
      </p>
      <p>
        This item is meant to protect wildlife, and yet it will greatly increase
        the level of noise in High Park, which scares and disorients birds,
        damages the ecosystem, and makes the park less enjoyable for everyone!
        Parks are about bringing people and nature together, and this would do
        the opposite.
      </p>
      <p>
        I ask that this committee either vote No on this item, or find a way to
        amend it that does not increase the level of noise in the park. My
        family, my birding group and I will be following this committee&rsquo;s
        actions closely!
      </p>
    </div>
  );
}
