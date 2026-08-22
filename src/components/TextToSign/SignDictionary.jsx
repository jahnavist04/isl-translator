import React from 'react';
import { Hand, BookOpen } from 'lucide-react';

export const ISL_DICTIONARY = [
  { code: 'HELLO', label: 'Hello', category: 'phrase', description: 'Raise open hand near forehead and move it outward, like a salute.' },
  { code: 'THANK YOU', label: 'Thank You', category: 'phrase', description: 'Touch fingertips to chin, then move hand forward and down.' },
  { code: 'NAMASTE', label: 'Namaste', category: 'phrase', description: 'Bring both palms together at chest level and nod slightly.' },
  { code: 'YES', label: 'Yes', category: 'phrase', description: 'Make a fist and nod it up and down, like a head nod.' },
  { code: 'NO', label: 'No', category: 'phrase', description: 'Index and middle finger tap thumb closed, like a snapping motion.' },
  { code: 'WELCOME', label: 'Welcome', category: 'phrase', description: 'Sweep open hand from the side toward yourself, palm up.' },
  { code: 'HELP', label: 'Help', category: 'phrase', description: 'Place one fist on the opposite open palm and lift both together.' },
  { code: 'PLEASE', label: 'Please', category: 'phrase', description: 'Rub open palm in a circular motion over the chest.' },
  { code: 'GOODBYE', label: 'Goodbye', category: 'phrase', description: 'Open hand waves side to side at shoulder height.' },
  { code: 'SIGN 2026', label: 'Sign 2026', category: 'phrase', description: 'Custom greeting sign for the SignSync project demo.' },

  ...Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    return {
      code: letter,
      label: `Letter ${letter}`,
      category: 'letter',
      description: `Standard ISL fingerspelling handshape for the letter ${letter}.`,
      image: `/dictionary-images/${letter}.jpg`,
    };
  }),

  ...Array.from({ length: 10 }, (_, i) => ({
    code: String(i),
    label: `Digit ${i}`,
    category: 'digit',
    description: `Standard ISL fingerspelling handshape for the digit ${i}.`,
    image: `/dictionary-images/${i}.jpg`,
  })),
];

const CATEGORY_COLORS = {
  phrase: 'from-indigo-600/40 to-indigo-900/40 border-indigo-500/30',
  letter: 'from-emerald-600/40 to-emerald-900/40 border-emerald-500/30',
  digit: 'from-amber-600/40 to-amber-900/40 border-amber-500/30',
};

export default function SignDictionary({ onSelectSignForPractice }) {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filtered = ISL_DICTIONARY.filter((entry) => {
    const matchesSearch = entry.code.toLowerCase().includes(search.toLowerCase()) ||
      entry.label.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || entry.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white mb-2">ISL Library</h1>
      <p className="text-sm text-slate-400 mb-6">
        Explore our interactive sign dictionary. Click on any sign to practice it.
      </p>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search signs..."
          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
        />
        <div className="flex gap-2">
          {['all', 'phrase', 'letter', 'digit'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
                filter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((entry) => (
          <div
            key={entry.code}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500 transition-colors flex flex-col"
          >
            <div className="px-4 py-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white truncate">{entry.code}</h3>
            </div>

            <div className={`relative aspect-square bg-gradient-to-br ${CATEGORY_COLORS[entry.category]} border-y flex items-center justify-center overflow-hidden`}>
              {entry.image ? (
                <img src={entry.image} alt={entry.label} className="w-full h-full object-cover" />
              ) : (
                <Hand className="w-16 h-16 text-white/70" strokeWidth={1.5} />
              )}
              <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider text-white/80 bg-black/40 px-2 py-0.5 rounded-full">
                {entry.category}
              </span>
            </div>

            <button
              onClick={() => onSelectSignForPractice && onSelectSignForPractice(entry.code)}
              className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-indigo-300 hover:text-white hover:bg-indigo-600/20 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              CLICK TO LEARN
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-12">No signs match your search.</p>
      )}
    </div>
  );
}