"use client"

import Link from "next/link"
import {
  ArrowRight,
  Check,
  X,
  DollarSign,
  VenetianMaskIcon as Mask,
  Battery,
  Scale,
  Infinity,
  Heart,
  Key,
  Twitter,
  Linkedin,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "Is AI Beast-A really free forever?",
      answer:
        "Yes, absolutely. I built this tool to be free and accessible to everyone. There are no hidden costs, no premium tiers, and no subscription traps.",
    },
    {
      question: "How can I use my own API keys?",
      answer:
        "Click the Settings button in the chat interface to add your own OpenAI, Anthropic, Perplexity, or DeepSeek API keys. This gives you unlimited usage with your own accounts.",
    },
    {
      question: "Why should I trust AI Beast-A over other AI tools?",
      answer:
        "Unlike other platforms that mislead users with fake model names and charge high fees, AI Beast-A is transparent, honest, and built by an independent developer who believes in accessible technology.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No! AI Beast-A requires no login, no registration, and no personal information. Just visit the site and start comparing AI models immediately.",
    },
  ]

  return (
    <div
      className="min-h-screen bg-white relative"
      style={{
        backgroundImage: `url('/landing-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-gray-100 py-4 px-6 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/ai-beast-logo.png" alt="AI Beast-a Logo" className="w-10 h-10 object-contain" />
              <h1 className="text-2xl font-bold text-gray-900">AI Beast-a</h1>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                NO LOGIN REQUIRED
              </span>
            </div>
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Try Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
              One Prompt. Four AI Brains. Zero Cost.
              <br />
              Stop Paying for AI Hype.
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              This Tool is FREE and Always will be. Other apps charge you ₹999/month for misleading models and low
              limits. AI Beast-A gives you direct, side-by-side access to the world's best AIs. No subscriptions. No BS.
              Just pure, honest power. Built for India.
            </p>
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-lg font-semibold">
                ✅ NO LOGIN REQUIRED - Start Instantly!
              </span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <span>Unleash the Beast - Try Now for Free!</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The AI 'Fiesta' is Over. It's Time for the Truth.
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                You've seen the ads. Fancy websites promising 'All Premium AI Models' for a 'low' monthly fee. They sell
                you on convenience but hide the truth in the fine print.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-red-600" />
                  <X className="w-4 h-4 text-red-600 -ml-2 -mt-2" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">They charge you a fortune</h3>
                <p className="text-slate-600">Why pay nearly ₹10,000 a year for something that should be accessible?</p>
              </div>

              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mask className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">They mislead you with fake model names</h3>
                <p className="text-slate-600 mb-4">
                  "ChatGPT 5"? "Gemini 2.5 Pro"? It's a marketing trick to make you think you're getting something
                  exclusive.
                </p>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 font-medium mb-2">PROOF: They're lying about model names!</p>
                  <a
                    href="https://ibb.co/YT2xjtxk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    See evidence: I asked their 3 models what model they are - all answered as GPT-4o
                  </a>
                </div>
              </div>

              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Battery className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">They trap you with tiny limits</h3>
                <p className="text-slate-600">
                  Their "premium" plan cuts you off at 400,000 tokens. That's designed to limit your potential.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <img
                src="/web-app-screenshot.png"
                alt="AI Beast-A Web App Screenshot showing real AI model comparison"
                className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl border border-gray-200"
              />
              <p className="text-center text-sm text-gray-600 mt-4">
                See for yourself: AI Beast-A uses real, verified AI models - no fake names or misleading claims
              </p>
            </div>

            <div className="mb-16 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">✨ Smart Prompt Enhancement</h3>
              <p className="text-lg text-slate-600 mb-6">
                Not sure how to phrase your question? Our AI-powered prompt enhancer automatically improves your prompts
                for better results.
              </p>
              <div className="max-w-2xl mx-auto">
                <img
                  src="/enhance-prompt-demo.gif"
                  alt="Enhance Prompt Feature Demo"
                  className="w-full rounded-lg shadow-lg border border-gray-200"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Watch how the enhance prompt feature transforms basic questions into detailed, effective prompts
                </p>
              </div>
            </div>

            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Introducing AI Beast-A. The Honest, Free, & Truly Powerful AI Tool.
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                I'm a solo coder who was tired of seeing fellow Indians being overcharged. So I built the alternative.
                AI Beast-A is my answer—a powerful, transparent tool built on a simple belief: essential technology
                should be free for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center p-6 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Compare the 4 Heavyweights</h3>
                <p className="text-slate-600">
                  Put responses from GPT, Gemini, Sonar, and Deepseek side-by-side. Get the most complete answer.
                </p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Infinity className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Truly Unlimited. No Fine Print.</h3>
                <p className="text-slate-600">
                  Forget about counting tokens. Ask, write, and create as much as you want. Your only limit is your
                  curiosity.
                </p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Use Your Own API Keys</h3>
                <p className="text-slate-600">
                  Add your own OpenAI, Anthropic, Perplexity, or DeepSeek keys for unlimited usage with complete
                  privacy.
                </p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Free. Forever.</h3>
                <p className="text-slate-600">
                  This isn't a trial. I pour my own money into the APIs to keep this service open. It's open-source and
                  always will be.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 px-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">The Choice is Clear.</h2>

            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">The Overpriced 'Fiesta'</th>
                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900 bg-blue-50">AI Beast-A</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-900">Monthly Cost</td>
                    <td className="px-6 py-4 text-red-600">₹999/month</td>
                    <td className="px-6 py-4 bg-blue-50 text-green-600 font-semibold">₹0 Forever</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-900">Model Transparency</td>
                    <td className="px-6 py-4">
                      <X className="w-5 h-5 text-red-500 inline mr-2" />
                      Fake model names
                    </td>
                    <td className="px-6 py-4 bg-blue-50">
                      <Check className="w-5 h-5 text-green-500 inline mr-2" />
                      Real, verified models
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-900">Usage Limits</td>
                    <td className="px-6 py-4">
                      <X className="w-5 h-5 text-red-500 inline mr-2" />
                      400k tokens/month
                    </td>
                    <td className="px-6 py-4 bg-blue-50">
                      <Check className="w-5 h-5 text-green-500 inline mr-2" />
                      Truly unlimited
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-900">Side-by-side Comparison</td>
                    <td className="px-6 py-4">
                      <X className="w-5 h-5 text-red-500 inline mr-2" />
                      One model at a time
                    </td>
                    <td className="px-6 py-4 bg-blue-50">
                      <Check className="w-5 h-5 text-green-500 inline mr-2" />4 models simultaneously
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-900">Login Required</td>
                    <td className="px-6 py-4">
                      <X className="w-5 h-5 text-red-500 inline mr-2" />
                      Yes, with subscription
                    </td>
                    <td className="px-6 py-4 bg-blue-50">
                      <Check className="w-5 h-5 text-green-500 inline mr-2" />
                      No login needed
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Own API Keys</td>
                    <td className="px-6 py-4">
                      <X className="w-5 h-5 text-red-500 inline mr-2" />
                      Not supported
                    </td>
                    <td className="px-6 py-4 bg-blue-50">
                      <Check className="w-5 h-5 text-green-500 inline mr-2" />
                      Full API key support
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Founder's Pledge */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Built by a Coder, Not a Corporation.</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              My name is Yash. I'm not a big company; I'm a developer who believes in the power of open and free
              information. This isn't just a project; it's a movement towards honest, accessible technology for all.
            </p>
          </div>
        </section>

        <section className="py-20 px-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready for AI without the BS?</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Ditch the expensive subscriptions and the fake promises. Experience the raw, unfiltered power of the best
              AI models, working together for you. No cost. No limits. No catch.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <span>Start Comparing AI Models Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <footer className="border-t border-gray-100 py-8 px-6 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>Made with ❤️ by Yash Sadhu</span>
                <span>•</span>
                <span>Saving you ₹999/month</span>
                <span>•</span>
                <span>Free forever, no hidden costs</span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="https://buymeacoffee.com/yashsadhu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  <span>☕</span>
                  <span>Buy me coffee</span>
                </a>
                <a
                  href="https://x.com/yashsadhu09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                  title="Follow on X (Twitter)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/in/yash-sadhu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
