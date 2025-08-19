import React from 'react';
import { X, Coffee, DollarSign } from 'lucide-react';

interface DonationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationPopup: React.FC<DonationPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <Coffee className="w-8 h-8 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-900">Support AI Beast-a</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <p className="text-gray-700">
            Hey there! 👋 You've made 2 comparisons already. This tool is completely free and always will be!
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">API Costs Reality</span>
            </div>
            <p className="text-sm text-blue-800">
              Running these premium AI models costs real money. Each comparison uses multiple API calls that I pay for to keep this free for everyone.
            </p>
          </div>
          
          <p className="text-gray-700">
            If you find this tool helpful, consider buying me a coffee to help cover the API costs and keep improving the platform! ☕
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Maybe Later
          </button>
          <a
            href="https://buymeacoffee.com/yashsadhu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center font-medium"
            onClick={onClose}
          >
            Buy Me Coffee ☕
          </a>
        </div>
      </div>
    </div>
  );
};
