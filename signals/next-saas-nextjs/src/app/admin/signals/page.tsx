'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Signal {
  id: number;
  title: string;
  content: string;
  pair: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stop_loss: number;
  take_profit: number;
  current_price?: number;
  confidence: number;
  market: string;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  author: string;
  author_image?: string;
  chart_image?: string;
  published_date: string;
  created_at: string;
  updated_at: string;
  key_levels?: {
    resistance: number[];
    support: number[];
  };
  analyst_stats?: {
    successRate: number;
    totalSignals: number;
    totalPips: number;
  };
  colors?: {
    primary: string;
    secondary: string;
    background: string;
  };
}

interface Drill {
  id: number;
  signal_id: number;
  title: string;
  description: string;
  type: 'CASE_STUDY' | 'BLOG' | 'ANALYTICS';
  content: string;
  order_index: number;
  is_active: boolean;
  image_url?: string;
  created_at: string;
}

export default function SignalsAdminPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [drills, setDrills] = useState<Drill[]>([]);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'signals' | 'drills' | 'create-signal' | 'create-drill'>('overview');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: boolean}>({});
  const [editingSignalId, setEditingSignalId] = useState<number | null>(null);
  const [editingSignal, setEditingSignal] = useState<Partial<Signal> | null>(null);
  const [editingDrillId, setEditingDrillId] = useState<number | null>(null);
  const [editingDrill, setEditingDrill] = useState<Partial<Drill> | null>(null);

  // Available design styles
  const designStyles = [
    {
      id: 'classic',
      name: 'Classic Blue',
      colors: { primary: '#2563EB', secondary: '#10B981', background: '#EFF6FF', text: '#1F2937', accent: '#F59E0B' }
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      colors: { primary: '#F97316', secondary: '#EF4444', background: '#111827', text: '#F9FAFB', accent: '#FBBF24' }
    },
    {
      id: 'gradient',
      name: 'Gradient',
      colors: { primary: '#8B5CF6', secondary: '#EC4899', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#FFFFFF', accent: '#F59E0B' }
    },
    {
      id: 'minimal',
      name: 'Minimal',
      colors: { primary: '#374151', secondary: '#6B7280', background: '#FFFFFF', text: '#111827', accent: '#EF4444' }
    },
    {
      id: 'neon',
      name: 'Neon',
      colors: { primary: '#00FF88', secondary: '#FF0080', background: '#000000', text: '#00FF88', accent: '#FFFF00' }
    },
    {
      id: 'corporate',
      name: 'Corporate',
      colors: { primary: '#1E40AF', secondary: '#DC2626', background: '#F8FAFC', text: '#0F172A', accent: '#F59E0B' }
    },
    {
      id: 'retro',
      name: 'Retro',
      colors: { primary: '#DC2626', secondary: '#F59E0B', background: '#FEF3C7', text: '#92400E', accent: '#059669' }
    },
    {
      id: 'glass',
      name: 'Glass Morphism',
      colors: { primary: '#3B82F6', secondary: '#8B5CF6', background: 'rgba(255, 255, 255, 0.25)', text: '#1F2937', accent: '#10B981' }
    },
    {
      id: 'contrast',
      name: 'High Contrast',
      colors: { primary: '#000000', secondary: '#FFFFFF', background: '#FFFF00', text: '#000000', accent: '#FF0000' }
    },
    {
      id: 'pastel',
      name: 'Pastel',
      colors: { primary: '#EC4899', secondary: '#8B5CF6', background: '#FDF2F8', text: '#831843', accent: '#06B6D4' }
    }
  ];

  // Form states
  const [newSignal, setNewSignal] = useState({
    title: '',
    content: '',
    pair: '',
    action: 'BUY' as const,
    entry: '',
    stop_loss: '',
    take_profit: '',
    current_price: '',
    confidence: '80',
    market: 'FOREX',
    priority: 'MEDIUM' as const,
    author: '',
    chart_image: '',
    design: 'classic',
    colors: {
      primary: '#2563EB',
      secondary: '#10B981',
      background: '#EFF6FF',
      text: '#1F2937',
      accent: '#F59E0B'
    }
  });

  const [newDrill, setNewDrill] = useState({
    signal_id: '',
    title: '',
    description: '',
    type: 'CASE_STUDY' as const,
    content: '',
    image_url: ''
  });

  const [drillValidationErrors, setDrillValidationErrors] = useState<{[key: string]: boolean}>({});

  // Sample data
  const sampleSignals: Signal[] = [
    {
      id: 1,
      title: 'EUR/USD Strong BUY Signal Generated',
      content: 'Technical analysis shows bullish momentum with RSI recovering from oversold territory. MACD shows bullish crossover with increasing volume supporting the upward move.',
      pair: 'EUR/USD',
      action: 'BUY',
      entry: 1.085,
      stop_loss: 1.082,
      take_profit: 1.092,
      current_price: 1.0885,
      confidence: 87,
      market: 'FOREX',
      status: 'ACTIVE',
      priority: 'HIGH',
      author: 'Ahmad Ali',
      author_image: '/images/avatars/ahmad-ali.jpg',
      chart_image: '/images/charts/eurusd-chart.jpg',
      published_date: '2025-01-15',
      created_at: '2025-01-15T10:00:00Z',
      updated_at: '2025-01-15T10:00:00Z',
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        background: '#F3F4F6'
      }
    },
    {
      id: 2,
      title: 'GBP/JPY Bearish Setup - SELL Signal',
      content: 'Strong bearish divergence on hourly chart with rejection at key resistance level. Risk sentiment deteriorating supports JPY strength.',
      pair: 'GBP/JPY',
      action: 'SELL',
      entry: 195.45,
      stop_loss: 196.80,
      take_profit: 192.20,
      current_price: 194.85,
      confidence: 82,
      market: 'FOREX',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      author: 'Sarah Chen',
      author_image: '/images/avatars/sarah-chen.jpg',
      chart_image: '/images/charts/gbpjpy-chart.jpg',
      published_date: '2025-01-14',
      created_at: '2025-01-14T15:30:00Z',
      updated_at: '2025-01-14T15:30:00Z',
      colors: {
        primary: '#EF4444',
        secondary: '#F59E0B',
        background: '#FEF2F2'
      }
    }
  ];

  const sampleDrills: Drill[] = [
    {
      id: 1,
      signal_id: 1,
      title: 'EUR/USD Technical Analysis Deep Dive',
      description: 'Complete breakdown of the technical factors driving this signal',
      type: 'CASE_STUDY',
      content: 'This case study examines the EUR/USD technical setup that led to our strong BUY recommendation...',
      order_index: 1,
      is_active: true,
      image_url: '/images/drills/eurusd-case-study.jpg',
      created_at: '2025-01-15T10:05:00Z'
    },
    {
      id: 2,
      signal_id: 1,
      title: 'Real-Time Analytics Dashboard',
      description: 'Live performance metrics and analytics for this signal',
      type: 'ANALYTICS',
      content: 'Interactive dashboard showing real-time performance data...',
      order_index: 2,
      is_active: true,
      image_url: '/images/drills/analytics-dashboard.jpg',
      created_at: '2025-01-15T10:10:00Z'
    }
  ];

  // Check for existing admin session on component mount and fetch real data
  useEffect(() => {
    const adminSession = sessionStorage.getItem('admin_verified');
    if (adminSession === 'true') {
      setIsPasswordVerified(true);
      fetchSignalsAndDrills();
    }
  }, []);

  // Fetch signals and drills from API
  const fetchSignalsAndDrills = async () => {
    try {
      // Fetch signals from API
      const signalsResponse = await fetch('/api/signals?limit=50'); // Get more signals for admin
      const signalsData = await signalsResponse.json();

      if (signalsData.signals) {
        // Convert API format to admin format and add sample colors
        const convertedSignals = signalsData.signals.map((signal: any, index: number) => ({
          ...signal,
          colors: sampleSignals[index % sampleSignals.length]?.colors || {
            primary: '#2563EB',
            secondary: '#10B981',
            background: '#EFF6FF',
            text: '#1F2937',
            accent: '#F59E0B'
          }
        }));
        setSignals(convertedSignals);
      }

      // Fetch drills from API
      const drillsResponse = await fetch('/api/drills?limit=50');
      const drillsData = await drillsResponse.json();

      if (drillsData.drills) {
        setDrills(drillsData.drills);
        console.log(`📊 Loaded ${drillsData.drills.length} drills from ${drillsData.source}`);
      }
    } catch (error) {
      console.error('Error fetching signals:', error);
      // Fallback to sample data if API fails
      setSignals(sampleSignals);
      setDrills(sampleDrills);
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === '6262') {
      setIsPasswordVerified(true);
      setPasswordInput('');
      setError(null);
      sessionStorage.setItem('admin_verified', 'true');
      fetchSignalsAndDrills(); // Fetch real data on login
    } else {
      setError('Invalid admin password');
      setPasswordInput('');
    }
  };

  // Handle style selection
  const handleStyleChange = (styleId: string) => {
    const selectedStyle = designStyles.find(style => style.id === styleId);
    if (selectedStyle) {
      setNewSignal({
        ...newSignal,
        design: styleId,
        colors: selectedStyle.colors
      });
    }
  };

  // Clear validation error for a specific field
  const clearValidationError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: false
      }));
      // Clear general error message if no more validation errors
      const remainingErrors = Object.entries(validationErrors).filter(([key, value]) => key !== field && value);
      if (remainingErrors.length === 0) {
        setError(null);
      }
    }
  };

  // Clear drill validation error for a specific field
  const clearDrillValidationError = (field: string) => {
    if (drillValidationErrors[field]) {
      setDrillValidationErrors(prev => ({
        ...prev,
        [field]: false
      }));
      // Clear general error message if no more validation errors
      const remainingErrors = Object.entries(drillValidationErrors).filter(([key, value]) => key !== field && value);
      if (remainingErrors.length === 0) {
        setError(null);
      }
    }
  };

  const handleCreateSignal = async () => {
    // Check required fields and mark missing ones in red
    const errors: {[key: string]: boolean} = {};
    const requiredFields = {
      title: newSignal.title,
      pair: newSignal.pair,
      entry: newSignal.entry,
      stop_loss: newSignal.stop_loss,
      take_profit: newSignal.take_profit
    };

    let hasErrors = false;
    Object.entries(requiredFields).forEach(([field, value]) => {
      if (!value || value.toString().trim() === '') {
        errors[field] = true;
        hasErrors = true;
      }
    });

    setValidationErrors(errors);

    if (hasErrors) {
      setError('Please fill in all required fields (marked in red)');
      return;
    }

    try {
      // Create signal data for API
      const signalData = {
        title: newSignal.title,
        content: newSignal.content,
        pair: newSignal.pair.toUpperCase(),
        action: newSignal.action,
        entry: parseFloat(newSignal.entry),
        stop_loss: parseFloat(newSignal.stop_loss),
        take_profit: parseFloat(newSignal.take_profit),
        current_price: newSignal.current_price ? parseFloat(newSignal.current_price) : null,
        confidence: parseInt(newSignal.confidence),
        market: newSignal.market,
        author: newSignal.author || 'Admin User',
        chart_image: newSignal.chart_image,
        published_date: new Date().toISOString()
      };

      // POST to API
      const response = await fetch('/api/signals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signalData),
      });

      if (!response.ok) {
        throw new Error('Failed to create signal');
      }

      const result = await response.json();

      // Create local signal object for immediate display
      const signal: Signal = {
        id: result.signal.id,
        title: result.signal.title,
        content: result.signal.content,
        pair: result.signal.pair,
        action: result.signal.action,
        entry: result.signal.entry,
        stop_loss: result.signal.stop_loss,
        take_profit: result.signal.take_profit,
        current_price: result.signal.current_price,
        confidence: result.signal.confidence,
        market: result.signal.market,
        status: result.signal.status,
        priority: newSignal.priority,
        author: result.signal.author,
        chart_image: result.signal.chart_image,
        published_date: result.signal.published_date,
        created_at: result.signal.created_at,
        updated_at: result.signal.updated_at,
        colors: newSignal.colors
      };

      setSignals([signal, ...signals]); // Add to top of list
      setSuccess('✅ Signal created successfully and is now live on the homepage! It will appear in the timeline within 30 seconds.');
      setActiveTab('signals');
      setValidationErrors({}); // Clear validation errors
      setError(null); // Clear any error messages
    } catch (error) {
      console.error('Error creating signal:', error);
      setError('Failed to create signal. Please try again.');
      return;
    }

    // Reset form
    setNewSignal({
      title: '',
      content: '',
      pair: '',
      action: 'BUY',
      entry: '',
      stop_loss: '',
      take_profit: '',
      current_price: '',
      confidence: '80',
      market: 'FOREX',
      priority: 'MEDIUM',
      author: '',
      chart_image: '',
      design: 'classic',
      colors: {
        primary: '#2563EB',
        secondary: '#10B981',
        background: '#EFF6FF',
        text: '#1F2937',
        accent: '#F59E0B'
      }
    });
  };

  const handleEditSignal = (signal: Signal) => {
    setEditingSignalId(signal.id);
    setEditingSignal({
      ...signal,
      entry: signal.entry.toString(),
      stop_loss: signal.stop_loss.toString(),
      take_profit: signal.take_profit.toString(),
      current_price: signal.current_price?.toString() || '',
      confidence: signal.confidence.toString()
    });
  };

  const handleCancelEdit = () => {
    setEditingSignalId(null);
    setEditingSignal(null);
    setValidationErrors({});
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingSignal || editingSignalId === null) return;

    // Validate required fields
    const errors: {[key: string]: boolean} = {};
    const requiredFields = {
      title: editingSignal.title,
      pair: editingSignal.pair,
      entry: editingSignal.entry,
      stop_loss: editingSignal.stop_loss,
      take_profit: editingSignal.take_profit
    };

    let hasErrors = false;
    Object.entries(requiredFields).forEach(([field, value]) => {
      if (!value || value.toString().trim() === '') {
        errors[field] = true;
        hasErrors = true;
      }
    });

    setValidationErrors(errors);

    if (hasErrors) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Update signal in the API
      const updateData = {
        title: editingSignal.title,
        content: editingSignal.content,
        pair: editingSignal.pair?.toUpperCase(),
        action: editingSignal.action,
        entry: parseFloat(editingSignal.entry as any),
        stop_loss: parseFloat(editingSignal.stop_loss as any),
        take_profit: parseFloat(editingSignal.take_profit as any),
        current_price: editingSignal.current_price ? parseFloat(editingSignal.current_price as any) : null,
        confidence: parseInt(editingSignal.confidence as any),
        market: editingSignal.market,
        status: editingSignal.status,
        priority: editingSignal.priority,
        author: editingSignal.author
      };

      const response = await fetch(`/api/signals/${editingSignalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update signal');
      }

      // Update local state
      setSignals(signals.map(s =>
        s.id === editingSignalId
          ? { ...s, ...editingSignal,
              entry: parseFloat(editingSignal.entry as any),
              stop_loss: parseFloat(editingSignal.stop_loss as any),
              take_profit: parseFloat(editingSignal.take_profit as any),
              current_price: editingSignal.current_price ? parseFloat(editingSignal.current_price as any) : undefined,
              confidence: parseInt(editingSignal.confidence as any)
            }
          : s
      ));

      setSuccess('✅ Signal updated successfully!');
      handleCancelEdit();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating signal:', error);
      setError('Failed to update signal. Please try again.');
    }
  };

  const handleDeleteSignal = async (signalId: number) => {
    if (!confirm('Are you sure you want to delete this signal?')) return;

    try {
      const response = await fetch(`/api/signals/${signalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete signal');
      }

      setSignals(signals.filter(s => s.id !== signalId));
      setSuccess('✅ Signal deleted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting signal:', error);
      setError('Failed to delete signal. Please try again.');
    }
  };

  const handleEditDrill = (drill: Drill) => {
    setEditingDrillId(drill.id);
    setEditingDrill({
      ...drill
    });
  };

  const handleCancelDrillEdit = () => {
    setEditingDrillId(null);
    setEditingDrill(null);
    setDrillValidationErrors({});
    setError(null);
  };

  const handleSaveDrillEdit = async () => {
    if (!editingDrill || editingDrillId === null) return;

    // Validate required fields
    const errors: {[key: string]: boolean} = {};
    const requiredFields = {
      title: editingDrill.title,
      content: editingDrill.content
    };

    let hasErrors = false;
    Object.entries(requiredFields).forEach(([field, value]) => {
      if (!value || value.toString().trim() === '') {
        errors[field] = true;
        hasErrors = true;
      }
    });

    setDrillValidationErrors(errors);

    if (hasErrors) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Update drill in the API
      const updateData = {
        signal_id: editingDrill.signal_id,
        title: editingDrill.title,
        description: editingDrill.description,
        type: editingDrill.type,
        content: editingDrill.content,
        image_url: editingDrill.image_url,
        is_active: editingDrill.is_active
      };

      const response = await fetch(`/api/drills/${editingDrillId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update drill');
      }

      // Update local state
      setDrills(drills.map(d =>
        d.id === editingDrillId
          ? { ...d, ...editingDrill }
          : d
      ));

      setSuccess('✅ Drill updated successfully!');
      handleCancelDrillEdit();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating drill:', error);
      setError('Failed to update drill. Please try again.');
    }
  };

  const handleDeleteDrill = async (drillId: number) => {
    if (!confirm('Are you sure you want to delete this drill?')) return;

    try {
      const response = await fetch(`/api/drills/${drillId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete drill');
      }

      setDrills(drills.filter(d => d.id !== drillId));
      setSuccess('✅ Drill deleted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting drill:', error);
      setError('Failed to delete drill. Please try again.');
    }
  };

  const handleCreateDrill = () => {
    // Check required fields and mark missing ones in red
    const errors: {[key: string]: boolean} = {};
    const requiredFields = {
      signal_id: newDrill.signal_id,
      title: newDrill.title,
      content: newDrill.content
    };

    let hasErrors = false;
    Object.entries(requiredFields).forEach(([field, value]) => {
      if (!value || value.toString().trim() === '') {
        errors[field] = true;
        hasErrors = true;
      }
    });

    setDrillValidationErrors(errors);

    if (hasErrors) {
      setError('Please fill in all required fields (marked in red)');
      return;
    }

    const drill: Drill = {
      id: drills.length + 1,
      signal_id: parseInt(newDrill.signal_id),
      title: newDrill.title,
      description: newDrill.description,
      type: newDrill.type,
      content: newDrill.content,
      order_index: drills.filter(d => d.signal_id === parseInt(newDrill.signal_id)).length + 1,
      is_active: true,
      image_url: newDrill.image_url,
      created_at: new Date().toISOString()
    };

    setDrills([...drills, drill]);
    setSuccess('Drill created successfully!');
    setActiveTab('drills');
    setDrillValidationErrors({}); // Clear validation errors
    setError(null); // Clear any error messages

    // Reset form
    setNewDrill({
      signal_id: '',
      title: '',
      description: '',
      type: 'CASE_STUDY',
      content: '',
      image_url: ''
    });
  };

  if (!isPasswordVerified) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Admin Access Required
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            <button
              onClick={handlePasswordSubmit}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Access Signals Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                📈 Signals & Drills Admin
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Professional trading content management system
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/signals/test-designs"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                🎨 View Test Designs
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                ← Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'signals', label: '📈 Manage Signals', icon: '📈' },
              { id: 'drills', label: '📚 Manage Drills', icon: '📚' },
              { id: 'create-signal', label: '➕ Create Signal', icon: '➕' },
              { id: 'create-drill', label: '🔧 Create Drill', icon: '🔧' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-400 rounded-lg">
            {success}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="text-3xl text-green-600 mr-4">📈</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{signals.length}</p>
                    <p className="text-gray-600 dark:text-gray-400">Total Signals</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="text-3xl text-blue-600 mr-4">📚</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{drills.length}</p>
                    <p className="text-gray-600 dark:text-gray-400">Total Drills</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="text-3xl text-orange-600 mr-4">🟢</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {signals.filter(s => s.status === 'ACTIVE').length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Active Signals</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="text-3xl text-purple-600 mr-4">✅</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {drills.filter(d => d.is_active).length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Active Drills</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('create-signal')}
                  className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">➕</div>
                  <div className="font-medium">Create New Signal</div>
                  <div className="text-sm text-green-100">Add trading signal with charts</div>
                </button>
                <button
                  onClick={() => setActiveTab('create-drill')}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-medium">Create New Drill</div>
                  <div className="text-sm text-blue-100">Add educational content</div>
                </button>
                <Link
                  href="/admin/signals/test-designs"
                  className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left block"
                >
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-medium">View Test Designs</div>
                  <div className="text-sm text-purple-100">Preview 10 signal designs</div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Manage Signals ({signals.length})</h2>
              <div className="space-y-4">
                {signals.map((signal) => (
                  <div key={signal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    {editingSignalId === signal.id ? (
                      // Edit mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input
                              type="text"
                              value={editingSignal?.title || ''}
                              onChange={(e) => setEditingSignal({...editingSignal, title: e.target.value})}
                              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white ${
                                validationErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pair</label>
                            <input
                              type="text"
                              value={editingSignal?.pair || ''}
                              onChange={(e) => setEditingSignal({...editingSignal, pair: e.target.value})}
                              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white ${
                                validationErrors.pair ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action</label>
                            <select
                              value={editingSignal?.action || 'BUY'}
                              onChange={(e) => setEditingSignal({...editingSignal, action: e.target.value as 'BUY' | 'SELL'})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                            >
                              <option value="BUY">BUY</option>
                              <option value="SELL">SELL</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entry</label>
                            <input
                              type="number"
                              step="0.0001"
                              value={editingSignal?.entry || ''}
                              onChange={(e) => setEditingSignal({...editingSignal, entry: e.target.value})}
                              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white ${
                                validationErrors.entry ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stop Loss</label>
                            <input
                              type="number"
                              step="0.0001"
                              value={editingSignal?.stop_loss || ''}
                              onChange={(e) => setEditingSignal({...editingSignal, stop_loss: e.target.value})}
                              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white ${
                                validationErrors.stop_loss ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Take Profit</label>
                            <input
                              type="number"
                              step="0.0001"
                              value={editingSignal?.take_profit || ''}
                              onChange={(e) => setEditingSignal({...editingSignal, take_profit: e.target.value})}
                              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white ${
                                validationErrors.take_profit ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confidence %</label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={editingSignal?.confidence || ''}
                              onChange={(e) => setEditingSignal({...editingSignal, confidence: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                              value={editingSignal?.status || 'ACTIVE'}
                              onChange={(e) => setEditingSignal({...editingSignal, status: e.target.value as 'ACTIVE' | 'CLOSED' | 'CANCELLED'})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                            >
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="CLOSED">CLOSED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Market</label>
                            <select
                              value={editingSignal?.market || 'FOREX'}
                              onChange={(e) => setEditingSignal({...editingSignal, market: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                            >
                              <option value="FOREX">Forex</option>
                              <option value="CRYPTO">Crypto</option>
                              <option value="STOCKS">Stocks</option>
                              <option value="COMMODITIES">Commodities</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                          <textarea
                            rows={3}
                            value={editingSignal?.content || ''}
                            onChange={(e) => setEditingSignal({...editingSignal, content: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{signal.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">{signal.pair} • {signal.action} • {signal.confidence}%</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              signal.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {signal.status}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {signal.market}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSignal(signal)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSignal(signal.id)}
                            className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drills' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Manage Drills ({drills.length})</h2>
              <div className="space-y-4">
                {drills.map((drill) => {
                  const associatedSignal = signals.find(s => s.id === drill.signal_id);
                  return (
                    <div key={drill.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      {editingDrillId === drill.id ? (
                        // Edit mode
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Associated Signal</label>
                            <select
                              value={editingDrill?.signal_id || ''}
                              onChange={(e) => setEditingDrill({...editingDrill, signal_id: parseInt(e.target.value)})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                            >
                              <option value="">Select a signal...</option>
                              {signals.map((signal) => (
                                <option key={signal.id} value={signal.id}>
                                  {signal.title} ({signal.pair})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input
                              type="text"
                              value={editingDrill?.title || ''}
                              onChange={(e) => setEditingDrill({...editingDrill, title: e.target.value})}
                              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white ${
                                drillValidationErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <input
                              type="text"
                              value={editingDrill?.description || ''}
                              onChange={(e) => setEditingDrill({...editingDrill, description: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                              <select
                                value={editingDrill?.type || 'CASE_STUDY'}
                                onChange={(e) => setEditingDrill({...editingDrill, type: e.target.value as 'CASE_STUDY' | 'BLOG' | 'ANALYTICS'})}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                              >
                                <option value="CASE_STUDY">Case Study</option>
                                <option value="BLOG">Blog</option>
                                <option value="ANALYTICS">Analytics</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                              <select
                                value={editingDrill?.is_active ? 'active' : 'inactive'}
                                onChange={(e) => setEditingDrill({...editingDrill, is_active: e.target.value === 'active'})}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                            <textarea
                              rows={4}
                              value={editingDrill?.content || ''}
                              onChange={(e) => setEditingDrill({...editingDrill, content: e.target.value})}
                              className={`w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white ${
                                drillValidationErrors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                            <input
                              type="url"
                              value={editingDrill?.image_url || ''}
                              onChange={(e) => setEditingDrill({...editingDrill, image_url: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={handleCancelDrillEdit}
                              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveDrillEdit}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{drill.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{drill.description}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {drill.type.replace('_', ' ')}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                                Signal: {associatedSignal?.pair || 'Unknown'}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                drill.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {drill.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditDrill(drill)}
                              className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-sm transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDrill(drill.id)}
                              className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create-signal' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Create New Signal</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    validationErrors.title ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Signal Title *
                  </label>
                  <input
                    type="text"
                    value={newSignal.title}
                    onChange={(e) => {
                      setNewSignal({...newSignal, title: e.target.value});
                      clearValidationError('title');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      validationErrors.title
                        ? 'border-red-500 ring-2 ring-red-200 dark:border-red-500 dark:ring-red-800'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="e.g., EUR/USD Strong BUY Signal"
                  />
                  {validationErrors.title && (
                    <p className="text-red-500 text-xs mt-1">This field is required</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      validationErrors.pair ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Currency Pair *
                    </label>
                    <input
                      type="text"
                      value={newSignal.pair}
                      onChange={(e) => {
                        setNewSignal({...newSignal, pair: e.target.value});
                        clearValidationError('pair');
                      }}
                      className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                        validationErrors.pair
                          ? 'border-red-500 ring-2 ring-red-200 dark:border-red-500 dark:ring-red-800'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="EUR/USD"
                    />
                    {validationErrors.pair && (
                      <p className="text-red-500 text-xs mt-1">This field is required</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Action *
                    </label>
                    <select
                      value={newSignal.action}
                      onChange={(e) => setNewSignal({...newSignal, action: e.target.value as 'BUY' | 'SELL'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      validationErrors.entry ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Entry Price *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newSignal.entry}
                      onChange={(e) => {
                        setNewSignal({...newSignal, entry: e.target.value});
                        clearValidationError('entry');
                      }}
                      className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                        validationErrors.entry
                          ? 'border-red-500 ring-2 ring-red-200 dark:border-red-500 dark:ring-red-800'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="1.0850"
                    />
                    {validationErrors.entry && (
                      <p className="text-red-500 text-xs mt-1">Required</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      validationErrors.stop_loss ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Stop Loss *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newSignal.stop_loss}
                      onChange={(e) => {
                        setNewSignal({...newSignal, stop_loss: e.target.value});
                        clearValidationError('stop_loss');
                      }}
                      className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                        validationErrors.stop_loss
                          ? 'border-red-500 ring-2 ring-red-200 dark:border-red-500 dark:ring-red-800'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="1.0820"
                    />
                    {validationErrors.stop_loss && (
                      <p className="text-red-500 text-xs mt-1">Required</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      validationErrors.take_profit ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Take Profit *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newSignal.take_profit}
                      onChange={(e) => {
                        setNewSignal({...newSignal, take_profit: e.target.value});
                        clearValidationError('take_profit');
                      }}
                      className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                        validationErrors.take_profit
                          ? 'border-red-500 ring-2 ring-red-200 dark:border-red-500 dark:ring-red-800'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="1.0920"
                    />
                    {validationErrors.take_profit && (
                      <p className="text-red-500 text-xs mt-1">Required</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confidence %
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newSignal.confidence}
                      onChange={(e) => setNewSignal({...newSignal, confidence: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Market
                    </label>
                    <select
                      value={newSignal.market}
                      onChange={(e) => setNewSignal({...newSignal, market: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="FOREX">Forex</option>
                      <option value="CRYPTO">Crypto</option>
                      <option value="STOCKS">Stocks</option>
                      <option value="COMMODITIES">Commodities</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Analysis Description
                  </label>
                  <textarea
                    rows={4}
                    value={newSignal.content}
                    onChange={(e) => setNewSignal({...newSignal, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Detailed technical analysis explaining the signal..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chart Image URL
                  </label>
                  <input
                    type="url"
                    value={newSignal.chart_image}
                    onChange={(e) => setNewSignal({...newSignal, chart_image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/chart.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={newSignal.author}
                    onChange={(e) => setNewSignal({...newSignal, author: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                {/* Design Style Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    🎨 Choose Design Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                    {designStyles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => handleStyleChange(style.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newSignal.design === style.id
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded mb-2"
                          style={{
                            background: style.colors.background.includes('gradient')
                              ? style.colors.background
                              : style.colors.background
                          }}
                        />
                        <div className="flex gap-1 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: style.colors.primary }}
                          />
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: style.colors.secondary }}
                          />
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: style.colors.accent }}
                          />
                        </div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {style.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Color Customization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    🎯 Fine-tune Colors (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Primary Color</label>
                      <input
                        type="color"
                        value={newSignal.colors.primary}
                        onChange={(e) => setNewSignal({
                          ...newSignal,
                          colors: {...newSignal.colors, primary: e.target.value}
                        })}
                        className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Secondary Color</label>
                      <input
                        type="color"
                        value={newSignal.colors.secondary}
                        onChange={(e) => setNewSignal({
                          ...newSignal,
                          colors: {...newSignal.colors, secondary: e.target.value}
                        })}
                        className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Accent Color</label>
                      <input
                        type="color"
                        value={newSignal.colors.accent || '#F59E0B'}
                        onChange={(e) => setNewSignal({
                          ...newSignal,
                          colors: {...newSignal.colors, accent: e.target.value}
                        })}
                        className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateSignal}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  🚀 Create Signal
                </button>
              </div>

              {/* Preview - Matching existing signal card size */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">👁️ Live Preview</h3>
                <div className="max-w-sm mx-auto">
                  <div
                    className="rounded-lg p-4 border shadow-lg transition-all duration-300 hover:scale-105"
                    style={{
                      background: newSignal.colors.background.includes('gradient')
                        ? newSignal.colors.background
                        : newSignal.colors.background,
                      color: newSignal.colors.text || '#1F2937',
                      borderColor: newSignal.colors.primary,
                      boxShadow: newSignal.design === 'neon'
                        ? `0 0 20px ${newSignal.colors.primary}40`
                        : newSignal.design === 'glass'
                        ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                        : '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Signal Header - matching SignalsFeed layout */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold" style={{ color: newSignal.colors.primary }}>
                          {newSignal.pair || 'EUR/USD'}
                        </h4>
                        <p className="text-xs opacity-70">
                          {new Date().toLocaleString()}
                        </p>
                      </div>
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${newSignal.colors.accent || newSignal.colors.secondary}20`,
                          color: newSignal.colors.accent || newSignal.colors.secondary
                        }}
                      >
                        ACTIVE
                      </span>
                    </div>

                    {/* Signal Type & Confidence */}
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-lg font-bold"
                        style={{
                          color: newSignal.action === 'BUY' ? newSignal.colors.secondary : newSignal.colors.primary,
                          textShadow: newSignal.design === 'neon' ? `0 0 10px ${newSignal.colors.primary}` : 'none'
                        }}
                      >
                        {newSignal.action}
                      </span>
                      <span className="text-xs font-bold" style={{ color: newSignal.colors.text }}>
                        {newSignal.confidence}%
                      </span>
                    </div>

                    {/* Chart Image */}
                    {newSignal.chart_image && (
                      <div className="mb-3">
                        <img
                          src={newSignal.chart_image}
                          alt="Chart preview"
                          className="w-full h-20 object-cover rounded"
                          style={{
                            filter: newSignal.design === 'neon' ? 'hue-rotate(90deg) saturate(1.5)' :
                                    newSignal.design === 'contrast' ? 'contrast(2) brightness(1.2)' : 'none'
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Entry, SL, TP - matching SignalsFeed layout */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="opacity-70">Entry</span>
                        <span className="font-semibold" style={{ color: newSignal.colors.text }}>
                          {newSignal.entry || '1.0850'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">SL</span>
                        <span className="font-semibold text-red-500">
                          {newSignal.stop_loss || '1.0820'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">TP</span>
                        <span className="font-semibold text-green-500">
                          {newSignal.take_profit || '1.0920'}
                        </span>
                      </div>
                    </div>

                    {/* Title and Content */}
                    {newSignal.title && (
                      <div className="mt-3 pt-2 border-t border-current border-opacity-20">
                        <h5 className="text-xs font-semibold mb-1" style={{ color: newSignal.colors.primary }}>
                          {newSignal.title.substring(0, 25)}...
                        </h5>
                        {newSignal.content && (
                          <p className="text-xs opacity-80" style={{ color: newSignal.colors.text }}>
                            {newSignal.content.substring(0, 60)}...
                          </p>
                        )}
                      </div>
                    )}

                    {/* Author */}
                    <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                      <div className="text-xs opacity-70">
                        By {newSignal.author || 'Admin User'}
                      </div>
                    </div>

                    {/* Special Effects for certain designs */}
                    {newSignal.design === 'neon' && (
                      <div
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{
                          background: `linear-gradient(45deg, ${newSignal.colors.primary}20, ${newSignal.colors.secondary}20)`,
                          animation: 'pulse 2s infinite'
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Style Info */}
                <div className="mt-4 text-center">
                  <span className="text-xs text-gray-500">
                    Style: {designStyles.find(s => s.id === newSignal.design)?.name || 'Classic'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create-drill' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Create New Drill</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    drillValidationErrors.signal_id ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Associated Signal *
                  </label>
                  <select
                    value={newDrill.signal_id}
                    onChange={(e) => {
                      setNewDrill({...newDrill, signal_id: e.target.value});
                      clearDrillValidationError('signal_id');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      drillValidationErrors.signal_id
                        ? 'border-red-500 ring-2 ring-red-200 dark:border-red-500 dark:ring-red-800'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select a signal...</option>
                    {signals.map((signal) => (
                      <option key={signal.id} value={signal.id.toString()}>
                        {signal.title} ({signal.pair})
                      </option>
                    ))}
                  </select>
                  {drillValidationErrors.signal_id && (
                    <p className="text-red-500 text-xs mt-1">This field is required</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    drillValidationErrors.title ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Drill Title *
                  </label>
                  <input
                    type="text"
                    value={newDrill.title}
                    onChange={(e) => {
                      setNewDrill({...newDrill, title: e.target.value});
                      clearDrillValidationError('title');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      drillValidationErrors.title
                        ? 'border-red-500 ring-2 ring-red-200 dark:border-red-500 dark:ring-red-800'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="e.g., EUR/USD Technical Analysis Deep Dive"
                  />
                  {drillValidationErrors.title && (
                    <p className="text-red-500 text-xs mt-1">This field is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Drill Type *
                  </label>
                  <select
                    value={newDrill.type}
                    onChange={(e) => setNewDrill({...newDrill, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="CASE_STUDY">📊 Case Study</option>
                    <option value="ANALYTICS">📈 Analytics Dashboard</option>
                    <option value="BLOG">📝 Blog Content</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newDrill.description}
                    onChange={(e) => setNewDrill({...newDrill, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Brief description of the drill content"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    drillValidationErrors.content ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Drill Content *
                  </label>
                  <textarea
                    rows={8}
                    value={newDrill.content}
                    onChange={(e) => {
                      setNewDrill({...newDrill, content: e.target.value});
                      clearDrillValidationError('content');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      drillValidationErrors.content
                        ? 'border-red-500 ring-2 ring-red-200 dark:border-red-500 dark:ring-red-800'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Detailed content for the drill. You can include markdown, HTML, or rich text here..."
                  />
                  {drillValidationErrors.content && (
                    <p className="text-red-500 text-xs mt-1">This field is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image/Graph URL
                  </label>
                  <input
                    type="url"
                    value={newDrill.image_url}
                    onChange={(e) => setNewDrill({...newDrill, image_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/drill-image.jpg"
                  />
                </div>

                <button
                  onClick={handleCreateDrill}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  🔧 Create Drill
                </button>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">👁️ Drill Preview</h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      newDrill.type === 'CASE_STUDY' ? 'bg-blue-100 text-blue-800' :
                      newDrill.type === 'ANALYTICS' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {newDrill.type.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {newDrill.title || 'Drill Title Preview'}
                  </h4>

                  {newDrill.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {newDrill.description}
                    </p>
                  )}

                  {newDrill.image_url && (
                    <div className="mb-3">
                      <img
                        src={newDrill.image_url}
                        alt="Drill preview"
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {newDrill.content ?
                      newDrill.content.substring(0, 200) + '...' :
                      'Drill content will appear here...'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles for animations and effects */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}