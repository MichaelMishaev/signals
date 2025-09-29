'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  type: 'BOOLEAN' | 'STRING' | 'NUMBER' | 'JSON';
  enabled: boolean;
  value?: any;
}

export default function FeatureFlagsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  // Check for existing admin session on component mount
  useEffect(() => {
    const adminSession = sessionStorage.getItem('admin_verified');
    if (adminSession === 'true') {
      setIsPasswordVerified(true);
      setFlags(sampleFlags);
    }
  }, []);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFlag, setNewFlag] = useState({
    key: '',
    name: '',
    description: '',
    type: 'BOOLEAN' as const,
    enabled: false,
    value: null
  });

  // Sample data for demonstration
  const sampleFlags = [
    {
      id: 'sample-1',
      key: 'show_admin_menu',
      name: 'Show Admin Menu',
      description: 'Controls whether the admin menu is visible in the header',
      type: 'BOOLEAN' as const,
      enabled: false,
      value: null
    },
    {
      id: 'sample-2',
      key: 'new_dashboard_ui',
      name: 'New Dashboard UI',
      description: 'Enable the redesigned dashboard interface',
      type: 'BOOLEAN' as const,
      enabled: true,
      value: null
    }
  ];

  const handlePasswordSubmit = () => {
    if (passwordInput === '6262') {
      setIsPasswordVerified(true);
      setPasswordInput('');
      setError(null);
      // Load sample data for demonstration
      setFlags(sampleFlags);
      // Store admin session in sessionStorage
      sessionStorage.setItem('admin_verified', 'true');
    } else {
      setError('Invalid admin password');
      setPasswordInput('');
    }
  };

  const handleCreateFlag = async () => {
    try {
      setError(null);
      // For demo purposes, just add to local state
      const flag = {
        ...newFlag,
        id: `flag-${Date.now()}`
      };
      setFlags([...flags, flag]);
      setSuccess('Feature flag created successfully');
      setShowCreateForm(false);
      setNewFlag({
        key: '',
        name: '',
        description: '',
        type: 'BOOLEAN',
        enabled: false,
        value: null
      });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const toggleFlag = (id: string) => {
    setFlags(flags.map(flag =>
      flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
    ));
    setSuccess('Feature flag updated successfully');
  };

  const deleteFlag = (id: string) => {
    if (confirm('Are you sure you want to delete this feature flag?')) {
      setFlags(flags.filter(flag => flag.id !== id));
      setSuccess('Feature flag deleted successfully');
    }
  };

  // No authentication required - only password check

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
              Access Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredFlags = flags.filter(flag =>
    flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flag.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flag.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with explanation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Feature Flags
                  </h1>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                    {flags.length} flags
                  </span>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  Control which features are visible to users without code changes
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">💡 What are Feature Flags?</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400 mb-2">
                    Feature flags let you turn features on/off instantly without deploying new code.
                    Perfect for A/B testing, gradual rollouts, or hiding features from production users.
                  </p>
                  <div className="text-xs text-blue-700 dark:text-blue-400">
                    Example: Hide admin menu from regular users, test new UI designs, enable beta features
                  </div>
                </div>
              </div>
              <div className="ml-6 flex flex-col gap-2">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium"
                >
                  + Create New Flag
                </button>
                <Link
                  href="/admin"
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-center text-sm"
                >
                  ← Back to Admin
                </Link>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {flags.filter(f => f.enabled).length} flags enabled
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {flags.filter(f => !f.enabled).length} flags disabled
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Used in production & development
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-400 rounded-lg">
            {success}
          </div>
        )}

        {/* Create Flag Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Feature Flag</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Add a new flag to control feature visibility</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Flag Key *
                  </label>
                  <input
                    type="text"
                    value={newFlag.key}
                    onChange={(e) => setNewFlag({ ...newFlag, key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., show_new_feature"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unique identifier used in code</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={newFlag.name}
                    onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Show New Feature"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Human-readable name</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newFlag.description}
                    onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    rows={2}
                    placeholder="Explain what this flag controls and when to use it"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={newFlag.type}
                    onChange={(e) => setNewFlag({ ...newFlag, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="BOOLEAN">Boolean (true/false)</option>
                    <option value="STRING">String (text)</option>
                    <option value="NUMBER">Number</option>
                    <option value="JSON">JSON (complex data)</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newFlag.enabled}
                      onChange={(e) => setNewFlag({ ...newFlag, enabled: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable immediately
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateFlag}
                  disabled={!newFlag.key || !newFlag.name}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create Flag
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="px-6 py-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search flags by name, key, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredFlags.length} of {flags.length} flags
              </div>
            </div>
          </div>
        </div>

        {/* Feature Flags List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Feature Flags</h2>
          </div>

          {filteredFlags.length === 0 ? (
            <div className="px-6 py-12 text-center">
              {flags.length === 0 ? (
                <div>
                  <div className="text-4xl mb-4">🚩</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No feature flags yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Create your first feature flag to start controlling features in your app
                  </p>

                  {/* Visual examples */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Example Use Cases:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-600 rounded-sm flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full ml-1"></div>
                          </div>
                          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">show_admin_menu</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Toggle admin menu visibility</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-600 rounded-sm flex items-center justify-end">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                          </div>
                          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">beta_features</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Enable experimental features</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Your First Flag
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No flags found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFlags.map((flag) => (
                <div key={flag.id} className="px-6 py-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {flag.name}
                        </h3>
                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-400">
                          {flag.key}
                        </code>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          flag.enabled
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {flag.enabled ? 'ON' : 'OFF'}
                        </span>
                      </div>

                      {flag.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {flag.description}
                        </p>
                      )}

                      {/* What this flag does */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-3">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                          💡 What this flag does:
                        </h4>
                        {flag.key === 'show_admin_menu' ? (
                          <div className="text-sm text-blue-800 dark:text-blue-400">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              {/* Admin Menu ON */}
                              <div className="bg-white dark:bg-gray-800 border rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  <span className="text-xs font-medium text-green-600">ADMIN VISIBLE (When ON)</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                                  <div className="flex justify-between items-center text-xs">
                                    <div className="flex gap-3">
                                      <span className="text-gray-600">Home</span>
                                      <span className="text-gray-600">About</span>
                                      <span className="text-gray-600">Contact</span>
                                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Admin</span>
                                    </div>
                                    <div className="w-4 h-2 bg-blue-500 rounded"></div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Admin menu shows in navigation</p>
                              </div>

                              {/* Admin Menu OFF */}
                              <div className="bg-white dark:bg-gray-800 border rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                  <span className="text-xs font-medium text-red-600">ADMIN HIDDEN (When OFF)</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                                  <div className="flex justify-between items-center text-xs">
                                    <div className="flex gap-3">
                                      <span className="text-gray-600">Home</span>
                                      <span className="text-gray-600">About</span>
                                      <span className="text-gray-600">Contact</span>
                                    </div>
                                    <div className="w-4 h-2 bg-blue-500 rounded"></div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">No admin menu for regular users</p>
                              </div>
                            </div>
                            <p className="text-xs text-blue-700 dark:text-blue-500">
                              💡 Perfect for hiding admin features from production users while keeping them available for testing
                            </p>
                          </div>
                        ) : flag.key === 'new_dashboard_ui' ? (
                          <div className="text-sm text-blue-800 dark:text-blue-400">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              {/* New Design Preview */}
                              <div className="bg-white dark:bg-gray-800 border rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  <span className="text-xs font-medium text-green-600">NEW (When ON)</span>
                                </div>
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded p-3 text-white text-xs">
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="flex gap-1">
                                      <div className="w-2 h-2 bg-white/70 rounded"></div>
                                      <div className="w-2 h-2 bg-white/70 rounded"></div>
                                      <div className="w-2 h-2 bg-white/70 rounded"></div>
                                    </div>
                                    <div className="w-4 h-2 bg-white/50 rounded"></div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="w-full h-1 bg-white/30 rounded"></div>
                                    <div className="w-3/4 h-1 bg-white/30 rounded"></div>
                                    <div className="w-1/2 h-1 bg-white/30 rounded"></div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Modern gradient design, clean layout</p>
                              </div>

                              {/* Old Design Preview */}
                              <div className="bg-white dark:bg-gray-800 border rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                  <span className="text-xs font-medium text-red-600">OLD (When OFF)</span>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-700 border rounded p-3 text-xs">
                                  <div className="flex justify-between items-center mb-2 border-b pb-1">
                                    <div className="flex gap-1">
                                      <div className="w-3 h-2 bg-gray-400 rounded"></div>
                                      <div className="w-3 h-2 bg-gray-400 rounded"></div>
                                    </div>
                                    <div className="w-4 h-2 bg-gray-400 rounded"></div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="w-3/4 h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="w-1/2 h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Legacy gray design, basic styling</p>
                              </div>
                            </div>
                            <p className="text-xs text-blue-700 dark:text-blue-500">
                              💡 Great for A/B testing new designs or gradual rollouts
                            </p>
                          </div>
                        ) : (
                          <div className="text-sm text-blue-800 dark:text-blue-400">
                            <p className="mb-2"><strong>When ON:</strong> This feature is active and visible to users</p>
                            <p className="mb-2"><strong>When OFF:</strong> This feature is disabled and hidden</p>
                            <p className="text-xs text-blue-700 dark:text-blue-500">
                              💡 Toggle anytime without code changes or deployments
                            </p>
                          </div>
                        )}
                      </div>

                      {/* How to use it */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          🛠️ How to use in code:
                        </h4>
                        <div className="bg-gray-800 text-green-400 p-2 rounded text-xs font-mono">
                          {`if (useFeatureFlag('${flag.key}')) {`}<br/>
                          &nbsp;&nbsp;{`// Show the feature`}<br/>
                          {`} else {`}<br/>
                          &nbsp;&nbsp;{`// Hide the feature`}<br/>
                          {`}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Type: {flag.type}</span>
                        <span>•</span>
                        <span>Status: {flag.enabled ? '🟢 Active' : '🔴 Inactive'}</span>
                        <span>•</span>
                        <span>Last updated: Just now</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 ml-6">
                      <button
                        onClick={() => toggleFlag(flag.id)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          flag.enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${
                            flag.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Click to {flag.enabled ? 'disable' : 'enable'}
                      </span>
                      <button
                        onClick={() => deleteFlag(flag.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Delete flag"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}