'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Signal {
  id: number;
  title: string;
  title_ur: string | null;
  content: string;
  content_ur: string | null;
  author: string;
  author_ur: string | null;
  pair: string;
  action: string;
  status: string;
}

interface Drill {
  id: number;
  signal_id: number;
  title: string;
  title_ur: string | null;
  description: string;
  description_ur: string | null;
  content: string;
  content_ur: string | null;
  type: string;
}

interface Translation {
  field: 'title' | 'content' | 'author' | 'description';
  en_value: string;
  ur_value: string | null;
  status: 'complete' | 'partial' | 'empty';
}

export default function TranslationsManagement() {
  const [activeTab, setActiveTab] = useState<'signals' | 'drills'>('signals');
  const [signals, setSignals] = useState<Signal[]>([]);
  const [drills, setDrills] = useState<Drill[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [editingField, setEditingField] = useState<{ type: 'signal' | 'drill', id: number, field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [signalsRes, drillsRes] = await Promise.all([
        fetch('/api/signals'),
        fetch('/api/drills')
      ]);

      const signalsData = await signalsRes.json();
      const drillsData = await drillsRes.json();

      setSignals(signalsData.signals || []);
      setDrills(drillsData.drills || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSignal = (signal: Signal, field: 'title_ur' | 'content_ur' | 'author_ur') => {
    setEditingField({ type: 'signal', id: signal.id, field });
    setEditValue(signal[field] || '');
  };

  const handleEditDrill = (drill: Drill, field: 'title_ur' | 'description_ur' | 'content_ur') => {
    setEditingField({ type: 'drill', id: drill.id, field });
    setEditValue(drill[field] || '');
  };

  const handleSave = async () => {
    if (!editingField) return;

    try {
      const endpoint = editingField.type === 'signal'
        ? `/api/signals/${editingField.id}`
        : `/api/drills/${editingField.id}`;

      await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [editingField.field]: editValue }),
      });

      await loadData();
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const getTranslationStatus = (enValue: string | null, urValue: string | null): 'complete' | 'partial' | 'empty' => {
    if (!urValue) return 'empty';
    if (urValue.length < enValue!.length * 0.5) return 'partial';
    return 'complete';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">✅ Complete</span>;
      case 'partial':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">⚠️ Partial</span>;
      case 'empty':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">❌ Empty</span>;
    }
  };

  const signalDrills = selectedSignal ? drills.filter(d => d.signal_id === selectedSignal.id) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🌍 Translation Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Translate signals and drills to Urdu
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => { setActiveTab('signals'); setSelectedSignal(null); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'signals'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              📈 Signals ({signals.length})
            </button>
            <button
              onClick={() => { setActiveTab('drills'); setSelectedSignal(null); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'drills'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              📚 All Drills ({drills.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <>
            {/* Signals Tab */}
            {activeTab === 'signals' && !selectedSignal && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Signals to Translate
                </h2>
                {signals.map((signal) => (
                  <div key={signal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            signal.action === 'BUY'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {signal.action}
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {signal.pair}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {signal.title}
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Title Translation</p>
                            {getStatusBadge(getTranslationStatus(signal.title, signal.title_ur))}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Content Translation</p>
                            {getStatusBadge(getTranslationStatus(signal.content, signal.content_ur))}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Author Translation</p>
                            {getStatusBadge(getTranslationStatus(signal.author, signal.author_ur))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSignal(signal)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                        >
                          Translate
                        </button>
                        <button
                          onClick={() => setSelectedSignal(signal)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
                        >
                          View Drills ({drills.filter(d => d.signal_id === signal.id).length})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Signal Translation */}
            {selectedSignal && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Translating: {selectedSignal.pair} - {selectedSignal.title}
                  </h2>
                  <button
                    onClick={() => setSelectedSignal(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    ← Back to Signals
                  </button>
                </div>

                {/* Signal Translation Fields */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Signal Content</h3>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">English</p>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">{selectedSignal.title}</div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">اردو (Urdu)</p>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded" dir="rtl">
                          {selectedSignal.title_ur || <span className="text-gray-400">Not translated</span>}
                        </div>
                        <button
                          onClick={() => handleEditSignal(selectedSignal, 'title_ur')}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">English</p>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded h-32 overflow-y-auto">{selectedSignal.content}</div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">اردو (Urdu)</p>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded h-32 overflow-y-auto" dir="rtl">
                          {selectedSignal.content_ur || <span className="text-gray-400">Not translated</span>}
                        </div>
                        <button
                          onClick={() => handleEditSignal(selectedSignal, 'content_ur')}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Author
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">English</p>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">{selectedSignal.author}</div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">اردو (Urdu)</p>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded" dir="rtl">
                          {selectedSignal.author_ur || <span className="text-gray-400">Not translated</span>}
                        </div>
                        <button
                          onClick={() => handleEditSignal(selectedSignal, 'author_ur')}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drills for this Signal */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Drills ({signalDrills.length})
                  </h3>
                  {signalDrills.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No drills for this signal</p>
                  ) : (
                    <div className="space-y-4">
                      {signalDrills.map((drill) => (
                        <div key={drill.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{drill.title}</h4>
                              <p className="text-sm text-gray-500">{drill.type}</p>
                            </div>
                            <div className="flex gap-2">
                              {getStatusBadge(getTranslationStatus(drill.title, drill.title_ur))}
                            </div>
                          </div>

                          {/* Drill Translation Fields - collapsed by default */}
                          <details className="mt-4">
                            <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-medium">
                              View/Edit Translations
                            </summary>
                            <div className="mt-4 space-y-4">
                              {/* Title */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-medium mb-1">Title (EN)</p>
                                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">{drill.title}</div>
                                </div>
                                <div>
                                  <p className="text-xs font-medium mb-1">Title (UR)</p>
                                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm" dir="rtl">
                                    {drill.title_ur || <span className="text-gray-400">Not translated</span>}
                                  </div>
                                  <button
                                    onClick={() => handleEditDrill(drill, 'title_ur')}
                                    className="mt-1 text-xs text-blue-600"
                                  >
                                    ✏️ Edit
                                  </button>
                                </div>
                              </div>

                              {/* Description */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-medium mb-1">Description (EN)</p>
                                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">{drill.description}</div>
                                </div>
                                <div>
                                  <p className="text-xs font-medium mb-1">Description (UR)</p>
                                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm" dir="rtl">
                                    {drill.description_ur || <span className="text-gray-400">Not translated</span>}
                                  </div>
                                  <button
                                    onClick={() => handleEditDrill(drill, 'description_ur')}
                                    className="mt-1 text-xs text-blue-600"
                                  >
                                    ✏️ Edit
                                  </button>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-medium mb-1">Content (EN)</p>
                                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm h-24 overflow-y-auto">{drill.content}</div>
                                </div>
                                <div>
                                  <p className="text-xs font-medium mb-1">Content (UR)</p>
                                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm h-24 overflow-y-auto" dir="rtl">
                                    {drill.content_ur || <span className="text-gray-400">Not translated</span>}
                                  </div>
                                  <button
                                    onClick={() => handleEditDrill(drill, 'content_ur')}
                                    className="mt-1 text-xs text-blue-600"
                                  >
                                    ✏️ Edit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* All Drills Tab */}
            {activeTab === 'drills' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  All Drills
                </h2>
                {drills.map((drill) => {
                  const signal = signals.find(s => s.id === drill.signal_id);
                  return (
                    <div key={drill.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">
                            From Signal: {signal?.pair} - {signal?.title}
                          </p>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {drill.title}
                          </h3>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
                              {getStatusBadge(getTranslationStatus(drill.title, drill.title_ur))}
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                              {getStatusBadge(getTranslationStatus(drill.description, drill.description_ur))}
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Content</p>
                              {getStatusBadge(getTranslationStatus(drill.content, drill.content_ur))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedSignal(signal!);
                            setActiveTab('signals');
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Translate
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Edit Translation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Urdu Translation
                </label>
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  dir="rtl"
                  placeholder="Enter Urdu translation..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEditingField(null);
                    setEditValue('');
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Translation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
