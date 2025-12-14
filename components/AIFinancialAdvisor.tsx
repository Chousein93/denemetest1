import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, Loader2, X } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

interface AIAdvisorProps {
    isOpen: boolean;
    onClose: () => void;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ isOpen, onClose }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const inputContextRef = useRef<AudioContext | null>(null);
    const sessionRef = useRef<Promise<any> | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    // Audio Processing Utils
    const createBlob = (data: Float32Array) => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        let binary = '';
        const bytes = new Uint8Array(int16.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return {
            data: btoa(binary),
            mimeType: 'audio/pcm;rate=16000',
        };
    };

    const decodeAudioData = async (base64: string, ctx: AudioContext) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const dataInt16 = new Int16Array(bytes.buffer);
        const frameCount = dataInt16.length;
        const buffer = ctx.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }
        return buffer;
    };

    useEffect(() => {
        if (!isOpen) {
            // Cleanup on close
            if (audioContextRef.current) audioContextRef.current.close();
            if (inputContextRef.current) inputContextRef.current.close();
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            setIsConnected(false);
            return;
        }

        const initLiveSession = async () => {
            try {
                // Input Audio
                inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const source = inputContextRef.current.createMediaStreamSource(stream);
                const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
                
                processor.onaudioprocess = (e) => {
                    const inputData = e.inputBuffer.getChannelData(0);
                    const blob = createBlob(inputData);
                    if (sessionRef.current) {
                        sessionRef.current.then(session => {
                            session.sendRealtimeInput({ media: blob });
                        });
                    }
                };
                
                source.connect(processor);
                processor.connect(inputContextRef.current.destination);

                // Output Audio
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                
                sessionRef.current = geminiService.getLiveSession(
                    async (message: LiveServerMessage) => {
                        const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData && audioContextRef.current) {
                            setIsSpeaking(true);
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
                            const buffer = await decodeAudioData(audioData, audioContextRef.current);
                            const source = audioContextRef.current.createBufferSource();
                            source.buffer = buffer;
                            source.connect(audioContextRef.current.destination);
                            
                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                                if (sourcesRef.current.size === 0) setIsSpeaking(false);
                            });

                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            sourcesRef.current.add(source);
                        }

                        if (message.serverContent?.interrupted) {
                             sourcesRef.current.forEach(s => s.stop());
                             sourcesRef.current.clear();
                             nextStartTimeRef.current = 0;
                             setIsSpeaking(false);
                        }
                    },
                    () => setIsConnected(true),
                    () => setIsConnected(false),
                    (e) => { console.error(e); setError("Connection Error"); }
                );

            } catch (err) {
                console.error("Mic access denied or error", err);
                setError("Microphone access required");
            }
        };

        initLiveSession();

        return () => {
             // Cleanup handled by early return check, but good to be redundant if unmounting
             // Implicit cleanup via useEffect re-run logic if isOpen changes
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                
                <div className="flex flex-col items-center gap-8 py-8">
                    <div className="relative">
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isSpeaking ? 'bg-blue-100 scale-110 shadow-[0_0_40px_rgba(59,130,246,0.5)]' : 'bg-gray-100'}`}>
                            {isSpeaking ? <Volume2 size={48} className="text-blue-600 animate-pulse" /> : <Mic size={48} className="text-gray-600" />}
                        </div>
                        {isConnected && !isSpeaking && (
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full border-2 border-white">
                                Listening
                            </div>
                        )}
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">Financial Assistant</h2>
                        <p className="text-gray-500">
                            {error ? <span className="text-red-500">{error}</span> : 
                             isConnected ? "Ask me anything about your budget..." : "Connecting..."}
                        </p>
                    </div>

                    {!isConnected && !error && <Loader2 className="animate-spin text-blue-600" size={32} />}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-700 text-center">
                    Powered by Gemini Live API • Real-time Conversation
                </div>
            </div>
        </div>
    );
};

export default AIAdvisor;
