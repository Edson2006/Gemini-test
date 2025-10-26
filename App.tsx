
import React, { useState } from 'react';
import { ActiveTool } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import EmailCampaignGenerator from './components/EmailCampaignGenerator';
import ImageGenerator from './components/ImageGenerator';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>(ActiveTool.Campaign);

  const renderActiveTool = () => {
    switch (activeTool) {
      case ActiveTool.Campaign:
        return <EmailCampaignGenerator />;
      case ActiveTool.Image:
        return <ImageGenerator />;
      case ActiveTool.Chat:
        return <Chatbot />;
      default:
        return <EmailCampaignGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <Tabs activeTool={activeTool} onTabClick={setActiveTool} />
          <div className="mt-6 bg-slate-800/50 rounded-lg shadow-2xl p-4 sm:p-8 border border-slate-700">
            {renderActiveTool()}
          </div>
        </main>
        <footer className="text-center text-slate-500 mt-8 text-sm">
          <p>Powered by the Google Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
