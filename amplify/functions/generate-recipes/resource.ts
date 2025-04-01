import { defineFunction } from '@aws-amplify/backend';

export const generateRecipes = defineFunction({
  name: 'generate-recipes',
  environment: {
    OPENAI_API_KEY: process.env.OPEN_AI_API_KEY,
timeoutSeconds: 10,
});
