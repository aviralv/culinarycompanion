'use client';

import {useState, useRef, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Info} from "lucide-react";
import Image from 'next/image';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerateIdeas = async () => {
    setError(null);

    if (!ingredients) {
      setError('Please enter some ingredients.');
      return;
    }

    const url = `/results?ingredients=${encodeURIComponent(ingredients)}`;
    router.push(url);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGenerateIdeas();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <Image
            src="/culinary-companion-logo.png" // Replace with your logo path
            alt="Culinary Companion Logo"
            width={100}
            height={100}
            className="mb-4"
          />
          <CardTitle className="text-2xl font-semibold">Culinary Companion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Enter ingredients (e.g., chicken, rice, vegetables)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />

          {error && (
            <Alert variant="destructive">
              <Info className="h-4 w-4"/>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleGenerateIdeas} className="w-full">
            Generate Ideas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
