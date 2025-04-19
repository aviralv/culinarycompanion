'use client';

import {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Info} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {getRecipeDetails} from "@/ai/flows/display-recipe-details";

interface RecipeDetailsOutput {
  formattedRecipe: any;
}

export default function Results() {
  const searchParams = useSearchParams();
  const ingredients = searchParams.get('ingredients') || '';
  const [recipeIdeas, setRecipeIdeas] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetailsOutput | null>(null);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const generateIdeas = async () => {
      setIsLoadingIdeas(true);
      setError(null);
      try {
        const response = await fetch('https://aviralv.app.n8n.cloud/webhook/4b812275-4ff0-42a6-a897-2c8ad444a1e1', {
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
          if (typeof data.recipe_output === 'string') {
            setRecipeIdeas([data.recipe_output]);
          } else if (Array.isArray(data.recipe_output)) {
            setRecipeIdeas(data.recipe_output);
          } else {
            console.error('Unexpected recipe_output format:', data.recipe_output);
            setError('Unexpected response format: recipe_output is not a string or an array.');
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

    generateIdeas();
  }, [ingredients]);

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

  const goBack = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Culinary Companion - Results</CardTitle>
          <CardDescription>Recipe ideas for: {ingredients}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <Info className="h-4 w-4"/>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoadingIdeas ? (
            <p>Loading recipe ideas...</p>
          ) : (
            recipeIdeas.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Recipe Ideas:</h3>
                <div>
                  {recipeIdeas.map((idea, index) => (
                    <div key={index} className="cursor-pointer hover:text-accent"
                         onClick={() => handleRecipeSelect(idea)}>
                      <ReactMarkdown rehypePlugins={[rehypeRaw]} children={idea}/>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No recipe ideas found for the given ingredients.</p>
            )
          )}

          {selectedRecipe && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recipe:</h3>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} children={selectedRecipe.formattedRecipe}/>
            </div>
          )}

          {isLoadingRecipe && <p>Loading recipe...</p>}

          <Button onClick={goBack}>Back to Search</Button>
        </CardContent>
      </Card>
    </div>
  );
}
