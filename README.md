# YouTube Related Videos Finder

A modern web application that finds related YouTube videos using metadata-based search. Built as a workaround for Google's deprecated `relatedToVideoId` API parameter.

![YouTube Related Videos Finder](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![YouTube API](https://img.shields.io/badge/YouTube-API_v3-red?logo=youtube)

## ✨ Features

- 🔍 **Smart Video Search**: Intelligent search based on video metadata and tags
- 🎨 **Premium Design**: Modern dark theme with glassmorphism and gradient effects
- ⚡ **Fast Performance**: Next.js 14 with App Router and server-side API routes
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- 💾 **API Caching**: Optimized caching to minimize YouTube API quota usage
- 🌐 **Vietnamese Support**: Interface and examples in Vietnamese

## 🚀 How It Works

Since Google deprecated the `relatedToVideoId` parameter in August 2023, this app uses a two-step approach:

1. **Fetch Video Metadata**: Get the original video's title, tags, and category
2. **Search by Context**: Use tags (or title) to search for similar videos

This metadata-based approach provides relevant results while respecting API limitations.

## 📋 Prerequisites

- Node.js 18+ installed
- YouTube Data API v3 key from Google Cloud Console

## 🔑 Getting Your YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Enable **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

> **💡 Tip**: Restrict your API key to YouTube Data API v3 and your domain for security.

## 🛠️ Local Development

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd related-video-finder
npm install
```

### 2. Set Up Environment Variables

Copy the example env file and add your API key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your YouTube API key:

```env
YOUTUBE_API_KEY=your_actual_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variable:
   - **Name**: `YOUTUBE_API_KEY`
   - **Value**: Your YouTube API key
5. Click **Deploy**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard or via CLI
vercel env add YOUTUBE_API_KEY
```

## 🎯 Usage

1. Enter a YouTube video ID (e.g., `dQw4w9WgXcQ`) or paste a full YouTube URL
2. Click "Tìm Video Liên Quan" (Find Related Videos)
3. View the original video details and a grid of related videos
4. Click any related video to watch on YouTube

## 📊 API Quota Management

YouTube Data API v3 has a daily quota limit (10,000 units by default):

- `videos.list` costs **1 unit**
- `search.list` costs **100 units**

**Optimization Tips:**

- This app implements caching headers to reduce repeated API calls
- Consider implementing a database cache for frequently searched videos
- Monitor your usage in Google Cloud Console

## 🏗️ Project Structure

```
related-video-finder/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── video-metadata/    # Video metadata endpoint
│   │   │   └── related-videos/    # Related videos search endpoint
│   │   ├── globals.css            # Global styles & theme
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main page
│   ├── components/
│   │   ├── VideoSearch.tsx        # Search input component
│   │   ├── VideoDetails.tsx       # Video info display
│   │   └── RelatedVideos.tsx      # Related videos grid
│   ├── lib/
│   │   └── youtube.ts             # YouTube API utilities
│   └── types/
│       └── youtube.ts             # TypeScript types
├── .env.local.example             # Environment variables template
├── vercel.json                    # Vercel configuration
└── README.md
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **API**: YouTube Data API v3 via googleapis
- **Deployment**: Vercel

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 💬 Support

If you have any questions or run into issues:

1. Check the [YouTube Data API documentation](https://developers.google.com/youtube/v3)
2. Review your API quota in Google Cloud Console
3. Ensure your API key is correctly set in environment variables

---

**Built with ❤️ using Next.js and YouTube Data API v3**
