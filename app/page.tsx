'use client'
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function createIndexAndEmbeddings() {
    try {
      setLoading(true);
      const response = await fetch('/api/setup', {
        method: 'POST',
      });
      const data = await response.json();
      console.log('result: ', data);
      setLoading(false);
    } catch (err) {
      console.log('err:', err);
      setLoading(false);
      setError('An error occurred while creating index and embeddings.');
    }
  }

  async function sendQuery() {
    if (!query) return;
    setResult('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/read', {
        method: 'POST',
        body: JSON.stringify(query),
      });
      const data = await response.json();
      setResult(data.data);
      setLoading(false);
    } catch (err) {
      console.log('err:', err);
      setLoading(false);
      setError('An error occurred while sending the query.');
    }
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const clearInput = () => {
    setQuery('');
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-blue-800 text-white">
      <h1 className="text-5xl font-bold mb-8">Law Chat</h1>
      <div className="w-full max-w-lg">
        <input className="w-full bg-gray-100 text-black px-4 py-2 mb-4 rounded-md" value={query} onChange={handleInputChange} placeholder="Enter your query" />
      </div>
      <button className="px-8 py-3 rounded-md bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300" onClick={sendQuery} disabled={loading}>
        Ask AI
      </button>
      {loading && <p className="text-gray-300 mt-4">Asking AI...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && (
        <div className="w-full max-w-lg p-4 mt-4 bg-white text-gray-800 rounded-md">
          <p>{result}</p>
        </div>
      )}
      <button onClick={createIndexAndEmbeddings} disabled={loading} className="mt-8 px-8 py-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300">
        Create index and embeddings
      </button>
    </main>
  );
}
