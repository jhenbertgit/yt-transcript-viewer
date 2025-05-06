"use client";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  CheckIcon,
  ClipboardIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import he from "he";

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [copied, setCopied] = useState(false);
  const [gettingTranscript, setGettingTranscript] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setGettingTranscript(true);
    try {
      const response = await fetch(`/api/transcript?youtubeUrl=${youtubeUrl}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // First decode
      let decodedTranscript = he.decode(data.transcript);
      // Check if double encoded
      if (decodedTranscript.includes("&#39;")) {
        decodedTranscript = he.decode(decodedTranscript); // Decode again if necessary
      }
      setTranscript(decodedTranscript);
      setCopied(false);
    } catch (error) {
      console.error("Fetching transcript failed:", error as Error);
      setTranscript(`Error: ${(error as Error).message}`);
    } finally {
      setGettingTranscript(false);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="container max-w-3xl w-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden p-6 sm:p-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">
          YouTube Transcript Viewer
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative flex items-center group">
            <input
              type="text"
              id="youtubeUrl"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="block w-full rounded-full border-slate-300 py-3 px-6 pr-16 text-base leading-6 text-slate-900 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out placeholder-slate-400"
              placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ease-in-out group-focus-within:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={gettingTranscript}
              aria-label="Get Transcript"
            >
              {gettingTranscript ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <ArrowUpIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>

        {transcript && (
          <div className="mt-10 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-5">
              Transcript:
            </h2>
            <div className="whitespace-pre-line text-slate-700 leading-relaxed mb-6 rounded-lg p-6 bg-slate-50 border border-slate-200 shadow-inner break-words overflow-x-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200 scrollbar-thumb-rounded-full">
              {transcript}
            </div>
            <CopyToClipboard text={transcript} onCopy={handleCopy}>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer">
                {copied ? (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <ClipboardIcon className="h-5 w-5 mr-2" />
                    Copy
                  </>
                )}
              </button>
            </CopyToClipboard>
          </div>
        )}
      </div>
    </div>
  );
}
