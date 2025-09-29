# Nautilus - AI-Powered Staffing Tool

An intelligent, cross-functional staffing platform designed for delivery teams. Nautilus helps delivery leaders efficiently staff talent across Design, Engineering, Product Management, and Program Management disciplines using AI-powered recommendations and comprehensive workforce analytics.

![Nautilus Dashboard](https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop)

## ✨ Features

### 🎯 Intelligent Staffing
- **AI Recommendations**: Smart candidate matching with confidence scores and trade-off analysis
- **Multi-Discipline Support**: Design (D3-D6), Engineering (E3-E6), Product (P3-P6), Program Management (PM3-PM6)
- **Real-time Availability**: Live status tracking with conflict detection
- **One-Click Assignment**: Seamless candidate assignment with automatic status updates

### 📊 Analytics & Forecasting
- **Pipeline Visualization**: 90-day staffing forecast with trend analysis
- **Resource Optimization**: Identify over/under-utilized talent
- **Performance Metrics**: Utilization rates, assignment success rates, time-to-fill
- **Cost Analysis**: Built-in meeting cost estimator and resource planning

### 🔧 Enterprise Integrations
- **Jira Integration**: Direct pull of staffing requests with status sync
- **Slack Integration**: Automated notifications and team communication
- **Extensible Architecture**: Ready for additional tool integrations

### 👥 Comprehensive People Management
- **Cross-Functional Roster**: Complete visibility across all disciplines
- **Advanced Filtering**: Discipline, level, and availability-based search
- **Team Builder**: Drag-and-drop interface for project team composition
- **Practice Lead Identification**: Clear designation of senior contributors

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nautilus-staffing.git
   cd nautilus-staffing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials in `.env.local`

4. **Set up Supabase**
   - Create a new Supabase project
   - The key-value store table will be created automatically
   - Deploy the edge functions (optional for full backend functionality)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
nautilus-staffing/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── components/             # React components
│   │   ├── ui/                # shadcn/ui components
│   │   └── ...                # Custom components
│   ├── utils/                 # API services and utilities
│   ├── data/                  # Mock data and types
│   ├── styles/                # Global CSS and Tailwind config
│   └── supabase/              # Backend edge functions
├── public/                    # Static assets
├── DEMO_SCRIPT.md            # Comprehensive demo guide
└── Guidelines.md             # Design and functionality guidelines
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **Recharts** for data visualization
- **Motion** for animations

### Backend
- **Supabase** PostgreSQL database
- **Supabase Edge Functions** with Hono web server
- **TypeScript** throughout

### Key Libraries
- `react-hook-form` for form management
- `sonner` for toast notifications
- `recharts` for charts and analytics
- `motion` for smooth animations

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Supabase Setup
The application uses a key-value store architecture that's automatically initialized. No manual database setup required.

## 🎨 Design System

Nautilus follows a professional SaaS design system with:
- **Light mode interface** with blue/teal/green accents
- **Rounded corners** and soft shadows
- **Clean typography** with consistent spacing
- **Responsive design** optimized for desktop and mobile

## 📱 Features Overview

### Dashboard
- Executive summary with key metrics
- Quick navigation to staffing, people, and forecast views
- Real-time status updates

### Staffing Requests
- Browse active requests from integrated tools
- AI-powered candidate recommendations
- Detailed request views with team composition
- Direct assignment and escalation workflows

### People Management
- Cross-functional team roster
- Advanced filtering and search
- Availability tracking and conflict detection
- Practice lead identification

### Team Builder
- Drag-and-drop team composition
- Real-time availability checking
- Project timeline management
- Resource conflict resolution

### Analytics & Forecasting
- 90-day staffing pipeline
- Resource utilization metrics
- Trend analysis and predictions
- Cost optimization insights

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application is a standard React app and can be deployed to:
- Netlify
- AWS Amplify
- Google Cloud Platform
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure responsive design principles

## 📊 Demo

See `DEMO_SCRIPT.md` for a comprehensive demo guide including:
- Technical architecture overview
- Feature walkthrough
- Business value propositions
- Talking points for different audiences

## 🔒 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS) ready
- API key management through secure environment variables
- No sensitive data in client-side code

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com) component library
- Icons by [Lucide](https://lucide.dev)
- Charts powered by [Recharts](https://recharts.org)
- Backend infrastructure by [Supabase](https://supabase.com)

---

**Nautilus** - Transforming how organizations approach cross-functional staffing through intelligent automation and comprehensive analytics.
