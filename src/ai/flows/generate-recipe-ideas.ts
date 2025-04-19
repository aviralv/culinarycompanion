'use server';
/**
 * @fileOverview Generates recipe ideas based on a list of ingredients.
 *
 * - generateRecipeIdeas - A function that generates recipe ideas.
 * - GenerateRecipeIdeasInput - The input type for the generateRecipeIdeas function.
 * - GenerateRecipeIdeasOutput - The return type for the generateRecipeIdeas function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getRecipeIdeas} from '@/services/recipe-api';

const GenerateRecipeIdeasInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients.'),
});
export type GenerateRecipeIdeasInput = z.infer<typeof GenerateRecipeIdeasInputSchema>;

const GenerateRecipeIdeasOutputSchema = z.object({
  recipeIdeas: z.array(z.string()).describe('A list of recipe ideas.'),
});
export type GenerateRecipeIdeasOutput = z.infer<typeof GenerateRecipeIdeasOutputSchema>;

export async function generateRecipeIdeas(input: GenerateRecipeIdeasInput): Promise<GenerateRecipeIdeasOutput> {
  return generateRecipeIdeasFlow(input);
}

const generateRecipeIdeasFlow = ai.defineFlow<
  typeof GenerateRecipeIdeasInputSchema,
  typeof GenerateRecipeIdeasOutputSchema
>(
  {
    name: 'generateRecipeIdeasFlow',
    inputSchema: GenerateRecipeIdeasInputSchema,
    outputSchema: GenerateRecipeIdeasOutputSchema,
  },
  async input => {
    const recipeIdeas = await getRecipeIdeas(input.ingredients);
    return {recipeIdeas};
  }
);
