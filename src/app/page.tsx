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
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

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

      if (data && data.recipe_output) {
        const recipeOutput = data.recipe_output;

        if (typeof recipeOutput === 'string') {
          setRecipeIdeas([recipeOutput]);
        }
        else {
          console.error('recipe_output is not a string:', recipeOutput);
          setError('Unexpected response format: recipe_output is not a string.');
          setRecipeIdeas([]);
        }
        setSelectedRecipe(null);
      } else {
        throw new Error('Unexpected response structure from the API.');
      }

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
      setSelectedRecipe({formattedRecipe: recipeDetails});
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
          <CardTitle>Culinary Companion</CardTitle>
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
              <div>
                {recipeIdeas.map((idea, index) => (
                  <p key={index} className="cursor-pointer hover:text-accent"
                      onClick={() => handleRecipeSelect(idea)}>
                    {idea}
                  </p>
                ))}
              </div>
            </div>
          )}

          {selectedRecipe && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recipe:</h3>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} children={selectedRecipe.formattedRecipe} />
            </div>
          )}

          {isLoadingRecipe && <p>Loading recipe...</p>}
        </CardContent>
      </Card>
    </div>
  );
}

interface RecipeDetailsOutput {
  formattedRecipe: any;
}
