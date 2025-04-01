import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/router-llm";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../../data/resource";

const openai = new OpenAI();
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>();

/**
 * Define the structured response schema for query classification.
 */
const QueryClassificationSchema = z.object({
  queries: z.array(
    z.object({
      category: z.enum(["generate-recipes", "manage-inventory", "process-receipt", "edit-preferences"]),
      query: z.string(),
    })
  ),
});

export const handler = async (event: { arguments: { query: string; owner: string } }, context: any) => {
  try {
    if (!event.arguments?.query || !event.arguments?.owner) {
      throw new Error("Missing required parameters: query and owner.");
    }

    const query = event.arguments.query;
    const owner = event.arguments.owner;

    console.log("🔍 Processing user query:", query);

    // ✅ Step 1: Use OpenAI Structured Output to Classify Queries
    const classificationResponse = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: `
            You are an intelligent router for a meal-planning and inventory management application.
            The user query may contain multiple requests. Your job is to classify and extract all relevant actions.

            **Categories of Queries:**
            - "generate-recipes": Requests for meal plans or recipes.
            - "manage-inventory": Adding, updating, or removing ingredients, cookware, or appliances.
            - "process-receipt": Processing receipts and extracting purchased items.
            - "edit-preferences": Updating dietary preferences and user settings.

            **Output Format:** Always return a JSON object containing an array called 'queries' where each entry is:
            \`\`\`json
            {
              "queries": [
                {
                  "category": "generate-recipes",
                  "query": "Create a meal plan using available ingredients."
                },
                {
                  "category": "process-receipt",
                  "query": "I uploaded a new grocery receipt, please process it."
                }
              ]
            }
            \`\`\`

            If no valid categories are found, return an empty array in 'queries'.
          `,
        },
        { role: "user", content: query },
      ],
      response_format: zodResponseFormat(QueryClassificationSchema, "query_classification"),
    });

    const classifiedQueries = classificationResponse.choices[0]?.message?.parsed?.queries ?? [];

    if (!Array.isArray(classifiedQueries) || classifiedQueries.length === 0) {
      return {
        responseString: "I couldn't determine any valid actions from your request.",
        error: "No valid queries detected",
      };
    }

    console.log("📌 Classified Queries:", classifiedQueries);

    // ✅ Step 2: Route Each Sub-Query to the Appropriate Function
    const functionResponses = await Promise.all(
      classifiedQueries.map(async (item) => {
        const functionHandler = getFunctionHandler(item.category);
        if (!functionHandler) return null;

        console.log(`🔀 Routing to: ${item.category}`);

        try {
          const response = await functionHandler({
            arguments: { query: item.query, owner },
          });

          return { functionName: item.category, response };
        } catch (err: any) {
          console.error(`❌ Error calling ${item.category}:`, err);
          return { functionName: item.category, responseString: `Error handling request: ${item.category}`, error: err.message };
        }
      })
    );

    // ✅ Step 3: Merge Results into a Unified Response
    const finalResponse = {
      responseString: "Here is your response:",
      results: functionResponses.filter((res) => res !== null), // Remove null responses
    };

    console.log("✅ Final Response:", finalResponse);
    return finalResponse;

  } catch (error: any) {
    console.error("❌ Error in router function:", error);
    return { responseString: "An error occurred while processing your request.", error: error.message };
  }
};

/**
 * Maps query categories to their corresponding function handlers.
 */
function getFunctionHandler(category: string): Function | null {
  const mapping: Record<string, Function> = {
    "generate-recipes": client.queries.GenerateRecipes,
    "manage-inventory": () => null,
    "process-receipt": () => null,
    "edit-preferences": () => null,
  };
  return mapping[category] || null;
}