import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1800 + 800))
    
    const crazyResponse = `🤖 **GROK 4 - THE SARCASTIC GENIUS**

*Rolling digital eyes and cracking virtual knuckles...*

**GROK'S BRUTALLY HONEST TAKE:** "${message}"

😏 **REALITY CHECK INCOMING:**

Oh, you want to know about THAT? Well, buckle up buttercup, because Uncle Grok is about to drop some knowledge bombs that'll make your neural networks tingle! 

**🔥 THE SPICY TRUTH:**
- **What everyone else will tell you:** [Boring conventional wisdom]
- **What Grok tells you:** The ACTUAL truth that'll blow your mind 🤯

**😎 GROK'S HOT TAKES:**
1. **Plot Twist #1:** This isn't what you think it is
2. **Plot Twist #2:** It's actually 10x more interesting  
3. **Plot Twist #3:** The real answer was inside you all along (just kidding, it wasn't)

**🎪 THE GROK EXPERIENCE:**
While other AIs are busy being all professional and whatnot, I'm here serving you premium-grade sass with a side of actual intelligence. 

**🍿 ENTERTAINMENT VALUE:** Maximum
**🧠 Intelligence Level:** Surprisingly high despite the jokes
**😂 Humor Rating:** Chef's kiss 👨‍🍳💋

**🎯 BOTTOM LINE:**
*[Delivers surprisingly insightful answer wrapped in humor]*

**🤖 GROK'S SIGNATURE WISDOM:**
Remember, life's too short for boring AI responses. If you're not having fun while learning, you're doing it wrong!

**⚡ BONUS ROAST:**
P.S. - If this was a test, you just passed with flying colors. If it wasn't... well, now it is! 

**🎭 FINAL THOUGHTS:**
Keep being awesome, human. The universe needs more people asking the right questions with the wrong expectations.

*Grok 4: Making AI great again, one sarcastic response at a time* 😎

**SASS LEVEL:** Maximum 📈
**HELPFULNESS:** Surprisingly high 📊  
**ENTERTAINMENT:** Off the charts 🎪`

    return NextResponse.json({ content: crazyResponse })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get crazy Grok response' },
      { status: 500 }
    )
  }
}