
import React, { useState, useCallback } from 'react';
import { generateEmailCampaign } from '../services/geminiService';
import { EmailCampaign } from '../types';
import Button from './Button';
import GeneratedEmail from './GeneratedEmail';

const EmailCampaignGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setCampaign(null);
    setError(null);

    try {
      const result = await generateEmailCampaign(prompt.trim());
      setCampaign(result);
    } catch (err) {
      setError('Failed to generate the campaign. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Email Campaign Generator</h2>
        <p className="mt-1 text-slate-400">Describe your product or promotion, and let AI build your campaign.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A new line of sustainable, handcrafted coffee mugs"
          className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
        />
        <Button onClick={handleGenerate} isLoading={isLoading}>
          Generate Campaign
        </Button>
      </div>

      {error && <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-md">{error}</div>}

      {isLoading && (
         <div className="text-center p-8 border-2 border-dashed border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-300">Generating your campaign...</h3>
            <p className="text-slate-400">This may take a moment. The AI is crafting your content and designing a unique visual.</p>
        </div>
      )}

      {campaign && <GeneratedEmail campaign={campaign} />}

    </div>
  );
};

export default EmailCampaignGenerator;
