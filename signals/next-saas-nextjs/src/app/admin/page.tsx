'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RouteInfo {
  path: string;
  name: string;
  description: string;
  category: 'public' | 'auth' | 'admin' | 'api' | 'drill' | 'signal';
  visibleInProduction: boolean;
  requiresAuth: boolean;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  // Check for existing admin session on component mount
  useEffect(() => {
    const adminSession = sessionStorage.getItem('admin_verified');
    if (adminSession === 'true') {
      setIsPasswordVerified(true);
    }
  }, []);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'production' | 'auth'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Route definitions
  const routes: RouteInfo[] = [
    // Public routes
    { path: '/', name: 'Homepage', description: 'Main landing page with trading signals', category: 'public', visibleInProduction: true, requiresAuth: false },
    { path: '/drill/*', name: 'Drill Pages', description: 'Trading drill exercises and tutorials', category: 'drill', visibleInProduction: true, requiresAuth: false },
    { path: '/signal/*', name: 'Signal Pages', description: 'Individual trading signal details', category: 'signal', visibleInProduction: true, requiresAuth: false },

    // Auth routes (hidden in production)
    { path: '/auth/signin', name: 'Sign In', description: 'User login page', category: 'auth', visibleInProduction: false, requiresAuth: false },
    { path: '/auth/register', name: 'Register', description: 'User registration page', category: 'auth', visibleInProduction: false, requiresAuth: false },

    // Admin routes (hidden in production)
    { path: '/admin', name: 'Admin Dashboard', description: 'Main admin control panel', category: 'admin', visibleInProduction: false, requiresAuth: true },
    { path: '/admin/feature-flags', name: 'Feature Flags', description: 'Manage feature flags and toggles', category: 'admin', visibleInProduction: false, requiresAuth: true },
    { path: '/admin/signals', name: 'Signals & Drills', description: 'Create and manage trading signals and educational drills', category: 'admin', visibleInProduction: false, requiresAuth: true },

    // Development/Test routes (hidden in production)
    { path: '/drill-test', name: 'Drill Test', description: 'Development testing for drill functionality', category: 'drill', visibleInProduction: false, requiresAuth: false },
    { path: '/drill-example', name: 'Drill Example', description: 'Example drill page for development', category: 'drill', visibleInProduction: false, requiresAuth: false },

    // API routes (some visible, some hidden)
    { path: '/api/auth/*', name: 'Auth API', description: 'Authentication API endpoints', category: 'api', visibleInProduction: false, requiresAuth: false },
    { path: '/api/feature-flags', name: 'Feature Flags API', description: 'Feature flags management API', category: 'api', visibleInProduction: false, requiresAuth: true },
  ];

  const handlePasswordSubmit = () => {
    if (passwordInput === '6262') {
      setIsPasswordVerified(true);
      setPasswordInput('');
      setError(null);
      // Store admin session in sessionStorage
      sessionStorage.setItem('admin_verified', 'true');
    } else {
      setError('Invalid admin password');
      setPasswordInput('');
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

  const handleSort = (column: 'name' | 'category' | 'production' | 'auth') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleStatClick = (filterType: string) => {
    setActiveFilter(filterType);
    setCategoryFilter('all');
    setSearchTerm('');
  };

  // Filter routes
  let filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || route.category === categoryFilter;

    // Apply active filter from stats
    let matchesActiveFilter = true;
    if (activeFilter === 'visible') {
      matchesActiveFilter = route.visibleInProduction;
    } else if (activeFilter === 'hidden') {
      matchesActiveFilter = !route.visibleInProduction;
    } else if (activeFilter === 'auth') {
      matchesActiveFilter = route.requiresAuth;
    }

    return matchesSearch && matchesCategory && matchesActiveFilter;
  });

  // Sort routes
  filteredRoutes = filteredRoutes.sort((a, b) => {
    let aValue: string | boolean;
    let bValue: string | boolean;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      case 'production':
        aValue = a.visibleInProduction;
        bValue = b.visibleInProduction;
        break;
      case 'auth':
        aValue = a.requiresAuth;
        bValue = b.requiresAuth;
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      if (sortOrder === 'asc') {
        return aValue === bValue ? 0 : aValue ? 1 : -1;
      } else {
        return aValue === bValue ? 0 : aValue ? -1 : 1;
      }
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const categories = ['all', 'public', 'auth', 'admin', 'api', 'drill', 'signal'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🏠 Website Control Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              Your one-stop dashboard to control what users see on your website
            </p>

            {/* Simple explanation */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <h2 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-2">
                🤔 What is this page?
              </h2>
              <p className="text-blue-800 dark:text-blue-400 mb-3">
                Think of this like a <strong>TV remote control</strong> for your website. You can see all the "channels" (pages)
                and decide which ones are visible to visitors.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-600 text-xl">✅</span>
                    <span className="font-medium text-gray-900 dark:text-white">Pages Visitors CAN See</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Homepage, trading signals, drills</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-600 text-xl">🚫</span>
                    <span className="font-medium text-gray-900 dark:text-white">Pages Visitors CANNOT See</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Admin panels, login pages, settings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">⚡ Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link
                href="/admin/signals"
                className="flex items-center gap-3 p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <span className="text-2xl">📈</span>
                <div>
                  <div className="font-medium">Signals & Drills</div>
                  <div className="text-sm text-orange-100">Manage trading content</div>
                </div>
              </Link>
              <Link
                href="/admin/feature-flags"
                className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="text-2xl">🚩</span>
                <div>
                  <div className="font-medium">Feature Flags</div>
                  <div className="text-sm text-blue-100">Turn features on/off instantly</div>
                </div>
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <span className="text-2xl">👀</span>
                <div>
                  <div className="font-medium">View Live Site</div>
                  <div className="text-sm text-green-100">See what visitors see</div>
                </div>
              </Link>
              <button className="flex items-center gap-3 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <span className="text-2xl">🚀</span>
                <div>
                  <div className="font-medium">Test Production Mode</div>
                  <div className="text-sm text-purple-100">Use dev toggle below</div>
                </div>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search routes, names, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats - Now clickable for drill-down */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">📊 Page Visibility Overview</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Click any box below to filter and see specific pages</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => handleStatClick('visible')}
                className={`text-center p-4 rounded-lg transition-colors hover:bg-white dark:hover:bg-gray-800 border-2 ${
                  activeFilter === 'visible' ? 'bg-white dark:bg-gray-800 shadow-sm border-green-500' : 'border-transparent'
                }`}
              >
                <div className="text-3xl font-bold text-green-600 mb-1">{routes.filter(r => r.visibleInProduction).length}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">✅ Public Pages</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Visitors can see these</div>
              </button>
              <button
                onClick={() => handleStatClick('hidden')}
                className={`text-center p-4 rounded-lg transition-colors hover:bg-white dark:hover:bg-gray-800 border-2 ${
                  activeFilter === 'hidden' ? 'bg-white dark:bg-gray-800 shadow-sm border-red-500' : 'border-transparent'
                }`}
              >
                <div className="text-3xl font-bold text-red-600 mb-1">{routes.filter(r => !r.visibleInProduction).length}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">🚫 Hidden Pages</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Only you can see these</div>
              </button>
              <button
                onClick={() => handleStatClick('auth')}
                className={`text-center p-4 rounded-lg transition-colors hover:bg-white dark:hover:bg-gray-800 border-2 ${
                  activeFilter === 'auth' ? 'bg-white dark:bg-gray-800 shadow-sm border-blue-500' : 'border-transparent'
                }`}
              >
                <div className="text-3xl font-bold text-blue-600 mb-1">{routes.filter(r => r.requiresAuth).length}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">🔐 Login Required</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Need password to access</div>
              </button>
              <button
                onClick={() => handleStatClick('all')}
                className={`text-center p-4 rounded-lg transition-colors hover:bg-white dark:hover:bg-gray-800 border-2 ${
                  activeFilter === 'all' ? 'bg-white dark:bg-gray-800 shadow-sm border-gray-500' : 'border-transparent'
                }`}
              >
                <div className="text-3xl font-bold text-gray-600 mb-1">{filteredRoutes.length}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">📄 All Pages</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Show everything</div>
              </button>
            </div>
            {activeFilter !== 'all' && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                  <span>Filtering by: {activeFilter === 'visible' ? 'Visible in Production' : activeFilter === 'hidden' ? 'Hidden in Production' : 'Requires Authentication'}</span>
                  <button
                    onClick={() => handleStatClick('all')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Routes Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Route
                      {sortBy === 'name' && (
                        <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-1">
                      Category
                      {sortBy === 'category' && (
                        <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('production')}
                  >
                    <div className="flex items-center gap-1">
                      Production Status
                      {sortBy === 'production' && (
                        <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('auth')}
                  >
                    <div className="flex items-center gap-1">
                      Auth Required
                      {sortBy === 'auth' && (
                        <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRoutes.map((route, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {route.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {route.path}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {route.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        route.category === 'public' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        route.category === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        route.category === 'auth' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        route.category === 'drill' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                        route.category === 'signal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {route.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        route.visibleInProduction
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {route.visibleInProduction ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        route.requiresAuth
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {route.requiresAuth ? 'Required' : 'Optional'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!route.path.includes('*') && (
                          <Link
                            href={route.path}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                          >
                            Visit
                          </Link>
                        )}
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 text-sm">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRoutes.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No routes found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}