import { defineFunction, secret } from '@aws-amplify/backend';

export const routerLLM = defineFunction({
  name: 'router-llm',
  environment: {
    OPENAI_API_KEY: secret("OPEN_AI_API_KEY"),
  },
timeoutSeconds: 10,
});
