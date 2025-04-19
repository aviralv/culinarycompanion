/**
 * Represents a recipe.
 */
export interface Recipe {
  /**
   * The name of the recipe.
   */
  name: string;
  /**
   * The ingredients required for the recipe.
   */
ingredients: string[];
  /**
   * The steps to prepare the recipe.
   */
  instructions: string[];
}

/**
 * Asynchronously retrieves recipe ideas for given ingredients.
 *
 * @param ingredients The ingredients available.
 * @returns A promise that resolves to a list of recipe names.
 */
export async function getRecipeIdeas(ingredients: string): Promise<string[]> {
  // TODO: Implement this by calling an API.

  return ['Pasta', 'Pizza', 'Salad'];
}

/**
 * Asynchronously retrieves a recipe by name.
 *
 * @param recipeName The name of the recipe to retrieve.
 * @returns A promise that resolves to a Recipe object.
 */
export async function getRecipe(recipeName: string): Promise<Recipe> {
  // TODO: Implement this by calling an API.

  return {
    name: 'Pasta',
    ingredients: ['Pasta', 'Tomato Sauce', 'Cheese'],
    instructions: ['Boil pasta', 'Add tomato sauce', 'Add cheese'],
  };
}
