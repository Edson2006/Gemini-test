import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import Button from './Button';
import Spinner from './Spinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setImageUrl(null);
    setError(null);

    try {
      const url = await generateImage(prompt.trim());
      setImageUrl(url);
    } catch (err) {
      setError('Failed to generate image. Please try a different prompt.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `gemini-generated-image-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">AI Image Generator</h2>
        <p className="mt-1 text-slate-400">Describe the image you want to create. Be as specific as you can!</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cinematic shot of a futuristic city at sunset, with flying cars and neon lights"
          className="w-full h-24 p-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          disabled={isLoading}
        />
        <Button onClick={handleGenerate} isLoading={isLoading} className="sm:h-24 sm:w-48">
          Generate
        </Button>
      </div>

      {error && <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-md">{error}</div>}

      <div className="relative">
        <div className="w-full aspect-video bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700">
          {isLoading && <Spinner className="w-12 h-12" />}
          {!isLoading && !imageUrl && (
            <div className="text-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Your generated image will appear here</p>
            </div>
          )}
          {imageUrl && <img src={imageUrl} alt={prompt} className="rounded-lg object-contain h-full w-full" />}
        </div>
        {imageUrl && !isLoading && (
            <Button
              onClick={handleDownload}
              className="absolute bottom-4 right-4 !py-2 !px-4"
              aria-label="Download Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </Button>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;