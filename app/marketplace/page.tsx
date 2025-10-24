'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MarketplacePage() {
  const [templates, setTemplates] = useState([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchTemplates();
  }, [category]);

  const fetchTemplates = async () => {
    const response = await fetch(`/api/marketplace?category=${category}`);
    const data = await response.json();
    setTemplates(data.templates);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Template Marketplace</h1>
        <p className="text-gray-600 mb-8">
          Professional templates built by the community
        </p>

        {/* Categories */}
        <div className="flex gap-2 mb-8">
          {['all', 'ecommerce', 'saas', 'dashboard', 'landing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg capitalize ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border hover:border-indigo-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template: any) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <img
        src={template.thumbnail}
        alt={template.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{template.name}</h3>
          <span className="text-lg font-bold text-indigo-600">
            ${template.price}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <span className="text-sm text-gray-500">({template.reviews})</span>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Install
          </button>
        </div>
      </div>
    </motion.div>
  );
}
