'use server';

/**
 * @fileOverview Generates a formatted recipe string from recipe details.
 *
 * - generateFormattedRecipe - A function that generates a formatted recipe string.
 * - GenerateFormattedRecipeInput - The input type for the generateFormattedRecipe function.
 * - GenerateFormattedRecipeOutput - The return type for the generateFormattedRecipe function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateFormattedRecipeInputSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
  instructions: z.array(z.string()).describe('The steps to prepare the recipe.'),
});
export type GenerateFormattedRecipeInput = z.infer<typeof GenerateFormattedRecipeInputSchema>;

const GenerateFormattedRecipeOutputSchema = z.object({
  formattedRecipe: z.string().describe('The formatted recipe string.'),
});
export type GenerateFormattedRecipeOutput = z.infer<typeof GenerateFormattedRecipeOutputSchema>;

export async function generateFormattedRecipe(input: GenerateFormattedRecipeInput): Promise<GenerateFormattedRecipeOutput> {
  return generateFormattedRecipeFlow(input);
}

const recipePrompt = ai.definePrompt({
  name: 'recipePrompt',
  input: {
    schema: z.object({
      name: z.string().describe('The name of the recipe.'),
      ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
      instructions: z.array(z.string()).describe('The steps to prepare the recipe.'),
    }),
  },
  output: {
    schema: z.object({
      formattedRecipe: z.string().describe('The formatted recipe string.'),
    }),
  },
  prompt: `
# Recipe: {{name}}

## Ingredients:
{{#each ingredients}}
- {{this}}
{{/each}}

## Instructions:
{{#each instructions}}
{{@index}}. {{this}}
{{/each}}
`,
});

const generateFormattedRecipeFlow = ai.defineFlow<
  typeof GenerateFormattedRecipeInputSchema,
  typeof GenerateFormattedRecipeOutputSchema
>(
  {
    name: 'generateFormattedRecipeFlow',
    inputSchema: GenerateFormattedRecipeInputSchema,
    outputSchema: GenerateFormattedRecipeOutputSchema,
  },
  async input => {
    const {output} = await recipePrompt(input);
    return {formattedRecipe: output?.formattedRecipe ?? 'Failed to format recipe.'};
  }
);
