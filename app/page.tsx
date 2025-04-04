"use client";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/transcript?youtubeUrl=${youtubeUrl}`);
      const data = await response.json();
      setTranscript(data.transcript);
      setCopied(false); // Reset copied state after new transcript
    } catch (error: any) {
      setTranscript(`Error: ${error.message}`);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
      <div className="container max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          YouTube Transcript Viewer
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="youtubeUrl"
              className="block text-sm font-medium text-gray-700"
            >
              YouTube URL:
            </label>
            <input
              type="text"
              id="youtubeUrl"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Get Transcript
          </button>
        </form>

        {transcript && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Transcript:
            </h2>
            <div className="whitespace-pre-line text-gray-700 mb-4">
              {transcript}
            </div>
            <CopyToClipboard text={transcript} onCopy={handleCopy}>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </CopyToClipboard>
          </div>
        )}
      </div>
    </div>
  );
}
