import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { generateRecipes } from "../functions/generate-recipes/resource";
import { routerLLM } from "../functions/router-llm/resource";

/*== STEP 1 ===============================================================
Schema Definition for Meal Planner App.
=========================================================================*/

const schema = a.schema({
  Ingredient: a
    .model({
      name: a.string().required(),
      quantity: a.float().required(),
      unit: a.string().default("Count"),
      type: a.string(),
      storage: a.string(),
      expiration_date: a.date().required(),
      allergens: a.string().array().required(),
    })
    .authorization((allow) => [allow.owner()]),

  Appliance: a
    .model({
      name: a.string().required(),
      available: a.boolean().default(true),
    })
    .authorization((allow) => [allow.owner()]),

  Cookware: a
    .model({
      name: a.string().required(),
      quantity: a.integer().required(),
    })
    .authorization((allow) => [allow.owner()]),

  /** Query: Generate Recipes (Only Router LLM Can Call This) */
  RecipesFormat: a.customType({
    name: a.string().required(),
    description: a.string().required(),
    ingredients: a.string().array().required(),
    instructions: a.string().array().required(),
    cookwareNeeded: a.string().array().required(),
    appliancesNeeded: a.string().array().required(),
    preparationTime: a.integer().required(),
    cookingTime: a.integer().required(),
    totalTime: a.integer().required(),
    caloriesPerServing: a.integer().required(),
    servings: a.integer().required(),
  }),
  GenerateRecipesResponse: a.customType({
    responseString: a.string().required(),
    recipes: a.ref("RecipesFormat").array().required(),
  }),
  GenerateRecipes: a
    .query()
    .arguments({
      query: a.string().required(),
      owner: a.id().required(),
    })
    .authorization((allow) => [
      allow.authenticated(),
    ])
    .handler(a.handler.function(generateRecipes))
    .returns(a.ref("GenerateRecipesResponse").required()),

  /** Query: Router LLM (Only Authenticated Users Can Call This) */
  RouterLLMResponseItem: a.customType({
    functionName: a.string().required(),
    response: a.string().required(),
  }),
  RouterLLMResponse: a.customType({
    responseString: a.string().required(),
    results: a.ref("RouterLLMResponseItem").array().required(),
  }),
  RouterLLM: a
    .query()
    .arguments({
      query: a.string().required(),
      owner: a.id().required(),
    })
    .authorization((allow) => [
      allow.authenticated(), // ✅ Only authenticated users can call this
    ])
    .handler(a.handler.function(routerLLM))
    .returns(a.ref("RouterLLMResponse").required()),
    
}).authorization((allow) => [
  allow.resource(routerLLM), // Router LLM can call any function
  allow.resource(generateRecipes)
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam", // ✅ Enforces IAM-based security
    
  },
  });