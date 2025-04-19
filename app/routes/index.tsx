import { useEffect, useState } from 'react';

type Entry = {
  items: string[];
  result?: string;
};

export default function Index() {
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<Entry[]>(() => {
    try {
      const stored = localStorage.getItem('entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const items = input
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);
    if (!items.length) return;
    setLoading(true);

    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();

    const newEntry: Entry = { items, result: data.result };
    setEntries([newEntry, ...entries]);
    setInput('');
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">MacroMate</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 100g chicken, 1 cup rice"
          className="border p-2 w-full"
        />
        <button type="submit" disabled={loading} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>
      <div>
        {entries.map((entry, idx) => (
          <div key={idx} className="mb-4 p-4 border rounded bg-white">
            <p className="italic">{entry.items.join(', ')}</p>
            <pre className="whitespace-pre-wrap mt-2">{entry.result}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
