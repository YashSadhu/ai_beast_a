import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DonationPopup } from './components/DonationPopup';

interface ApiResponse {
  content: string;
  loading: boolean;
  error: string | null;
}

interface ChatHistory {
  id: string;
  query: string;
  responses: {
    sonar: string;
    sonnet: string;
    deepseek: string;
    gpt5: string;
  };
  timestamp: Date;
}

function App() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [sonarResponse, setSonarResponse] = useState<ApiResponse>({
    content: '',
    loading: false,
    error: null
  });
  const [sonnetResponse, setSonnetResponse] = useState<ApiResponse>({
    content: '',
    loading: false,
    error: null
  });
  const [deepseekResponse, setDeepseekResponse] = useState<ApiResponse>({
    content: '',
    loading: false,
    error: null
  });
  const [gpt5Response, setGpt5Response] = useState<ApiResponse>({
    content: '',
    loading: false,
    error: null
  });

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, sonarResponse, sonnetResponse, deepseekResponse, gpt5Response]);

  const callSonarApi = async (message: string): Promise<string> => {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sk-default-rJYmjcPsNbo8Fav0LjPiAMaGkIy9WSsT'
      },
      body: JSON.stringify({
        user_id: "fametheholyboooy@gmail.com",
        agent_id: "68a431a658203a80ebac7ef4",
        session_id: "68a431a658203a80ebac7ef4-kncehfvdb7",
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.message || JSON.stringify(data);
  };

  const callSonnetApi = async (message: string): Promise<string> => {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sk-default-BDXvpfu0mNsZ8AtYOPmGKmnkxpGkAx4R'
      },
      body: JSON.stringify({
        user_id: "gabrukaand@g.com",
        agent_id: "68a432d16e1baa11945cbcb3",
        session_id: "68a432d16e1baa11945cbcb3-2og8831g8t8",
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.message || JSON.stringify(data);
  };

  const callDeepseekApi = async (message: string): Promise<string> => {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sk-default-z4KcBkrqaAH5lqFuto2Wf80NUnnjo8oT'
      },
      body: JSON.stringify({
        user_id: "abkcaa@gmaill.com",
        agent_id: "68a4344658203a80ebac7f48",
        session_id: "68a4344658203a80ebac7f48-6294ig6loc8",
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.message || JSON.stringify(data);
  };

  const callGpt5Api = async (message: string): Promise<string> => {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sk-default-z4KcBkrqaAH5lqFuto2Wf80NUnnjo8oT'
      },
      body: JSON.stringify({
        user_id: "abkcaa@gmaill.com",
        agent_id: "68a4381929d545bad109ae57",
        session_id: "68a4381929d545bad109ae57-d6oi8gmsbit",
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.message || JSON.stringify(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const currentQuery = query;
    setQuery('');
    
    // Increment chat count and show donation popup after 2 chats
    const newChatCount = chatCount + 1;
    setChatCount(newChatCount);
    if (newChatCount === 2) {
      setShowDonationPopup(true);
    }

    // Reset responses
    setSonarResponse({ content: '', loading: true, error: null });
    setSonnetResponse({ content: '', loading: true, error: null });
    setDeepseekResponse({ content: '', loading: true, error: null });
    setGpt5Response({ content: '', loading: true, error: null });

    // Create new chat entry
    const chatId = Date.now().toString();
    const newChat: ChatHistory = {
      id: chatId,
      query: currentQuery,
      responses: { sonar: '', sonnet: '', deepseek: '', gpt5: '' },
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newChat]);

    // Call all APIs simultaneously
    const sonarPromise = callSonarApi(currentQuery).then(
      (content) => {
        setSonarResponse({ content, loading: false, error: null });
        setChatHistory(prev => prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, responses: { ...chat.responses, sonar: content } }
            : chat
        ));
      }
    ).catch(
      (error) => setSonarResponse({ content: '', loading: false, error: error.message })
    );

    const sonnetPromise = callSonnetApi(currentQuery).then(
      (content) => {
        setSonnetResponse({ content, loading: false, error: null });
        setChatHistory(prev => prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, responses: { ...chat.responses, sonnet: content } }
            : chat
        ));
      }
    ).catch(
      (error) => setSonnetResponse({ content: '', loading: false, error: error.message })
    );

    const deepseekPromise = callDeepseekApi(currentQuery).then(
      (content) => {
        setDeepseekResponse({ content, loading: false, error: null });
        setChatHistory(prev => prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, responses: { ...chat.responses, deepseek: content } }
            : chat
        ));
      }
    ).catch(
      (error) => setDeepseekResponse({ content: '', loading: false, error: error.message })
    );

    const gpt5Promise = callGpt5Api(currentQuery).then(
      (content) => {
        setGpt5Response({ content, loading: false, error: null });
        setChatHistory(prev => prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, responses: { ...chat.responses, gpt5: content } }
            : chat
        ));
      }
    ).catch(
      (error) => setGpt5Response({ content: '', loading: false, error: error.message })
    );

    await Promise.allSettled([sonarPromise, sonnetPromise, deepseekPromise, gpt5Promise]);
  };

  const clearResults = () => {
    setSonarResponse({ content: '', loading: false, error: null });
    setSonnetResponse({ content: '', loading: false, error: null });
    setDeepseekResponse({ content: '', loading: false, error: null });
    setGpt5Response({ content: '', loading: false, error: null });
    setChatHistory([]);
    setQuery('');
  };

  const isLoading = sonarResponse.loading || sonnetResponse.loading || deepseekResponse.loading || gpt5Response.loading;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AB</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">AI Beast-a</h1>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                FREE FOREVER
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">
              Compare AI model responses side by side • Save $999/month vs AI Fiesta • Save $9600/year vs other AI tools
            </p>
            <p className="text-gray-500">This tool is completely free and always will be</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-6">
        {/* Chat History and Live Responses */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-6 space-y-6 max-h-[60vh]"
        >
          {chatHistory.map((chat) => (
            <div key={chat.id} className="space-y-4">
              {/* User Question */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 max-w-[80%]">
                  <p className="text-sm">{chat.query}</p>
                </div>
              </div>
              
              {/* AI Responses Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Sonar Response */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <img 
                      src="https://chat.aifiesta.ai/static/images/models/perplexity.svg" 
                      alt="Perplexity" 
                      className="w-5 h-5"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-medium text-purple-700">Sonar Pro</span>
                  </div>
                  {chat.responses.sonar && (
                    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                      <ReactMarkdown>{chat.responses.sonar}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Sonnet Response */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <img 
                      src="https://chat.aifiesta.ai/static/images/models/claude.svg" 
                      alt="Claude" 
                      className="w-5 h-5"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-medium text-blue-700">Claude Sonnet 3.7</span>
                  </div>
                  {chat.responses.sonnet && (
                    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                      <ReactMarkdown>{chat.responses.sonnet}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* DeepSeek Response */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <img 
                      src="https://chat.aifiesta.ai/static/images/models/deepseek.svg" 
                      alt="DeepSeek" 
                      className="w-5 h-5"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-medium text-green-700">DeepSeek R-1</span>
                  </div>
                  {chat.responses.deepseek && (
                    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                      <ReactMarkdown>{chat.responses.deepseek}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* GPT-5 Response */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <img 
                      src="https://chat.aifiesta.ai/static/images/models/openai.svg" 
                      alt="OpenAI" 
                      className="w-5 h-5"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-medium text-orange-700">GPT-5</span>
                  </div>
                  {chat.responses.gpt5 && (
                    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                      <ReactMarkdown>{chat.responses.gpt5}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Current Loading States */}
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {[
                { name: 'Sonar Pro', color: 'purple', loading: sonarResponse.loading },
                { name: 'Claude Sonnet 3.7', color: 'blue', loading: sonnetResponse.loading },
                { name: 'DeepSeek R-1', color: 'green', loading: deepseekResponse.loading },
                { name: 'GPT-5', color: 'orange', loading: gpt5Response.loading }
              ].map((model, index) => (
                <div key={index} className={`bg-${model.color}-50 rounded-xl p-4 border border-${model.color}-100`}>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`text-sm font-medium text-${model.color}-700`}>{model.name}</span>
                  </div>
                  {model.loading && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className={`w-4 h-4 animate-spin text-${model.color}-600`} />
                      <span className={`text-sm text-${model.color}-600`}>Generating...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Input Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question to compare all four AI models..."
                className="w-full px-4 py-4 pr-16 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 bg-gray-50"
                rows={3}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={clearResults}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Comparing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Compare All Models</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>Made with ❤️ by Yash Sadhu</span>
            <span>•</span>
            <span>Saving you $999/month compared to AI Fiesta</span>
            <span>•</span>
            <span>Free forever, no hidden costs</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://buymeacoffee.com/yashsadhu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              <span>☕</span>
              <span>Buy me coffee</span>
            </a>
            <a
              href="https://x.com/yashsadhu09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/yash-sadhu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* Donation Popup */}
      <DonationPopup 
        isOpen={showDonationPopup} 
        onClose={() => setShowDonationPopup(false)} 
      />
    </div>
  );
}

export default App;
