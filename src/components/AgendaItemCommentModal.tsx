'use client';

import { DecisionBody } from '@/api/decisionBody';
// import { cn } from '@/components/ui/utils';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { AgendaItem } from '@/database/queries/agendaItems';
import { CopyIcon, InfoIcon, MessageSquarePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

interface Props {
  agendaItem: AgendaItem;
  decisionBody: DecisionBody;
}

function Fieldset({ children }: { children: ReactNode }) {
  return <fieldset className="block mb-4">{children}</fieldset>;
}

function Label({ id, children }: { id: string; children: ReactNode }) {
  return (
    <label className="block text-base mb-2" htmlFor={id}>
      {children}
    </label>
  );
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
      <label className="block w-1/2 text-base" htmlFor={id}>
        {label}
      </label>
      <Input
        className="border-none h-auto p-0 text-base font-semibold"
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
  const body = `To the City Clerk:

Please add my comments to the agenda for the ${formattedDate} ${decisionBody.decisionBodyId} meeting on item ${agendaItem.reference}, ${agendaItem.agendaItemTitle}

I understand that my comments and the personal information in this email will form part of the public record and that my name will be listed as a correspondent on agendas and minutes of City Council or its committees. Also, I understand that agendas and minutes are posted online and my name may be indexed by search engines like Google.

Comments:

${comment}

Sincerely,
${commenterName}
  `;
  return (
    <Dialog>
      {/* TODO: This duplicates styling for DropdownMenuItem... */}
      <DialogTrigger className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
        <MessageSquarePlus />
        Submit a comment (NEW!)
      </DialogTrigger>
      <DialogContent className="flex flex-col w-full md:max-w-6xl  h-[calc(100vh-4rem)]">
        <h1 className="text-2xl leading-snug">
          Submit a comment for
          <br />
          <span className="inline-block font-semibold pt-1">
            {agendaItem.agendaItemTitle}
          </span>
        </h1>
        <div className="flex flex-col grow md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="mb-8">
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
            <Fieldset>
              <Label id="commenterName">Your name</Label>
              <Input
                id="commenterName"
                type="text"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
              />
            </Fieldset>
            <Fieldset>
              <Label id="comment">
                Your comments
                <Tooltip
                  // @ts-expect-error TODO: thinking about replacing this with an accordion.
                  // this is too much text for a tooltip.
                  tooltipContent={
                    <div className="text-base">
                      <p>
                        Describe who you are, what you want, and why you want
                        it.
                      </p>
                      <ul>
                        <li>
                          Who you are - your name, where you live (if it’s
                          relevant), and any relevant communities you are part
                          of
                        </li>
                        <li>
                          Your relationship to the item - why do you care about
                          it? How does it affect you? Why do you think it’s
                          important?
                        </li>
                        <li>
                          What you want - what would you like this committee to
                          do? Do you want them to vote yes or no on this item?
                          Do you want them to amend/change it in some way?
                        </li>
                      </ul>
                      <p>
                        Example:
                        <br />
                        My name is Lisa Michaels, I’m a 20 year resident of the
                        High Park neighbourhood, and I’m a lifelong birder and
                        animal lover.
                        <br />
                        This item is meant to protect wildlife, and yet it will
                        greatly increase the level of noise in High Park, which
                        scares and disorients birds, damages the ecosystem, and
                        makes the park less enjoyable for everyone! Parks are
                        about bringing people and nature together, and this
                        would do the opposite.
                        <br />I ask that this committee either vote No on this
                        item, or find a way to amend it that does not increase
                        the level of noise in the park. My family, my birding
                        group and I will be following this committee’s actions
                        closely!
                      </p>
                    </div>
                  }
                >
                  <InfoIcon />
                </Tooltip>
              </Label>
              <TextArea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Fieldset>
          </div>
          <div className="flex flex-col grow w-full md:w-1/2">
            <div className="flex">
              <span className="grow self-center text-sm font-semibold mb-2">
                Email subject
              </span>
              <Button
                size="sm"
                title="Copy email subject line"
                onClick={() => alert('not implemented yet')}
              >
                <CopyIcon />
                <span className="sr-only">Copy email subject line</span>
              </Button>
            </div>
            <div className="text-base mb-6">{subject}</div>
            <div className="flex">
              <span className="grow self-center text-sm font-semibold mb-2">
                Email body
              </span>
              <Button
                size="sm"
                title="Copy email body"
                onClick={() => alert('not implemented yet')}
              >
                <CopyIcon />
                <span className="sr-only">Copy email body</span>
              </Button>
            </div>
            <TextArea
              className="flex-stretch grow text-base md:text-base"
              value={body}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
