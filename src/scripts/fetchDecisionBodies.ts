import { DecisionBody, fetchDecisionBodies } from '@/api/decisionBody';
import { CURRENT_COUNCIL_TERM } from '@/constants/currentCouncilTerm';
import { writeFileSync } from 'fs';
import { format, resolveConfig, resolveConfigFile } from 'prettier';

async function main() {
  const configFile = await resolveConfigFile();

  if (!configFile) {
    throw Error('.prettierrc not found');
  }

  const bodies: Record<number, DecisionBody> = {};
  const termId = CURRENT_COUNCIL_TERM;
  console.log('fetching for', termId);
  const thisTermBodies = await fetchDecisionBodies({ termId });
  console.log(`got ${Object.values(thisTermBodies).length} values`);
  Object.assign(bodies, thisTermBodies);

  const jsonString = JSON.stringify(bodies, null, 2);

  const unQuotedKeys = jsonString.replace(/"([^"]+)":/g, '$1:');

  const tsCode = `
  import { DecisionBody } from '@/api/decisionBody';
  
  export const decisionBodies: Record<number, DecisionBody> = ${unQuotedKeys}
  `;

  const projectConfig = await resolveConfig(configFile || '');

  const formattedCode = await format(tsCode, {
    ...projectConfig,
    parser: 'typescript',
  });

  writeFileSync('src/constants/decisionBodies.ts', formattedCode, 'utf-8');
}

main()
  .then(() => console.log('Decision bodies written to file successfully!'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
