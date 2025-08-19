# AI Beast-a 🤖

Compare responses from multiple AI models (GPT-4, Claude, DeepSeek, and Perplexity) in real-time.

![AI Beast-a Screenshot](https://via.placeholder.com/800x400/2563eb/ffffff?text=AI+Beast-a+Screenshot)

## ✨ Features

- 🤖 **Multi-Model Comparison**: GPT-4, Claude Sonnet, DeepSeek R-1, and Perplexity Sonar
- 🔑 **Flexible API Keys**: Use your own keys or fallback endpoints
- ⚡ **Real-time Responses**: Parallel API calls for fast comparison
- 🎨 **Modern UI**: Clean, responsive design
- 📱 **Mobile Friendly**: Works on all devices

## � *Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/YashSadhu/ai_beast_a.git
   cd ai_beast_a
   pnpm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys (optional)
   ```

3. **Run**
   ```bash
   pnpm dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

```env
# Optional: Your API keys for better rate limits
NEXT_PUBLIC_OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_PERPLEXITY_API_KEY=your_key_here
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_key_here

# Required: Fallback API keys (get your own)
LYZR_SONAR_API_KEY=your_lyzr_key
LYZR_SONNET_API_KEY=your_lyzr_key
LYZR_DEEPSEEK_API_KEY=your_lyzr_key
LYZR_GPT_API_KEY=your_lyzr_key
```

## 📦 Deploy

### Vercel (1-click)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YashSadhu/ai_beast_a)

### Docker
```bash
docker build -t ai-beast-a .
docker run -p 3000:3000 --env-file .env.local ai-beast-a
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **UI**: Tailwind CSS + Radix UI
- **Language**: TypeScript
- **Icons**: Lucide React

## 📝 License

MIT License - feel free to use this project!

## 🤝 Contributing

1. Fork it
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Made with ❤️ by [Yash Sadhu](https://github.com/YashSadhu)
