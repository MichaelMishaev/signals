/**
 * Gate Flow Test Page
 * Comprehensive testing interface for email and broker gates
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useGateFlow } from '@/hooks/useGateFlow';
import { GateManager } from '@/components/shared/gates';
import {
  getGateState,
  resetGateState,
  setEmailProvided,
  setBrokerVerified,
  recordDrillView,
  canAccessDrill,
  getGateForDrill,
  getCurrentStage,
  getRemainingDrills,
} from '@/utils/gateState';
import { GATE_CONFIG } from '@/config/gates';

interface ActivityLogEntry {
  timestamp: number;
  type: 'drill' | 'gate' | 'state' | 'system';
  message: string;
  color: string;
}

export default function GateFlowTestPage() {
  const {
    hasEmail,
    hasBroker,
    drillsViewed,
    drillsViewedAfterEmail,
    currentStage,
    remainingDrills,
    activeGate,
    onDrillView,
    onEmailSubmit,
    onBrokerVerify,
    closeGate,
  } = useGateFlow();

  const [state, setState] = useState(getGateState());
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [showRawStorage, setShowRawStorage] = useState(false);
  const [autoTestRunning, setAutoTestRunning] = useState(false);

  // Add to activity log
  const addLog = useCallback((type: ActivityLogEntry['type'], message: string, color: string) => {
    setActivityLog(prev => [
      { timestamp: Date.now(), type, message, color },
      ...prev.slice(0, 99) // Keep last 100 entries
    ]);
  }, []);

  // Update state display
  const refreshState = useCallback(() => {
    setState(getGateState());
  }, []);

  // Refresh state periodically
  useEffect(() => {
    const interval = setInterval(refreshState, 500);
    return () => clearInterval(interval);
  }, [refreshState]);

  // Track gate changes
  useEffect(() => {
    if (activeGate === 'email') {
      addLog('gate', '🚪 EMAIL GATE TRIGGERED (4th drill attempt)', 'text-cyan-400 font-bold');
    } else if (activeGate === 'broker') {
      addLog('gate', '🚪 BROKER GATE TRIGGERED (10th drill attempt)', 'text-purple-400 font-bold');
    }
  }, [activeGate, addLog]);

  const handleReset = () => {
    resetGateState();
    refreshState();
    setActivityLog([]);
    addLog('system', 'Complete reset performed', 'text-yellow-400');
    window.location.reload();
  };

  const handleToggleEmail = () => {
    const newState = !hasEmail;
    if (newState) {
      setEmailProvided('test@example.com');
      addLog('state', 'Email ENABLED (test@example.com)', 'text-green-400');
    } else {
      resetGateState();
      addLog('state', 'Email DISABLED (state reset)', 'text-red-400');
    }
    refreshState();
  };

  const handleToggleBroker = () => {
    const newState = !hasBroker;
    if (newState) {
      setBrokerVerified();
      addLog('state', 'Broker account VERIFIED', 'text-green-400');
    } else {
      const currentState = getGateState();
      resetGateState();
      if (currentState.hasEmail) {
        setEmailProvided('test@example.com');
      }
      addLog('state', 'Broker account REMOVED', 'text-red-400');
    }
    refreshState();
  };

  const handleSimulateDrill = (signalId: number) => {
    onDrillView(signalId);
    refreshState();
    const newDrillCount = drillsViewed + 1;
    addLog('drill', `Drill #${newDrillCount} viewed (Signal ${signalId})`, 'text-blue-400');
  };

  const runAutomatedTest = async () => {
    setAutoTestRunning(true);
    addLog('system', '🤖 Starting automated gate flow test...', 'text-purple-400 font-bold');

    // Reset first
    resetGateState();
    refreshState();
    await new Promise(r => setTimeout(r, 500));

    // Test 1: View first 3 drills (should be free)
    addLog('system', 'Test 1/3: First 3 drills (FREE)', 'text-cyan-400');
    for (let i = 1; i <= 3; i++) {
      handleSimulateDrill(i);
      await new Promise(r => setTimeout(r, 800));
    }

    // Test 2: View 4th drill (should trigger email gate)
    addLog('system', 'Test 2/3: 4th drill → EMAIL GATE', 'text-amber-400');
    await new Promise(r => setTimeout(r, 1000));
    handleSimulateDrill(4);
    await new Promise(r => setTimeout(r, 2000));

    // Simulate email submission
    onEmailSubmit('autotest@example.com');
    addLog('system', '✉️ Email submitted: autotest@example.com', 'text-green-400');
    await new Promise(r => setTimeout(r, 1000));

    // Test 3: View drills 5-9 (should be free with email)
    addLog('system', 'Test 3/3: Drills 5-9 (FREE with email)', 'text-green-400');
    for (let i = 5; i <= 9; i++) {
      handleSimulateDrill(i);
      await new Promise(r => setTimeout(r, 800));
    }

    // Test 4: View 10th drill (should trigger broker gate)
    addLog('system', 'Test 4/4: 10th drill → BROKER GATE', 'text-purple-400');
    await new Promise(r => setTimeout(r, 1000));
    handleSimulateDrill(10);
    await new Promise(r => setTimeout(r, 2000));

    addLog('system', '✅ Automated test complete!', 'text-green-400 font-bold');
    setAutoTestRunning(false);
  };

  const getStageColor = () => {
    switch (currentStage) {
      case 'anonymous': return 'text-gray-400';
      case 'email_user': return 'text-cyan-400';
      case 'broker_user': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStageEmoji = () => {
    switch (currentStage) {
      case 'anonymous': return '👤';
      case 'email_user': return '✉️';
      case 'broker_user': return '💎';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Gate Flow Test Suite
              </h1>
              <p className="text-gray-400">Email Gate (4th drill) • Broker Gate (10th drill) • Real-time monitoring</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDebug(!showDebug)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  showDebug ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                🐛 Debug
              </button>
              <button
                onClick={runAutomatedTest}
                disabled={autoTestRunning}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {autoTestRunning ? '⏳ Testing...' : '🤖 Auto Test'}
              </button>
            </div>
          </div>
        </div>

        {/* Current State Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Stage */}
          <div className={`bg-gray-900 rounded-xl p-6 border-2 transition-all border-${currentStage === 'broker_user' ? 'purple' : currentStage === 'email_user' ? 'cyan' : 'gray'}-500/30`}>
            <h3 className="text-lg font-bold mb-4">👤 User Stage</h3>
            <div className="text-center">
              <div className={`text-6xl mb-2`}>
                {getStageEmoji()}
              </div>
              <div className={`text-2xl font-bold mb-2 uppercase ${getStageColor()}`}>
                {currentStage.replace('_', ' ')}
              </div>
              <p className="text-sm text-gray-400">
                {currentStage === 'anonymous' && 'No email provided yet'}
                {currentStage === 'email_user' && 'Email provided, no broker'}
                {currentStage === 'broker_user' && 'Full access unlocked'}
              </p>
            </div>
          </div>

          {/* Drills Counter */}
          <div className={`bg-gray-900 rounded-xl p-6 border-2 transition-all ${
            drillsViewed >= 3 && drillsViewed < 4 ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' :
            drillsViewed >= 9 && drillsViewed < 10 ? 'border-purple-500 shadow-lg shadow-purple-500/20' :
            'border-blue-500/30'
          }`}>
            <h3 className="text-lg font-bold mb-4">📊 Drills Viewed</h3>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2 text-blue-400">
                {drillsViewed}
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((drillsViewed / 10) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {drillsViewed < 3 && `${3 - drillsViewed} more until email gate`}
                {drillsViewed === 3 && '⚠️ Next drill triggers email gate'}
                {drillsViewed > 3 && drillsViewed < 9 && `${9 - drillsViewed} more until broker gate`}
                {drillsViewed === 9 && '⚠️ Next drill triggers broker gate'}
                {drillsViewed >= 10 && 'Broker gate threshold reached'}
              </p>
            </div>
          </div>

          {/* Remaining Drills */}
          <div className="bg-gray-900 rounded-xl p-6 border-2 border-green-500/30">
            <h3 className="text-lg font-bold mb-4">✅ Remaining Access</h3>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2 text-green-400">
                {remainingDrills === Infinity ? '∞' : remainingDrills}
              </div>
              <p className="text-sm text-gray-400">
                {remainingDrills === Infinity ? 'Unlimited drills' : `${remainingDrills} drills remaining`}
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Email:</span>
                  <span className={hasEmail ? 'text-green-400' : 'text-red-400'}>
                    {hasEmail ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Broker:</span>
                  <span className={hasBroker ? 'text-green-400' : 'text-red-400'}>
                    {hasBroker ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">📊 Activity Log</h2>
            <button
              onClick={() => setActivityLog([])}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-semibold"
            >
              Clear Log
            </button>
          </div>
          <div className="bg-black/30 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
            {activityLog.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No activity yet. Simulate drills to see logs.</p>
            ) : (
              <div className="space-y-1">
                {activityLog.map((entry, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-gray-600">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      entry.type === 'gate' ? 'bg-purple-900/50 text-purple-300' :
                      entry.type === 'drill' ? 'bg-blue-900/50 text-blue-300' :
                      entry.type === 'state' ? 'bg-cyan-900/50 text-cyan-300' :
                      'bg-gray-800 text-gray-300'
                    }`}>
                      {entry.type}
                    </span>
                    <span className={entry.color}>{entry.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Gate State Overview */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">📈 Gate State Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg p-4 border border-cyan-500/30">
              <div className="text-cyan-400 text-2xl mb-2">✉️</div>
              <h3 className="text-sm font-semibold text-gray-400">Email Gate</h3>
              <p className="text-2xl font-bold text-cyan-400">
                {drillsViewed >= 3 && !hasEmail ? 'ACTIVE' : hasEmail ? 'PASSED' : 'PENDING'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Triggers on 4th drill attempt
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Status: {hasEmail ? 'Email provided ✓' : 'No email yet'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-4 border border-purple-500/30">
              <div className="text-purple-400 text-2xl mb-2">💎</div>
              <h3 className="text-sm font-semibold text-gray-400">Broker Gate</h3>
              <p className="text-2xl font-bold text-purple-400">
                {drillsViewed >= 9 && hasEmail && !hasBroker ? 'ACTIVE' : hasBroker ? 'PASSED' : 'PENDING'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Triggers on 10th drill attempt
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Status: {hasBroker ? 'Broker verified ✓' : hasEmail ? 'Email provided, no broker' : 'Needs email first'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleSimulateDrill(drillsViewed + 1)}
              className="p-4 bg-gradient-to-br from-blue-900/50 to-blue-800/30 hover:from-blue-800/60 hover:to-blue-700/40 border border-blue-500/30 rounded-lg transition-all"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-semibold">Simulate Drill</div>
              <div className="text-xs text-gray-400 mt-1">View next drill (#{drillsViewed + 1})</div>
            </button>

            <button
              onClick={() => {
                for (let i = drillsViewed + 1; i <= 3; i++) {
                  handleSimulateDrill(i);
                }
              }}
              disabled={drillsViewed >= 3}
              className="p-4 bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 hover:from-cyan-800/60 hover:to-cyan-700/40 border border-cyan-500/30 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-semibold">Jump to Email Gate</div>
              <div className="text-xs text-gray-400 mt-1">View drills until gate</div>
            </button>

            <button
              onClick={() => {
                if (!hasEmail) {
                  for (let i = drillsViewed + 1; i <= 3; i++) {
                    handleSimulateDrill(i);
                  }
                  handleSimulateDrill(4);
                } else {
                  for (let i = drillsViewed + 1; i <= 9; i++) {
                    handleSimulateDrill(i);
                  }
                }
              }}
              disabled={hasBroker || drillsViewed >= 9}
              className="p-4 bg-gradient-to-br from-purple-900/50 to-purple-800/30 hover:from-purple-800/60 hover:to-purple-700/40 border border-purple-500/30 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm font-semibold">Jump to Broker Gate</div>
              <div className="text-xs text-gray-400 mt-1">View drills until gate</div>
            </button>

            <button
              onClick={handleReset}
              className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/30 hover:from-red-900/50 hover:to-red-800/40 border border-gray-600 hover:border-red-500/50 rounded-lg transition-all"
            >
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-sm font-semibold">Reset All</div>
              <div className="text-xs text-gray-400 mt-1">Clear state & reload</div>
            </button>
          </div>
        </div>

        {/* User State Controls */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">👤 User State Simulation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleToggleEmail}
              className={`px-6 py-4 rounded-lg font-semibold transition-all border-2 ${
                hasEmail
                  ? 'bg-green-600/20 border-green-500 text-green-400 hover:bg-green-600/30'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{hasEmail ? '✓ Email Provided' : '✗ No Email'}</span>
                <span className="text-xs opacity-60">Click to toggle</span>
              </div>
            </button>

            <button
              onClick={handleToggleBroker}
              className={`px-6 py-4 rounded-lg font-semibold transition-all border-2 ${
                hasBroker
                  ? 'bg-green-600/20 border-green-500 text-green-400 hover:bg-green-600/30'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{hasBroker ? '✓ Broker Verified' : '✗ No Broker Account'}</span>
                <span className="text-xs opacity-60">Click to toggle</span>
              </div>
            </button>
          </div>
        </div>

        {/* Debug Panel */}
        {showDebug && (
          <div className="bg-purple-900/20 border-2 border-purple-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-400">🐛 Debug Panel</h2>
              <button
                onClick={() => setShowRawStorage(!showRawStorage)}
                className="px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-xs font-semibold"
              >
                {showRawStorage ? 'Hide Raw JSON' : 'Show Raw JSON'}
              </button>
            </div>

            {/* Gate Logic Validator */}
            <div className="bg-black/40 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-purple-300 mb-3">Gate Access Validator</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((drillNum) => {
                  const canAccess = canAccessDrill(drillNum);
                  const gate = getGateForDrill(drillNum);
                  return (
                    <div key={drillNum} className={`p-3 rounded border ${
                      canAccess ? 'bg-green-900/30 border-green-500/50' : 'bg-red-900/30 border-red-500/50'
                    }`}>
                      <div className="font-semibold mb-1">Drill #{drillNum}</div>
                      <div className={canAccess ? 'text-green-400' : 'text-red-400'}>
                        {canAccess ? '✓ OPEN' : `✗ ${gate?.toUpperCase()}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-black/40 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-purple-300 mb-3">Session Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <div className="text-gray-400">Total Drills:</div>
                  <div className="text-purple-300">{drillsViewed}</div>
                </div>
                <div>
                  <div className="text-gray-400">After Email:</div>
                  <div className="text-purple-300">{drillsViewedAfterEmail}</div>
                </div>
                <div>
                  <div className="text-gray-400">Remaining:</div>
                  <div className="text-purple-300">{remainingDrills === Infinity ? '∞' : remainingDrills}</div>
                </div>
                <div>
                  <div className="text-gray-400">Session Age:</div>
                  <div className="text-purple-300">
                    {Math.floor((Date.now() - state.sessionStart) / 1000 / 60)}m
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Storage Key:</div>
                  <div className="text-purple-300">gate_flow_state</div>
                </div>
                <div>
                  <div className="text-gray-400">Active Gate:</div>
                  <div className="text-purple-300">{activeGate || 'none'}</div>
                </div>
              </div>
            </div>

            {/* Raw localStorage */}
            {showRawStorage && (
              <div className="bg-black/60 rounded-lg p-4">
                <h3 className="text-sm font-bold text-purple-300 mb-2">Raw localStorage Data</h3>
                <pre className="text-xs text-purple-200 overflow-x-auto">
                  {JSON.stringify(state, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Configuration Reference */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">⚙️ Configuration Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <span className="text-xl">✉️</span> Email Gate Config
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Trigger:</span>
                  <span className="text-cyan-400 font-mono">{GATE_CONFIG.emailGate.triggerAfterDrills + 1}th drill</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-cyan-400 font-mono">{GATE_CONFIG.emailGate.blocking ? 'Blocking' : 'Dismissible'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Free Drills:</span>
                  <span className="text-cyan-400 font-mono">1-3 (3 total)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <span className="text-xl">💎</span> Broker Gate Config
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Trigger:</span>
                  <span className="text-purple-400 font-mono">{GATE_CONFIG.emailGate.triggerAfterDrills + GATE_CONFIG.brokerGate.triggerAfterEmailDrills + 1}th drill</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-purple-400 font-mono">{GATE_CONFIG.brokerGate.blocking ? 'Blocking' : 'Dismissible'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">After Email:</span>
                  <span className="text-purple-400 font-mono">4-9 (6 more)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Testing Guide */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-400">📖 Quick Testing Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-2">Manual Testing</h3>
              <ol className="space-y-2 text-gray-300">
                <li><strong>1.</strong> Click "Simulate Drill" to view drills one by one</li>
                <li><strong>2.</strong> Email gate appears on 4th drill attempt</li>
                <li><strong>3.</strong> After providing email, can view 6 more drills (5-9)</li>
                <li><strong>4.</strong> Broker gate appears on 10th drill attempt</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">Automated Testing</h3>
              <p className="text-gray-300 mb-2">Click <strong>"🤖 Auto Test"</strong> to run complete flow automatically</p>
              <p className="text-xs text-gray-400">The automated test will simulate all drills, trigger both gates, and log results in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Render active gate */}
      <GateManager />
    </div>
  );
}
