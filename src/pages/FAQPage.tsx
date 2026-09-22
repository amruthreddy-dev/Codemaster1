import React, { useState } from 'react';
import { FAQItem } from '../types.ts';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQPageProps {
  faqs: FAQItem[];
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ faqs, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0878FF]/10 border border-[#0878FF]/30 text-[#00C8FF] text-xs font-semibold tracking-wider uppercase mb-3">
          HELP & COMMON QUESTIONS
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[#D9E2F0]/80 mt-3">
          Find answers about team formation, event timings, software requirements, and evaluation policies.
        </p>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-[#7F8DA3] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions (e.g. team size, laptop, python, certificate)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#07111F] border border-[#1E293B] text-white placeholder-[#7F8DA3] text-sm focus:outline-none focus:border-[#0878FF] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0878FF] text-white shadow-[0_0_10px_rgba(8,120,255,0.3)]'
                  : 'bg-[#07111F] text-[#7F8DA3] hover:text-white border border-[#1E293B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#07111F] border border-[#1E293B] text-center text-sm text-[#7F8DA3]">
            No questions matching your search criteria.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#07111F] border border-[#1E293B] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#0F1C34]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#00C8FF] shrink-0" />
                    <span className="text-sm font-bold text-white leading-snug">{faq.question}</span>
                  </div>
                  <div className="text-[#7F8DA3] shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#00C8FF]" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#D9E2F0]/80 border-t border-[#1E293B]/50 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Need more help banner */}
      <div className="p-6 rounded-2xl bg-[#0F1C34] border border-[#1E293B] text-center space-y-2">
        <h4 className="text-sm font-bold text-white">Still have questions?</h4>
        <p className="text-xs text-[#7F8DA3]">
          Visit the Department of CSE (AI & ML), School of Computing, Vel Tech University on event morning at Lecture Theatre (33220B).
        </p>
      </div>
    </div>
  );
};
