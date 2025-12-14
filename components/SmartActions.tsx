import React, { useState } from 'react';
import { Video, Image, Search, MapPin, Sparkles, X, Loader2, Play } from 'lucide-react';
import { geminiService } from '../services/geminiService';

type ActionType = 'veo' | 'image' | 'search' | 'map' | null;

interface SmartActionsProps {
    isOpen: boolean;
    onClose: () => void;
}

const SmartActions: React.FC<SmartActionsProps> = ({ isOpen, onClose }) => {
    const [activeAction, setActiveAction] = useState<ActionType>('veo');
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<{text: string, sources: any[]} | null>(null);

    if (!isOpen) return null;

    const handleExecute = async () => {
        setIsLoading(true);
        setResult(null);
        setSearchResult(null);

        try {
            if (activeAction === 'veo') {
                const videoUri = await geminiService.generateVideo(prompt);
                if (videoUri) setResult(videoUri); // We need to append API key when rendering
            } else if (activeAction === 'image') {
                const imgData = await geminiService.generateVisualization(prompt, '1K');
                if (imgData) setResult(imgData);
            } else if (activeAction === 'search') {
                const data = await geminiService.getMarketNews(prompt);
                setSearchResult(data);
            } else if (activeAction === 'map') {
                // Mock location for demo
                const text = await geminiService.findNearbyFinancialServices(41.0082, 28.9784, prompt); // Istanbul coords
                setSearchResult({ text, sources: [] });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4 flex flex-col gap-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Tools</h3>
                    <button onClick={() => setActiveAction('veo')} className={`p-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeAction === 'veo' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}>
                        <Video size={18} /> Visualize Goal (Veo)
                    </button>
                    <button onClick={() => setActiveAction('image')} className={`p-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeAction === 'image' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-700'}`}>
                        <Image size={18} /> Dream Board (Img)
                    </button>
                    <button onClick={() => setActiveAction('search')} className={`p-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeAction === 'search' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-700'}`}>
                        <Search size={18} /> Market Research
                    </button>
                    <button onClick={() => setActiveAction('map')} className={`p-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${activeAction === 'map' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100 text-gray-700'}`}>
                        <MapPin size={18} /> Find Branch
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {activeAction === 'veo' && "Generate Video with Veo"}
                            {activeAction === 'image' && "Generate Image"}
                            {activeAction === 'search' && "Search Grounding"}
                            {activeAction === 'map' && "Maps Grounding"}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Prompt</label>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-32"
                                placeholder={
                                    activeAction === 'veo' ? "A cinematic drone shot of a tropical beach in Bali at sunset..." :
                                    activeAction === 'image' ? "A futuristic piggy bank on a desk with neon lights..." :
                                    "Enter your query here..."
                                }
                            />
                        </div>

                        <button 
                            disabled={isLoading || !prompt}
                            onClick={handleExecute}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                            Generate Result
                        </button>

                        {/* Results Area */}
                        {(result || searchResult) && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                {activeAction === 'veo' && result && (
                                    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative group">
                                        <video 
                                            src={`${result}&key=${process.env.API_KEY}`} 
                                            controls 
                                            autoPlay 
                                            loop 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                {activeAction === 'image' && result && (
                                    <img src={result} alt="Generated" className="w-full h-auto rounded-lg shadow-md" />
                                )}
                                {(activeAction === 'search' || activeAction === 'map') && searchResult && (
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-gray-800 whitespace-pre-wrap">{searchResult.text}</p>
                                        {searchResult.sources.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase">Sources</h4>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {searchResult.sources.map((s, i) => (
                                                        s.web ? (
                                                            <a key={i} href={s.web.uri} target="_blank" rel="noreferrer" className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-blue-600 hover:underline truncate max-w-[200px]">
                                                                {s.web.title}
                                                            </a>
                                                        ) : null
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartActions;
