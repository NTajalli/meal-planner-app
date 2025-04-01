import { defineFunction } from '@aws-amplify/backend';

export const routerLLM = defineFunction({
  name: 'router-llm',
  environment: {
    OPENAI_API_KEY: process.env.OPEN_AI_API_KEY,
  },
timeoutSeconds: 10,
});
