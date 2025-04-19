'use client';

import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {getRecipeDetails} from '@/ai/flows/display-recipe-details';
import {generateRecipeIdeas} from '@/ai/flows/generate-recipe-ideas';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Info} from "lucide-react";
import {generateFormattedRecipe} from "@/ai/flows/generate-formatted-recipe";

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipeIdeas, setRecipeIdeas] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetailsOutput | null>(null);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateIdeas = async () => {
    setIsLoadingIdeas(true);
    setError(null);
    try {
      const response = await fetch('https://aviralv.app.n8n.cloud/webhook-test/4b812275-4ff0-42a6-a897-2c8ad444a1e1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ingredients}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract the recipe_output from the response
      const recipeOutput = data?.recipe_output;

      if (recipeOutput) {
        let recipeIdeasArray: string[] = [];

        // Check if recipeOutput is already a JSON array
        if (Array.isArray(recipeOutput)) {
          recipeIdeasArray = recipeOutput.map((item) => {
            return String(item);
          }); // Ensure all elements are strings
        } else if (typeof recipeOutput === 'string') {
          // If it's not a JSON array, treat it as a comma-separated string
          recipeIdeasArray = recipeOutput.split(',').map(item => item.trim());
        } else {
          throw new Error('Unexpected format for recipe_output in the API response.');
        }

        if (recipeIdeasArray.length > 0) {
          setRecipeIdeas(recipeIdeasArray);
        } else {
          throw new Error('No recipe ideas found in the response.');
        }
      } else {
        throw new Error('Recipe output not found in the API response.');
      }

      setSelectedRecipe(null); // Clear any previously selected recipe
    } catch (e: any) {
      setError(e.message || 'Failed to generate recipe ideas.');
      setRecipeIdeas([]);
      setSelectedRecipe(null);
    } finally {
      setIsLoadingIdeas(false);
    }
  };


  const handleRecipeSelect = async (recipeName: string) => {
    setIsLoadingRecipe(true);
    setError(null);
    try {
      const recipeDetails = await getRecipeDetails({recipeName});
      const formattedRecipeResponse = await generateFormattedRecipe({
        name: recipeDetails.name,
        ingredients: recipeDetails.ingredients,
        instructions: recipeDetails.instructions,
      });
      setSelectedRecipe({formattedRecipe: formattedRecipeResponse.formattedRecipe});
    } catch (e: any) {
      setError(e.message || 'Failed to load recipe.');
      setSelectedRecipe(null);
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Food Idea Generator</CardTitle>
          <CardDescription>Enter your ingredients to get recipe ideas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter ingredients (e.g., chicken, rice, vegetables)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
            <Button onClick={handleGenerateIdeas} disabled={isLoadingIdeas}>
              {isLoadingIdeas ? 'Generating...' : 'Generate Ideas'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <Info className="h-4 w-4"/>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {recipeIdeas.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recipe Ideas:</h3>
              <ul className="list-disc pl-5">
                {recipeIdeas.map((idea, index) => (
                  <li key={index} className="cursor-pointer hover:text-accent"
                      onClick={() => handleRecipeSelect(idea)}>
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedRecipe && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recipe:</h3>
              <p className="text-md">{selectedRecipe.formattedRecipe}</p>
            </div>
          )}

          {isLoadingRecipe && <p>Loading recipe...</p>}
        </CardContent>
      </Card>
    </div>
  );
}

interface RecipeDetailsOutput {
  formattedRecipe: string;
}

    