import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SignalImportData {
  title: string;
  title_ur?: string;
  content: string;
  content_ur?: string;
  pair: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stop_loss?: number;
  take_profit?: number;
  confidence: number;
  market: 'FOREX' | 'CRYPTO' | 'PSX' | 'COMMODITIES';
  status?: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  author: string;
  author_ur?: string;
  published_date?: string;
}

interface DrillData {
  title: string;
  title_ur?: string;
  description: string;
  description_ur?: string;
  type: 'CASE_STUDY' | 'BLOG' | 'ANALYTICS';
  content: string;
  content_ur?: string;
  order_index: number;
  is_active: boolean;
  image_url?: string;
}

function generateDrills(signal: any): DrillData[] {
  const drills: DrillData[] = [];

  // Drill 1: Technical Analysis Deep Dive (Case Study)
  drills.push({
    title: `${signal.pair} Technical Analysis Deep Dive`,
    title_ur: `${signal.pair} تکنیکی تجزیہ کی گہرائی`,
    description: `Complete breakdown of the technical factors driving this ${signal.action} signal for ${signal.pair}`,
    description_ur: `${signal.pair} کے لیے اس ${signal.action === 'BUY' ? 'خریداری' : 'فروخت'} سگنل کو چلانے والے تکنیکی عوامل کی مکمل تفصیل`,
    type: 'CASE_STUDY',
    content: `# Technical Analysis for ${signal.pair}

## Market Overview
${signal.content}

## Key Technical Factors

### Entry Point: ${signal.entry}
Our analysis indicates that ${signal.entry} represents an optimal entry point based on:
- Support/resistance levels
- Moving averages convergence
- Volume profile analysis
- Market momentum indicators

### Risk Management
${signal.stop_loss ? `**Stop Loss**: ${signal.stop_loss}` : 'Stop loss level to be determined based on your risk tolerance'}
${signal.take_profit ? `**Take Profit**: ${signal.take_profit}` : 'Target profit level based on technical projections'}

### Confidence Level: ${signal.confidence}%
This ${signal.confidence}% confidence rating is based on:
1. Multiple timeframe analysis
2. Indicator confluence
3. Market structure
4. Historical price action

## Trading Strategy
- **Action**: ${signal.action}
- **Entry**: ${signal.entry}
- **Market**: ${signal.market}
- **Priority**: ${signal.priority || 'MEDIUM'}

## Analyst Commentary
*Analysis by ${signal.author}*

${signal.content}

---
*This analysis is for educational purposes. Always do your own research and manage your risk appropriately.*
`,
    content_ur: signal.content_ur || `# ${signal.pair} کے لیے تکنیکی تجزیہ

${signal.content}

مزید تفصیلات جلد آ رہی ہیں...`,
    order_index: 1,
    is_active: true,
    image_url: `/images/drills/${signal.pair.toLowerCase().replace('/', '')}-analysis.jpg`,
  });

  // Drill 2: Real-Time Analytics Dashboard
  drills.push({
    title: `Real-Time Analytics Dashboard - ${signal.pair}`,
    title_ur: `حقیقی وقت کی تجزیات ڈیش بورڈ - ${signal.pair}`,
    description: `Live performance metrics and analytics for ${signal.pair}`,
    description_ur: `${signal.pair} کے لیے لائیو کارکردگی کے میٹرکس اور تجزیات`,
    type: 'ANALYTICS',
    content: `# Real-Time Analytics Dashboard

## Signal Performance Metrics

### Current Status: ${signal.status}
**Live since**: ${new Date(signal.published_date || Date.now()).toLocaleDateString()}

### Key Statistics
- **Pair**: ${signal.pair}
- **Action**: ${signal.action}
- **Entry Price**: ${signal.entry}
- **Current Market**: ${signal.market}
- **Confidence Score**: ${signal.confidence}%

### Risk-Reward Analysis
${signal.stop_loss && signal.take_profit ? `
**Risk**: ${Math.abs(signal.entry - signal.stop_loss).toFixed(4)} points
**Reward**: ${Math.abs(signal.take_profit - signal.entry).toFixed(4)} points
**R:R Ratio**: 1:${(Math.abs(signal.take_profit - signal.entry) / Math.abs(signal.entry - signal.stop_loss)).toFixed(2)}
` : 'Risk-reward parameters to be established'}

### Market Conditions
- **Market Type**: ${signal.market}
- **Signal Priority**: ${signal.priority || 'MEDIUM'}
- **Trading Action**: ${signal.action}

### Performance Tracking
This dashboard provides real-time updates on:
- Price movement relative to entry
- Stop loss proximity alerts
- Take profit target progress
- Overall signal performance

### Historical Context
View historical performance of similar signals in the ${signal.market} market.

---
*Analytics updated in real-time. Monitor closely for best results.*
`,
    content_ur: `# حقیقی وقت کی تجزیات ڈیش بورڈ

## سگنل کی کارکردگی

**جوڑا**: ${signal.pair}
**ایکشن**: ${signal.action === 'BUY' ? 'خریداری' : 'فروخت'}
**داخلہ قیمت**: ${signal.entry}
**اعتماد سکور**: ${signal.confidence}%

مزید تفصیلات جلد آ رہی ہیں...`,
    order_index: 2,
    is_active: true,
    image_url: '/images/drills/analytics-dashboard.jpg',
  });

  // Drill 3: Market Context & News (Blog)
  drills.push({
    title: `Market Context: What's Moving ${signal.pair}`,
    title_ur: `مارکیٹ کا سیاق و سباق: ${signal.pair} کو کیا متحرک کر رہا ہے`,
    description: `Understanding the broader market forces and news affecting ${signal.pair}`,
    description_ur: `${signal.pair} کو متاثر کرنے والی وسیع تر مارکیٹ کی قوتوں اور خبروں کو سمجھنا`,
    type: 'BLOG',
    content: `# Market Context for ${signal.pair}

## Why This Signal Matters

The ${signal.action} signal for ${signal.pair} comes at a critical time in the ${signal.market} market.

## Market Forces at Play

### Fundamental Factors
${signal.market === 'FOREX' ? `
- Central bank policies and interest rate decisions
- Economic data releases (GDP, employment, inflation)
- Geopolitical developments
- Currency flow analysis
` : signal.market === 'CRYPTO' ? `
- Blockchain network updates and developments
- Regulatory news and announcements
- Market sentiment and institutional adoption
- Technical network metrics
` : signal.market === 'PSX' ? `
- Company earnings reports
- Sector-specific developments
- Economic indicators for Pakistan
- Market sentiment and investor flows
` : `
- Supply and demand dynamics
- Seasonal factors
- Global economic conditions
- Market sentiment indicators
`}

### Technical Setup
Our ${signal.confidence}% confidence level reflects:
- Strong technical pattern formation
- Favorable risk-reward ratio
- Clear entry and exit points
- Supportive market structure

## Signal Rationale

**${signal.action} at ${signal.entry}**

${signal.content}

### What to Watch
Key levels to monitor:
${signal.stop_loss ? `- **Stop Loss**: ${signal.stop_loss} (risk management level)` : ''}
${signal.take_profit ? `- **Take Profit**: ${signal.take_profit} (target profit level)` : ''}
- Market news and economic releases
- Technical indicator confirmations

## Expert Opinion

*${signal.author}${signal.author_ur ? ` (${signal.author_ur})` : ''}* provides this analysis based on comprehensive market research and technical analysis.

---
*Stay informed and trade responsibly. This is not financial advice.*
`,
    content_ur: signal.content_ur ? `# ${signal.pair} کے لیے مارکیٹ کا سیاق و سباق

## یہ سگنل کیوں اہم ہے

${signal.content_ur}

مزید تجزیہ جلد آ رہا ہے...` : undefined,
    order_index: 3,
    is_active: true,
    image_url: `/images/drills/${signal.market.toLowerCase()}-market-news.jpg`,
  });

  return drills;
}

export async function POST(request: NextRequest) {
  try {
    const body: SignalImportData = await request.json();

    // Set defaults
    const signalData = {
      ...body,
      status: body.status || 'ACTIVE',
      priority: body.priority || 'MEDIUM',
      published_date: body.published_date || new Date().toISOString(),
      current_price: body.entry, // Set current_price to entry initially
      stop_loss: body.stop_loss || body.entry * 0.98, // Default 2% stop loss if not provided
      take_profit: body.take_profit || body.entry * 1.03, // Default 3% take profit if not provided
    };

    // Create signal in database
    const signal = await prisma.signal.create({
      data: signalData,
    });

    // Generate drills
    const drillTemplates = generateDrills(signal);

    // Create drills in database
    const drills = await Promise.all(
      drillTemplates.map((drill) =>
        prisma.drill.create({
          data: {
            signal_id: signal.id,
            ...drill,
          },
        })
      )
    );

    // Get production domain from environment or default
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pipguru.club';
    const signalUrl = `${baseUrl}/en/signal/${signal.id}`;

    return NextResponse.json({
      success: true,
      signal: {
        id: signal.id,
        title: signal.title,
        pair: signal.pair,
        action: signal.action,
        status: signal.status,
      },
      drills: drills.map((drill) => ({
        id: drill.id,
        title: drill.title,
        type: drill.type,
        order_index: drill.order_index,
      })),
      url: signalUrl,
      message: `Successfully created signal #${signal.id} with ${drills.length} drills`,
    });
  } catch (error: any) {
    console.error('Signal import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to import signal',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
