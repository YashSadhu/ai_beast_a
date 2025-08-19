import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  type: 'user' | 'assistant';
  content: string;
  modelName?: string;
  modelColor?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  type, 
  content, 
  modelName, 
  modelColor = 'gray' 
}) => {
  return (
    <div className={`flex space-x-3 ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
      {type === 'assistant' && (
        <div className={`w-8 h-8 rounded-full bg-${modelColor}-100 flex items-center justify-center flex-shrink-0`}>
          <Bot className={`w-4 h-4 text-${modelColor}-600`} />
        </div>
      )}
      
      <div className={`max-w-[80%] ${type === 'user' ? 'order-first' : ''}`}>
        {type === 'assistant' && modelName && (
          <p className={`text-xs text-${modelColor}-600 font-medium mb-1`}>{modelName}</p>
        )}
        
        <div className={`rounded-2xl px-4 py-3 ${
          type === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {type === 'user' ? (
            <p className="text-sm">{content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      
      {type === 'user' && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};
