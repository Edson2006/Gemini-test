import React from 'react';
import { EmailCampaign } from '../types';

// A simple markdown to HTML converter
const markdownToHtml = (text: string) => {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italics
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Newlines
  text = text.replace(/\n/g, '<br />');
  return text;
};


interface GeneratedEmailProps {
  campaign: EmailCampaign;
}

const GeneratedEmail: React.FC<GeneratedEmailProps> = ({ campaign }) => {
  const handleDownload = (url: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `campaign-visual-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden shadow-xl animate-fade-in">
      <div className="p-4 bg-slate-800 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100">Generated Email Preview</h3>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <span className="font-semibold text-slate-400">Subject: </span>
          <span className="text-slate-200">{campaign.subject}</span>
        </div>
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          {campaign.imageUrl && (
            <div className="relative group">
              <img src={campaign.imageUrl} alt="Campaign Visual" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleDownload(campaign.imageUrl)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-slate-900 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-50 focus:ring-offset-slate-800"
                  aria-label="Download campaign visual"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Image
                </button>
              </div>
            </div>
          )}
          <div className="p-6">
            <div
              className="prose prose-invert prose-sm text-slate-300 max-w-none"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(campaign.body) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedEmail;