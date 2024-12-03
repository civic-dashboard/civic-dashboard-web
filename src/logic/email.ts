import { Resend } from 'resend';
import { TaggedAgendaItem } from './search';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(items: TaggedAgendaItem[]) {
  await resend.emails.send({
    from: 'civicdashboard@resend.dev',
    to: 'garo.brik@gmail.com',
    subject: 'New agenda items',
    html: `<p>Congrats on sending your <strong>first email</strong>!</p>${items
      .map((i) => `<p>${i.agendaItemTitle}</p>`)
      .join('')}`,
  });
}
