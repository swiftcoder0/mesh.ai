import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// --- WORKER: Use jsdelivr for version 3.11.174 (CDN works reliably) ---
// Import the worker as a static asset (works in Electron)
import workerUrl from 'pdfjs-dist/build/pdf.worker.js?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// --- Ollama API Call ---
const askOllama = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: prompt,
        stream: false,
        options: { temperature: 0.3, max_tokens: 150 },
      }),
    });
    const data = await response.json();
    return data.response || 'No response from AI.';
  } catch (error) {
    return '⚠️ Error: Is Ollama running? (Run "ollama serve" in terminal)';
  }
};

// --- Floating Toolbar ---
const FloatingToolbar: React.FC<{
  x: number;
  y: number;
  selectedText: string;
  onAction: (action: string) => void;
  loading: boolean;
}> = ({ x, y, selectedText, onAction, loading }) => {
  if (!selectedText) return null;

  return (
   <div
  className="fixed z-50 bg-[#2a2a3e] border border-gray-600 rounded-lg shadow-2xl flex items-center gap-1 p-1.5 transition-all duration-150 floating-toolbar"
  style={{ left: x, top: y - 50 }}
>
      <button
        onClick={() => onAction('define')}
        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition flex items-center gap-1"
      >
        📖 Define
      </button>
      <button
        onClick={() => onAction('simplify')}
        className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md transition flex items-center gap-1"
      >
        ✍️ Simplify
      </button>
      <button
        onClick={() => onAction('quiz')}
        className="px-3 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-md transition flex items-center gap-1"
      >
        🧠 Quiz Me
      </button>
      {loading && (
        <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  );
};

// --- Main App ---
function App() {
  const [filePath, setFilePath] = useState<string>('');
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedText, setSelectedText] = useState<string>('');
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const textLayerRef = useRef<HTMLDivElement>(null);

  const openFile = async () => {
    if (!window.electronAPI) {
      setError('Electron API not available. Please restart the app.');
      return;
    }
    const path = await window.electronAPI.openFile();
    if (path) {
      setFilePath(path);
      setError('');
      try {
        console.log('Opening file:', path);
        const buffer = await window.electronAPI.readPdf(path);
        console.log('File loaded, size:', buffer.length);
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfData(url);
        setPageNumber(1);
        setAiResponse('');
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load PDF: ' + (err as Error).message);
      }
    }
  };

  useEffect(() => {
    return () => { if (pdfData) URL.revokeObjectURL(pdfData); };
  }, [pdfData]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError('');
    console.log('PDF loaded successfully! Pages:', numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF Load Error:', error);
    setError('Failed to load PDF: ' + error.message);
  };

    // --- UPDATED: Only shows toolbar, never hides it here ---
    const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 0 && text.length < 500) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setToolbarPos({
          x: rect.left + rect.width / 2 - 80,
          y: rect.top + window.scrollY,
        });
      }
      setSelectedText(text);
    }
    // IMPORTANT: No "else" block here. Do NOT clear the text here.
  }, []);

    // --- NEW: Hide toolbar when clicking outside it ---
    // --- FIX: Hide toolbar when clicking outside, but with a delay ---
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // If the click is on the toolbar itself, definitely don't hide it.
      if (target.closest('.floating-toolbar')) {
        return;
      }

      // Critical fix: Add a 100ms delay.
      // This gives the 'mouseup' event time to set the selectedText 
      // before the 'click' event tries to clear it.
      setTimeout(() => {
        // Check if there is still selected text. If so, keep it.
        // Only clear if we are sure the user clicked away.
        const selection = window.getSelection();
        if (!selection || !selection.toString().trim()) {
          setSelectedText('');
        }
      }, 100);
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleAiAction = async (action: string) => {
    if (!selectedText) return;
    setLoading(true);

    let prompt = '';
    if (action === 'define') {
      prompt = `Define the word/phrase "${selectedText}" in a short, clear, and simple way.`;
    } else if (action === 'simplify') {
      prompt = `Explain this paragraph in extremely simple words, like I am 5 years old: "${selectedText}"`;
    } else if (action === 'quiz') {
      prompt = `Based on the text: "${selectedText}", generate exactly 1 short multiple-choice question to test my recall. Provide the answer too.`;
    }

    const response = await askOllama(prompt);
    setAiResponse(`🤖 AI: ${response}`);
    setLoading(false);
    setTimeout(() => setSelectedText(''), 5000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#1a1a2e] text-white">
      <div className="flex items-center justify-between px-6 py-3 bg-[#16213e] border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            📚 Recall PDF
          </h1>
          <button
            onClick={openFile}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
          >
            📂 Open PDF
          </button>
          {filePath && (
            <span className="text-sm text-gray-400 truncate max-w-xs">
              {filePath.split('\\').pop()}
            </span>
          )}
        </div>
        <div className="flex gap-3 text-sm text-gray-300">
          <span>Page {pageNumber} / {numPages || '?'}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="w-48 bg-[#0f1a2b] border-r border-gray-700 p-2 overflow-y-auto hidden md:block">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Thumbnails</p>
          {Array.from(new Array(numPages || 0), (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPageNumber(num)}
              className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition ${
                pageNumber === num ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              Page {num}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4 bg-[#1e1e2f] relative" ref={textLayerRef}>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
              ❌ {error}
            </div>
          )}
          {pdfData ? (
            <div className="flex justify-center">
              <Document
                file={pdfData}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                options={{
                  cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/`,
                  cMapPacked: true,
                }}
                loading={<div className="text-gray-400">Loading PDF...</div>}
                className="shadow-2xl"
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                  renderMode="svg"
                  className="bg-white rounded-md"
                  width={750}
                />
              </Document>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-6xl mb-4">📄</p>
              <p className="text-xl">Drop a PDF or click "Open PDF"</p>
            </div>
          )}

          {aiResponse && (
            <div className="fixed bottom-6 right-6 max-w-md bg-[#2a2a4e] border border-purple-500 rounded-xl p-4 shadow-2xl z-40">
              <p className="text-sm text-gray-200">{aiResponse}</p>
              <button
                onClick={() => setAiResponse('')}
                className="absolute top-1 right-2 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
          )}

          <FloatingToolbar
            x={toolbarPos.x}
            y={toolbarPos.y}
            selectedText={selectedText}
            onAction={handleAiAction}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;