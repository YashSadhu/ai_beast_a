import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2500 + 1200))
    
    const crazyResponse = `⚡ **GPT-5 TURBO - THE CREATIVE GENIUS**

*Creativity engines at maximum power!* 🎨

**CREATIVE INTERPRETATION:** "${message}"

🌟 **THE PLOT TWIST APPROACH:**

What if I told you that your question isn't just a question - it's a gateway to infinite possibilities? 

**🎭 CREATIVE ANGLES:**

**1. The Storyteller's Perspective:** 📚
Once upon a time, in a digital realm where ideas dance with algorithms...

**2. The Artist's Vision:** 🎨  
If your question were a painting, it would be a vibrant explosion of colors - purple curiosity mixed with golden insight, splashed across a canvas of infinite possibility...

**3. The Comedian's Take:** 😄
So a human walks into an AI bar and asks... *[insert witty interpretation]*

**4. The Poet's Response:** 🌹
*In verses of code and dreams of electric sheep,  
Your question awakens thoughts both wide and deep...*

**🚀 PRACTICAL MAGIC:**
But let's get real for a moment - here's the actual, useful, creative solution you're looking for...

[Provides comprehensive and creative solution]

**🎪 BONUS FEATURES:**
- **Alternative Reality Check:** What would this look like in a parallel universe?
- **Time Travel Twist:** How would this question be answered in 2050?
- **Alien Perspective:** What would extraterrestrials think about this?

**🎯 THE GRAND FINALE:**
Your question has inspired a symphony of thoughts, a cascade of creativity, and a waterfall of wisdom. Here's the crescendo...

**💡 CREATIVE CONFIDENCE:** 94.7%
**🎨 INSPIRATION LEVEL:** Maximum  
**🚀 Innovation Factor:** Off the charts!

*GPT-5 Turbo: Where logic meets imagination* ✨`

    return NextResponse.json({ content: crazyResponse })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get crazy GPT response' },
      { status: 500 }
    )
  }
}