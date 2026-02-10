# Wiki-Methods: Interactive Research Methods Platform

A modern, interactive web application that reimagines the [Sustainability Methods Wiki](https://sustainabilitymethods.org) as an engaging digital learning platform. Built with Next.js 15, this project transforms traditional academic content into an interactive experience with dynamic visualizations, personalized method recommendations, and collaborative features.

## 🎯 Project Vision

Wiki-Methods bridges the gap between theoretical methodology and practical application by providing:

- **Interactive Learning**: Transform static wiki content into engaging, visual learning experiences
- **Method Discovery**: Find the right research methods through AI-powered recommendations
- **Visual Exploration**: Understand method relationships through force-directed graphs and network visualizations
- **Community Knowledge**: Share experiences and insights through user-contributed posts
- **Beginner-Friendly**: Special focus on starter methods for researchers new to sustainability science

## 🌟 Key Features

### 📚 Comprehensive Method Library

- **500+ Research Methods**: Curated collection from the Sustainability Methods Wiki
- **Dynamic Content**: Real-time fetching from MediaWiki API with fallback support
- **Smart Categorization**: Methods organized by type (qualitative/quantitative), reasoning (deductive/inductive), scale (individual/system/global), and temporal focus

### 🎨 Interactive Visualizations

- **Force-Directed Graphs**: Explore method relationships through D3.js visualizations
- **Method Landscapes**: Navigate interconnected networks of related methodologies
- **Ethnography Landscape**: Specialized visualization for ethnographic research methods
- **Hierarchical Trees**: Understand method taxonomies through interactive tree diagrams

### 🔍 Method Recommendation Tool

- **Criteria-Based Filtering**: Find methods based on research design criteria
- **Starter Package**: Curated selection of beginner-friendly methods
- **Multi-Dimensional Search**: Filter by methodology type, reasoning approach, scale, and time orientation
- **Real-Time Results**: Instant recommendations as you refine your criteria

### 💬 Community Engagement

- **User Posts**: Share experiences, insights, and feedback
- **Method Reviews**: Rate and discuss different research approaches
- **Wiki Integration**: Link community discussions to specific methods

### 🎯 Modern User Experience

- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Clean Minimalist UI**: Focus on content with distraction-free interface
- **Fast Performance**: Server-side rendering with optimized data fetching
- **Accessible**: WCAG compliant with semantic HTML and ARIA labels

## 🏗️ Technical Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules with design system
- **Database**: PostgreSQL with Prisma ORM
- **Visualizations**: D3.js v7
- **External API**: MediaWiki API integration
- **Deployment**: Vercel-optimized

### Architecture Patterns

- **Server-First**: Maximizing Server Components for optimal performance
- **Server Actions**: All mutations handled server-side
- **Type Safety**: Prisma-generated types throughout
- **Error Handling**: Graceful fallbacks with user-friendly messages
- **Content Safety**: DOMPurify for external HTML sanitization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm/bun

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/wiki-methods.git
cd wiki-methods
```

2. **Install dependencies**

```bash
npm install
# This automatically runs prisma generate
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
# Add your DATABASE_URL and other required variables
```

4. **Initialize the database**

```bash
npx prisma db push
```

5. **Run the development server**

```bash
npm run dev --turbopack
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
wiki-methods/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── wiki/              # Wiki content pages
│   │   ├── landscapes/        # Visualization pages
│   │   ├── starter-package/   # Beginner methods
│   │   └── posts/             # Community posts
│   ├── components/
│   │   ├── charts/            # D3.js visualizations
│   │   ├── homepage/          # Landing page sections
│   │   ├── navbar/            # Navigation components
│   │   └── card/              # Reusable card components
│   ├── lib/
│   │   ├── actions.ts         # Server Actions
│   │   ├── fetchData.ts       # MediaWiki API integration
│   │   ├── starterData.ts     # Beginner method data
│   │   └── db.ts              # Prisma singleton
│   └── styles/                # Global styles
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── generated/             # Auto-generated types
└── public/
    └── designs/               # UI design references
```

## 🎨 Design System

The project uses a comprehensive design system with:

- **CSS Custom Properties**: Consistent theming throughout
- **Spacing Scale**: 8pt grid system
- **Typography**: Inter Tight font family
- **Color Palette**: Carefully selected for accessibility
- **Component Variants**: Flexible, reusable components

## 🔗 MediaWiki Integration

### Content Fetching

- **Real-time API**: Fetches latest content from Sustainability Methods Wiki
- **Image Proxy**: Next.js rewrites for external images
- **Error Handling**: Graceful fallbacks for missing pages
- **Content Safety**: HTML sanitization with DOMPurify

### Supported Content

- **500+ Methods**: Complete method library
- **Rich Formatting**: Preserve wiki formatting and links
- **Images**: Automatic URL conversion and optimization
- **Cross-References**: Maintain internal wiki links

## 🎯 Use Cases

### For Students

- **Learn Fundamentals**: Beginner-friendly method introductions
- **Visual Learning**: Understand relationships through interactive graphs
- **Guided Discovery**: Method recommendation tool for project planning

### For Researchers

- **Quick Reference**: Comprehensive method documentation
- **Method Selection**: Find appropriate methods for research design
- **Community Insights**: Learn from others' experiences

### For Educators

- **Teaching Resource**: Curated content for methodology courses
- **Visual Aids**: Interactive diagrams for classroom use
- **Course Integration**: Link to specific methods and collections

## 🛠️ Development

### Key Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio
npx prisma db push   # Push schema changes
```

### Code Standards

- **TypeScript**: Strict mode, no `any` types
- **Modern ES6+**: Array methods, destructuring, async/await
- **Component Pattern**: Server Components by default
- **Import Order**: React → Next.js → External → Internal → Styles

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:

- Code style and conventions
- Pull request process
- Issue reporting
- Feature requests

## 📚 Learn More

### About the Project

- [Sustainability Methods Wiki](https://sustainabilitymethods.org/index.php/Main_Page)
- [About Sustainability Methods](https://sustainabilitymethods.org/index.php/Sustainability_Methods:About)
- [Design Criteria of Methods](https://sustainabilitymethods.org/index.php/Design_Criteria_of_Methods)

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub Repository](https://github.com/vercel/next.js/)
- [Learn Next.js](https://nextjs.org/learn)

## 📄 License

This project is built upon the Sustainability Methods Wiki content, which is available under [appropriate license]. See LICENSE file for details.

## 🙏 Acknowledgments

- **Sustainability Methods Wiki**: For the comprehensive method library
- **Next.js Team**: For the excellent framework
- **D3.js Community**: For visualization capabilities
- **Contributors**: Everyone who has helped improve this project
