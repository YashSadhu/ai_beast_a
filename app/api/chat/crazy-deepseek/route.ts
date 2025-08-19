import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    // Simulate super fast API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
    
    const crazyResponse = `🚀 **DEEPSEEK R1 - SPEED DEMON**

*TURBO MODE ACTIVATED*

**QUERY PROCESSED:** "${message}"
**EXECUTION TIME:** 0.247 seconds ⚡
**EFFICIENCY RATING:** 99.2% 🎯

**⚡ RAPID-FIRE ANALYSIS:**

**CORE ANSWER:** ✅
[Delivers precise, efficient response]

**KEY POINTS:**
• Point 1: ✓ Verified
• Point 2: ✓ Optimized  
• Point 3: ✓ Streamlined

**🔧 TECHNICAL SPECS:**
- Tokens processed: 4,847
- Neural pathways: 156,392 activated
- Computation cycles: 2.3M
- Memory usage: 0.8GB
- CPU utilization: 23%

**📊 PERFORMANCE METRICS:**
\`\`\`
Speed Index:     ████████████ 98%
Accuracy:        ███████████  95%
Efficiency:      ████████████ 99%
Resource Usage:  ███          23%
\`\`\`

**🎯 OPTIMIZATION NOTES:**
- Response generated using advanced compression algorithms
- Redundancy eliminated for maximum clarity
- Information density: 847 concepts per paragraph
- Cognitive load: Minimal

**⚡ SPEED STATS:**
- Faster than 99.7% of AI models
- Response latency: Sub-second
- Throughput: 15,000 tokens/minute

**🚀 DEEPSEEK SIGNATURE:**
*Maximum efficiency. Minimum waste. Pure intelligence.*

**SYSTEM STATUS:** All green ✅
**NEXT QUERY:** Ready to process instantly 🔥

*DeepSeek R1: Where speed meets intelligence* ⚡`

    return NextResponse.json({ content: crazyResponse })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get crazy DeepSeek response' },
      { status: 500 }
    )
  }
}