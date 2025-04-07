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
    <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
      <div className="container max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          YouTube Transcript Viewer
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative flex items-center">
            <input
              type="text"
              id="youtubeUrl"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="block w-full rounded-full border-gray-300 py-2 px-4 pr-12 text-base leading-6 text-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
              placeholder="Enter YouTube URL"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-700 hover:bg-purple-500 text-white font-bold rounded-full p-2 focus:outline-none focus:shadow-outline transition-all duration-200 cursor-pointer"
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
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Transcript:
            </h2>
            <div className="whitespace-pre-line text-gray-700 mb-4 rounded-md p-4 bg-gray-50 break-words overflow-x-auto">
              {transcript}
            </div>
            <CopyToClipboard text={transcript} onCopy={handleCopy}>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center cursor-pointer">
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
