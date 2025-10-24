'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicrophoneIcon } from '@heroicons/react/24/outline';

interface VoiceCommand {
  transcript: string;
  confidence: number;
  timestamp: Date;
  intent?: string;
  response?: string;
}

export function VoiceController({ projectId }: { projectId: string }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        const confidence = event.results[current][0].confidence;
        
        setTranscript(transcript);

        // Final result
        if (event.results[current].isFinal) {
          handleVoiceCommand(transcript, confidence);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } else {
      // Request wake lock to prevent screen sleep
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.warn('Wake lock error:', err);
      }

      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleVoiceCommand = async (transcript: string, confidence: number) => {
    // Check for wake word
    const lowerTranscript = transcript.toLowerCase();
    if (!lowerTranscript.includes('hey jcal') && !lowerTranscript.includes('okay jcal')) {
      return; // Ignore commands without wake word
    }

    // Remove wake word
    const command = transcript
      .replace(/hey jcal/gi, '')
      .replace(/okay jcal/gi, '')
      .trim();

    if (!command) return;

    setIsProcessing(true);
    setTranscript('');

    try {
      // Parse intent and execute
      const response = await fetch('/api/voice/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          command,
          confidence
        })
      });

      const result = await response.json();

      // Add to history
      const commandRecord: VoiceCommand = {
        transcript: command,
        confidence,
        timestamp: new Date(),
        intent: result.intent,
        response: result.response
      };

      setCommandHistory(prev => [commandRecord, ...prev]);

      // Speak response
      speakResponse(result.response);

      // Show success notification
      showToast(`✅ ${result.response}`, 'success');

    } catch (error) {
      console.error('Voice command error:', error);
      speakResponse("Sorry, I couldn't process that command");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  return (
    <>
      {/* Voice Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`fixed bottom-24 right-8 w-16 h-16 rounded-full
          shadow-2xl flex items-center justify-center z-50 transition-all
          ${isListening 
            ? 'bg-gradient-to-r from-red-500 to-pink-600 animate-pulse' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600'
          }`}
      >
        {isListening ? (
          <MicrophoneIcon className="w-8 h-8 text-white animate-bounce" />
        ) : (
          <MicrophoneIcon className="w-8 h-8 text-white" />
        )}
      </motion.button>

      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-44 right-8 bg-white dark:bg-gray-900 
                       rounded-2xl shadow-2xl p-6 w-80 z-50"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
              <span className="font-medium">Listening...</span>
            </div>

            {/* Waveform Visualization */}
            <div className="flex items-center gap-1 h-12 mb-4">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-600 rounded-full"
                  animate={{
                    height: isProcessing ? '20%' : ['20%', '100%', '20%']
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>

            {/* Current Transcript */}
            {transcript && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {transcript}
                </p>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Processing command...</span>
              </div>
            )}

            {/* Tips */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 mb-2">Try saying:</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  • "Hey JCAL, add a login page"
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  • "Make the header sticky"
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  • "Deploy this app"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command History */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="fixed bottom-44 right-8 px-4 py-2 bg-white dark:bg-gray-900
                   rounded-full shadow-lg text-sm font-medium"
      >
        📜 History
      </button>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed right-8 bottom-60 w-96 max-h-[500px] overflow-y-auto
                       bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6"
          >
            <h3 className="font-semibold mb-4">Voice Command History</h3>
            <div className="space-y-3">
              {commandHistory.map((cmd, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium">{cmd.transcript}</p>
                  <p className="text-xs text-gray-500 mt-1">{cmd.response}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {cmd.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
