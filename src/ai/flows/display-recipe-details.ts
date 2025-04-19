'use server';
/**
 * @fileOverview Retrieves and formats recipe details for a given recipe name.
 *
 * - getRecipeDetails - A function that retrieves and returns formatted recipe details.
 * - RecipeDetailsInput - The input type for the getRecipeDetails function.
 * - RecipeDetailsOutput - The return type for the getRecipeDetails function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getRecipe, Recipe} from '@/services/recipe-api';

const RecipeDetailsInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to retrieve.'),
});
export type RecipeDetailsInput = z.infer<typeof RecipeDetailsInputSchema>;

const RecipeDetailsOutputSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
  instructions: z.array(z.string()).describe('The steps to prepare the recipe.'),
});
export type RecipeDetailsOutput = z.infer<typeof RecipeDetailsOutputSchema>;

export async function getRecipeDetails(input: RecipeDetailsInput): Promise<RecipeDetailsOutput> {
  return displayRecipeDetailsFlow(input);
}

const displayRecipeDetailsFlow = ai.defineFlow<
  typeof RecipeDetailsInputSchema,
  typeof RecipeDetailsOutputSchema
>(
  {
    name: 'displayRecipeDetailsFlow',
    inputSchema: RecipeDetailsInputSchema,
    outputSchema: RecipeDetailsOutputSchema,
  },
  async input => {
    const recipe: Recipe = await getRecipe(input.recipeName);

    return {
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    };
  }
);

    