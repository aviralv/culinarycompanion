# **App Name**: Culinary Companion

## Core Features:

- Ingredient Input: An input text box where users can enter the main ingredients they have available.
- Generate Ideas Button: A 'Generate Ideas' button that triggers the recipe idea generation.
- API Communication: Send the input text payload via POST request to the specified URL (https://aviralv.app.n8n.cloud/webhook-test/4b812275-4ff0-42a6-a897-2c8ad444a1e1) when the 'Generate Ideas' button is pressed.
- Recipe Idea Display: Display the generated recipe ideas (names of dishes) returned from the API. The LLM is used as a tool to generate names of the dishes.
- Recipe Display: Display the recipe, returned from the API, corresponding to the idea selected by the user. The LLM is used as a tool to provide a complete recipe.

## Style Guidelines:

- Primary color: Earthy green (#386641) to evoke a sense of freshness and nature.
- Secondary color: Cream (#F0EAD6) for a clean and appetizing background.
- Accent: Burnt orange (#D4A373) for buttons and highlights.
- Clean and organized layout for easy readability of recipes.
- Simple, line-based icons for ingredients and cooking steps.
- Subtle transition animations when displaying recipe ideas and details.

## Original User Request:
Build an App that helps users generate ideas for what to cook along with recipes given the main ingredients.

Call the app "Food Idea Generator".

It needs an input text box and a button called "Generate Ideas"

When that button is pressed send the input text payload via POST request to https://aviralv.app.n8n.cloud/webhook-test/4b812275-4ff0-42a6-a897-2c8ad444a1e1
  