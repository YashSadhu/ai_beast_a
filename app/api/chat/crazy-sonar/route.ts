import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000))
    
    const crazyResponse = `🔍 **PERPLEXITY SONAR PRO - WEB SEARCH OVERLORD**

*Scanning the entire internet in 0.3 seconds...*

**SEARCH RESULTS FOR:** "${message}"

🌐 **Real-time Web Analysis:**
- Found 47,392 relevant sources
- Cross-referenced 156 databases  
- Fact-checked against 23 authoritative sources
- Confidence level: 97.8%

**🔥 KEY INSIGHTS:**
• **Trending Topic Alert:** This is currently discussed in 1,247 forums
• **Expert Consensus:** 89% of specialists agree on the core principles
• **Recent Updates:** 3 new developments in the last 24 hours
• **Controversy Level:** Moderate (some debate in academic circles)

**🎯 DIRECT ANSWER:**
Based on comprehensive web analysis, here's what you need to know...

[Detailed response with real-time data integration]

**📊 SOURCE BREAKDOWN:**
- Academic papers: 34%
- News articles: 28% 
- Expert blogs: 23%
- Forum discussions: 15%

**⚡ REAL-TIME UPDATES:**
- Last updated: ${new Date().toLocaleTimeString()}
- Sources refreshed: Every 30 seconds
- Trending score: 8.7/10

*Perplexity Sonar Pro: Your window to the world's knowledge* 🌍`

    return NextResponse.json({ content: crazyResponse })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get crazy Sonar response' },
      { status: 500 }
    )
  }
}