-- Trading Signals Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension for user IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Signals Table
CREATE TABLE signals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pair VARCHAR(10) NOT NULL,           -- EUR/USD, GBP/JPY, etc.
  action VARCHAR(4) NOT NULL CHECK (action IN ('BUY', 'SELL')),
  entry DECIMAL(10,5) NOT NULL,
  stop_loss DECIMAL(10,5) NOT NULL,
  take_profit DECIMAL(10,5) NOT NULL,
  current_price DECIMAL(10,5),
  confidence INTEGER NOT NULL CHECK (confidence >= 1 AND confidence <= 100),
  market VARCHAR(20) NOT NULL,         -- FOREX, CRYPTO, PSX, COMMODITIES
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED', 'CANCELLED')),
  pips INTEGER DEFAULT 0,
  priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  author VARCHAR(100) NOT NULL,
  author_image TEXT,
  chart_image TEXT,                    -- URL to chart image
  key_levels JSONB,                    -- Support/resistance levels
  analyst_stats JSONB,                 -- Success rate, total signals, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_date DATE NOT NULL
);

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'analyst', 'user')),
  subscription VARCHAR(20) DEFAULT 'free' CHECK (subscription IN ('free', 'premium', 'vip')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Table
CREATE TABLE signal_analytics (
  id SERIAL PRIMARY KEY,
  signal_id INTEGER REFERENCES signals(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  price_data JSONB,                    -- Historical price points
  performance_metrics JSONB,          -- Calculated metrics
  user_interactions JSONB             -- Clicks, views, etc.
);

-- Indexes for better performance
CREATE INDEX idx_signals_status ON signals(status);
CREATE INDEX idx_signals_pair ON signals(pair);
CREATE INDEX idx_signals_market ON signals(market);
CREATE INDEX idx_signals_author ON signals(author);
CREATE INDEX idx_signals_created_at ON signals(created_at DESC);
CREATE INDEX idx_signals_published_date ON signals(published_date DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_analytics_signal_id ON signal_analytics(signal_id);
CREATE INDEX idx_analytics_timestamp ON signal_analytics(timestamp DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_signals_updated_at
    BEFORE UPDATE ON signals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS) Policies
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_analytics ENABLE ROW LEVEL SECURITY;

-- Signals Policies
-- Allow public read access to active signals
CREATE POLICY "Public can view active signals" ON signals
    FOR SELECT USING (status = 'ACTIVE');

-- Allow authenticated users to view all signals
CREATE POLICY "Authenticated users can view all signals" ON signals
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admins and analysts to insert/update/delete signals
CREATE POLICY "Admins and analysts can manage signals" ON signals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('admin', 'analyst')
        )
    );

-- Users Policies
-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Analytics Policies
-- Allow public read access for basic analytics
CREATE POLICY "Public can view analytics" ON signal_analytics
    FOR SELECT USING (true);

-- Allow admins to manage analytics
CREATE POLICY "Admins can manage analytics" ON signal_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Insert sample data
INSERT INTO users (id, email, role, subscription) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@signals.com', 'admin', 'vip'),
    ('550e8400-e29b-41d4-a716-446655440001', 'ahmad.ali@signals.com', 'analyst', 'premium'),
    ('550e8400-e29b-41d4-a716-446655440002', 'sarah.mitchell@signals.com', 'analyst', 'premium');

INSERT INTO signals (
    title, content, pair, action, entry, stop_loss, take_profit, current_price,
    confidence, market, status, pips, priority, author, author_image,
    key_levels, analyst_stats, published_date
) VALUES
    (
        'EUR/USD Strong BUY Signal Generated',
        'Technical analysis shows bullish momentum with RSI recovering from oversold territory. MACD shows bullish crossover with increasing volume supporting the upward move. ECB policy stance remains hawkish while USD shows weakness following recent Fed minutes.',
        'EUR/USD',
        'BUY',
        1.0850,
        1.0820,
        1.0920,
        1.0885,
        87,
        'FOREX',
        'ACTIVE',
        35,
        'HIGH',
        'Ahmad Ali',
        '/images/avatars/ahmad-ali.jpg',
        '{"resistance": [1.0920, 1.0950, 1.0980], "support": [1.0820, 1.0790, 1.0750]}',
        '{"successRate": 94, "totalSignals": 127, "totalPips": 2340}',
        CURRENT_DATE
    ),
    (
        'GBP/JPY SELL Signal - Technical Reversal Expected',
        'Strong resistance at current levels with bearish divergence on RSI. Price action shows rejection from key resistance zone with increasing selling volume.',
        'GBP/JPY',
        'SELL',
        185.50,
        186.20,
        184.00,
        185.20,
        82,
        'FOREX',
        'ACTIVE',
        30,
        'HIGH',
        'Sarah Mitchell',
        '/images/avatars/sarah-mitchell.jpg',
        '{"resistance": [186.20, 186.80, 187.50], "support": [184.00, 183.20, 182.50]}',
        '{"successRate": 89, "totalSignals": 95, "totalPips": 1850}',
        CURRENT_DATE - INTERVAL '1 day'
    ),
    (
        'BTC/USDT Breakout Signal - Crypto Rally Continues',
        'Bitcoin showing strong bullish momentum with break above key resistance. Volume surge confirms institutional buying interest.',
        'BTC/USDT',
        'BUY',
        45000.00,
        44500.00,
        46500.00,
        45300.00,
        91,
        'CRYPTO',
        'ACTIVE',
        300,
        'HIGH',
        'Ahmad Ali',
        '/images/avatars/ahmad-ali.jpg',
        '{"resistance": [46500, 47000, 47500], "support": [44500, 44000, 43500]}',
        '{"successRate": 94, "totalSignals": 127, "totalPips": 2340}',
        CURRENT_DATE - INTERVAL '2 days'
    );

-- Insert sample analytics data
INSERT INTO signal_analytics (signal_id, price_data, performance_metrics) VALUES
    (1, '{"prices": [1.0850, 1.0865, 1.0875, 1.0885], "timestamps": ["2025-01-15T09:00:00", "2025-01-15T10:00:00", "2025-01-15T11:00:00", "2025-01-15T12:00:00"]}', '{"unrealized_pnl": 35, "max_profit": 40, "max_drawdown": -5}'),
    (2, '{"prices": [185.50, 185.40, 185.30, 185.20], "timestamps": ["2025-01-14T09:00:00", "2025-01-14T10:00:00", "2025-01-14T11:00:00", "2025-01-14T12:00:00"]}', '{"unrealized_pnl": 30, "max_profit": 35, "max_drawdown": -10}'),
    (3, '{"prices": [45000, 45100, 45200, 45300], "timestamps": ["2025-01-13T09:00:00", "2025-01-13T10:00:00", "2025-01-13T11:00:00", "2025-01-13T12:00:00"]}', '{"unrealized_pnl": 300, "max_profit": 350, "max_drawdown": -50}');

-- Create a function to calculate pips based on current price
CREATE OR REPLACE FUNCTION calculate_pips()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate pips based on action type and price difference
    IF NEW.action = 'BUY' THEN
        NEW.pips = ROUND((COALESCE(NEW.current_price, NEW.entry) - NEW.entry) * 10000);
    ELSE -- SELL
        NEW.pips = ROUND((NEW.entry - COALESCE(NEW.current_price, NEW.entry)) * 10000);
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically calculate pips when current_price changes
CREATE TRIGGER calculate_pips_trigger
    BEFORE INSERT OR UPDATE ON signals
    FOR EACH ROW EXECUTE FUNCTION calculate_pips();