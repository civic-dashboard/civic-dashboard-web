import OpenAI from 'openai';
import { getAgendaItemByReference } from '@/database/queries/agendaItems';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const formatItemForSummarizer = (
  agendaItemSummary: string,
  agendaItemRecommendation: string | null | undefined,
  decisionRecommendations: string | null | undefined,
): string => {
  const recommendations =
    agendaItemRecommendation || 'No recommendations provided';
  const decisions = decisionRecommendations || 'No decisions made';

  return `Summary: ${agendaItemSummary}\nRecommendation: ${recommendations}\nDecision Recommendations: ${decisions}`;
};

const callChatGPTApi = async (
  prompt: string,
  temperature: number = 0.5,
): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
  const baseWait = 60 * 1000; // 60 seconds in milliseconds
  let exponentialBackoffMultiplier = 1;
  let complete = false;
  let response: OpenAI.Chat.Completions.ChatCompletion = {} as OpenAI.Chat.Completions.ChatCompletion;

  while (!complete) {
    try {
      response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature,
      });
      complete = true;
    } catch (error) {
      if (error instanceof OpenAI.APIError && error.name === 'RateLimitError') {
        const waitTime = baseWait * Math.pow(2, exponentialBackoffMultiplier);
        console.log(`Waiting ${waitTime / 1000} seconds`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        console.log('Waking up!');
        exponentialBackoffMultiplier += 1;
      } else {
        console.error('Error calling ChatGPT API:', error);
        throw error; // Re-throw non-rate-limit errors
      }
    }
  }

  return response;
};

export const generateAISummary = async (
  agendaItemSummary: string,
  agendaItemRecommendation: string | null | undefined,
  decisionRecommendations: string | null | undefined,
): Promise<string | null> => {
  const prompt_template =
    "You will be given a summary and a set of recommendations and decisions from a City Council meeting. Generate a synopsis of the meeting in less than 150 words. The synopsis must have two sections. The first section must be titled 'Context', and should provide context about the meeting. The second section must be titled 'Decisions and Recommendations' and should summarize the recommendations and decisions made. Both sections must be written in point form using simple English. You must be impartial, non-judgemental and gender neutral. Use only the information provided in the context below.\n";

  try {
    const context = formatItemForSummarizer(
      agendaItemSummary,
      agendaItemRecommendation,
      decisionRecommendations,
    );
    const prompt = prompt_template + context;
    const response = await callChatGPTApi(prompt, 0.5);
    if (response && response.choices && response.choices.length > 0) {
      const summary = response.choices[0]?.message?.content?.trim() || '';
      return summary;
    }
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return null;
  }

  return null; // Ensure a return value in all code paths
};

export const generateSummaryForReference = async (
  db: Kysely<DB>, // Database instance
  reference: string, // User-provided reference
): Promise<string | null> => {
  try {
    // Fetch the agenda item by reference
    const agendaItem = await getAgendaItemByReference(db, reference);

    if (!agendaItem) {
      console.log(`No agenda item found for reference: ${reference}`);
      return null;
    }

    // Generate the AI summary
    const summary = await generateAISummary(
      agendaItem.agendaItemSummary || '',
      agendaItem.agendaItemRecommendation || null,
      agendaItem.decisionRecommendations || null,
    );

    console.log('Generated AI Summary for reference:', reference);
    return summary;
  } catch (error) {
    console.error('Error generating summary for reference:', error);
    return null;
  }
};
