import { defineFunction, secret } from '@aws-amplify/backend';

export const generateRecipes = defineFunction({
  name: 'generate-recipes',
  environment: {
    OPENAI_API_KEY: secret("OPEN_AI_API_KEY"),
  },
  timeoutSeconds: 30
  
});
