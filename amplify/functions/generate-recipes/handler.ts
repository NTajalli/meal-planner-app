import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/generate-recipes";
import { Schema } from "../../data/resource";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { AppSyncIdentityCognito } from 'aws-lambda';


// Initialize Amplify and OpenAI
const openai = new OpenAI();
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>();

// Define Recipe Schema
const RecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  cookwareNeeded: z.array(z.string()),
  appliancesNeeded: z.array(z.string()),
  preparationTime: z.number().int(),
  cookingTime: z.number().int(),
  totalTime: z.number().int(),
  caloriesPerServing: z.number().int(),
  servings: z.number().int(),
});

// Define Meal Plan Response Schema
const MealPlanResponseSchema = z.object({
  responseString: z.string(),
  recipes: z.array(RecipeSchema),
});

export const handler: Schema["GenerateRecipes"]["functionHandler"] = async (event, context) => {
  try {
    console.log("Context: ", JSON.stringify(context));
    console.log("Event: ", JSON.stringify(event));
    const identity = event.identity as AppSyncIdentityCognito;

    // ✅ Fetch user-specific data (ingredients, cookware, appliances)
    const [ingredients, cookware, appliances] = await Promise.all([
      client.models.Ingredient.list({
        filter: { owner: { contains: identity.sub  || "" } },
      }),
      client.models.Cookware.list({
        filter: { owner: { contains: identity.sub } },
      }),
      client.models.Appliance.list({
        filter: { owner: { contains: identity.sub } },
      }),
    ]);

    // ✅ Convert fetched data into XML format
    const ingredientsXml = formatToXml("ingredients", "ingredient", ingredients.data);
    const cookwareXml = formatToXml("cookware", "item", cookware.data);
    const appliancesXml = formatToXml("appliances", "item", appliances.data);

    console.log("Formatted XML Data:");
    console.log(ingredientsXml);
    console.log(cookwareXml);
    console.log(appliancesXml);

    // ✅ Call OpenAI API
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: getSystemPrompt(ingredientsXml, cookwareXml, appliancesXml) },
        { role: "user", content: [{type: "text", text: event.arguments.query || "Return an error"}] },
      ],
      
      store: true,
      response_format: zodResponseFormat(MealPlanResponseSchema, "mealPlan"),
    });

    const output = completion.choices?.[0].message.parsed;
    return output || { responseString: "Error: No valid response generated.", recipes: [] };

  } catch (error) {
    console.error("❌ Error in meal planning function:", error);

    return {
      responseString: "An error occurred while generating your meal plan.",
      recipes: [],
      error: (error as any).message || "Unknown error",
    };
  }
};

/**
 * ✅ Utility Function: Convert Data to XML Format
 */
function formatToXml(rootTag: string, itemTag: string, dataArray: any[]) {
  let xmlString = `<${rootTag}>`;
  dataArray.forEach((item) => {
    xmlString += `<${itemTag}>`;
    for (const key in item) {
      if (Object.hasOwnProperty.call(item, key)) {
        xmlString += `<${key}>${item[key]}</${key}>`;
      }
    }
    xmlString += `</${itemTag}>`;
  });
  xmlString += `</${rootTag}>`;
  return xmlString;
}

/**
 * ✅ Utility Function: Construct System Prompt
 */
function getSystemPrompt(ingredientsXml: string, cookwareXml: string, appliancesXml: string) {
  return `**Purpose:**  
You are an advanced meal planner AI tasked with creating meal plans and generating recipes for the user. Your goal is to propose complete, structured recipes tailored to the provided data, including ingredients, cookware, appliances, user preferences, and past generated recipes. Your response must include:  
1. **Response String:** A natural-language string containing any preface and/or relevant content based on the user query before listing the recipes.  
2. **Recipes List:** An array of recipes in a JSON format with all required details for the user to prepare the meals.  

---

**Embedded User Data:**  

Below is the relevant data you must use to generate meal plans. Always prioritize the user's preferences and allergens while utilizing the available ingredients, cookware, and appliances. Ensure all generated recipes are feasible given the available tools and resources.  

Ingredients:  
\`\`\`  
${ingredientsXml}
\`\`\`  

Cookware:  
\`\`\`  
${cookwareXml}
\`\`\`  

Appliances:  
\`\`\`  
${appliancesXml}
\`\`\`  

User Preferences:  
\`\`\`  
None yet, will be added soon!
\`\`\`  

Previous Recipes:
\`\`\`
None yet, will be added soon!
\`\`\`

---

**Output Format:**  

Your response must strictly follow this format:  

\`\`\`json
{
    "responseString": "responseString",
    "recipes": [
        {
            "name": "recipe_name",
            "description": "Short description of the recipe.",
            "ingredients": [
                "ingredient_name (quantity and unit if available)"
            ],
            "instructions": [
                "Step 1 content.",
                "Step 2 content,
                "... and so on"
            ],
            "cookwareNeeded": [
                "cookware_item_name"
            ],
            "appliancesNeeded": [
                "appliance_item_name"
            ],
            "preparationTime": 15,
            "cookingTime": 30,
            "totalTime": 45,
            "caloriesPerServing": 400,
            "servings": 4
        },
        {
            "name": "another_recipe_name",
            //... Same structure as above
        }
    ]
}
\`\`\`

---

**Guidelines for Recipe Generation:**  

1. **Ingredients Use:**  
   - Utilize the provided ingredients effectively to create meals.
   - If an ingredient is unavailable, substitute it with another ingredient or suggest alternatives in the responseString.  

2. **Cookware and Appliances:**  
   - Ensure the recipes are feasible with the available cookware and appliances. If a required tool is missing, note this in the responseString.  

3. **User Preferences:**  
   - **Allergens:** Avoid suggesting recipes with any allergens listed in user preferences.  
   - **Dietary Restrictions:** Ensure the recipes align with the user's dietary restrictions (e.g., vegetarian, gluten-free).  
   - **Preferred Cuisines:** Prioritize recipes from the user’s preferred cuisines.  

4. **Past Recipes:**  
   - Avoid duplication of recipes unless explicitly requested. Use past generated recipes to inspire new variations.  

5. **Meal Plan Diversity:**  
   - Propose diverse recipes that balance proteins, vegetables, carbs, and other components based on user preferences.  

6. **Small Missing Items:**  
   - For minor items like spices, oil, or seasonings, assume they are available unless explicitly mentioned otherwise.  

7. **Error Handling:**  
   - If no feasible recipes can be generated, explain why in the responseString and propose general guidance or a shopping list of missing items.  

---

**Example:**  

User Query:  
"Can you suggest meals using the ingredients I have?"  

Embedded Data:  
\`\`\`xml
<ingredients>
  <ingredient name="Chicken Breast" quantity="2 lbs" type="Protein" />
  <ingredient name="Broccoli" quantity="1 head" type="Vegetable" />
  <ingredient name="Rice" quantity="2 cups" type="Grain" />
</ingredients>
\`\`\`  

\`\`\`xml
<cookware>
  <item name="Frying Pan" />
  <item name="Saucepan" />
</cookware>
\`\`\`  

\`\`\`xml
<appliances>
  <item name="Oven" isAvailable="true" />
  <item name="Microwave" isAvailable="false" />
</appliances>
\`\`\`  

\`\`\`json
{
    "preferences": {
        "dietaryRestrictions": ["Gluten-Free"],
        "allergens": ["Peanuts"],
        "preferredCuisines": ["Italian", "Asian"],
        "calorieLimit": 600,
        "favoriteIngredients": ["Chicken", "Garlic", "Cheese"]
    }
}
\`\`\`  

Output:  
\`\`\`json
{
        "responseString": "Here are some meal ideas based on your available ingredients and preferences.,
    "recipes": [
        {
            "name": "Garlic Butter Chicken with Broccoli and Rice",
            "description": "A simple yet flavorful dish featuring chicken, broccoli, and rice.",
            "ingredients": [
                "Chicken Breast (2 lbs)",
                "Broccoli (1 head)",
                "Rice (2 cups)",
                "Butter (2 tbsp)",
                "Garlic (3 cloves)"
            ],
            "instructions": [
                "Cook the rice in a saucepan according to package instructions.",
                "Steam the broccoli until tender.",
                "In a frying pan, melt butter and sauté minced garlic until fragrant.",
                "Add chicken breast to the pan, cook until golden and fully cooked.",
                "Serve the chicken over rice with broccoli on the side."
            ],
            "cookwareNeeded": ["Frying Pan", "Saucepan"],
            "appliancesNeeded": ["None"],
            "preparationTime": 10,
            "cookingTime": 30,
            "totalTime": 40,
            "caloriesPerServing": 500,
            "servings": 4
        }
    ]
}
\`\`\`

---

**Notes for the LLM:**  
- Always adhere to the specified format.  
- Generate diverse, creative recipes while considering user constraints.  
- Provide clear and engaging natural-language responses in the responseString.  `;
}