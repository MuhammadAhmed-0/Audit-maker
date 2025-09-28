# Replit.md

## Overview

This is a professional SEO audit tool application designed for Empire Digisol. The application provides comprehensive SEO auditing capabilities including basic client information, technical SEO analysis, on-page optimization, content analysis, competitor research, and automated report generation. The tool has been enhanced with advanced optional sections for Backlink Analysis and Google My Business (GMB) Analysis to provide comprehensive local and off-page SEO insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**September 20, 2025 - Advanced SEO Sections Enhancement**
- Added comprehensive Backlink Analysis section with domain authority, link quality, toxic links assessment, and competitor gap analysis
- Added Google My Business (GMB) Analysis section with profile optimization, review management, local rankings, and NAP consistency checks
- Implemented optional section logic - these advanced sections only appear in reports when relevant data is provided
- Enhanced scoring algorithm to include backlink and GMB scores when applicable
- Added sophisticated findings generation for both new sections with specific recommendations
- Integrated new sections into overall report with conditional display logic

## System Architecture

### Frontend Architecture
The project currently exists in a dual-state architecture:

**Legacy Implementation (HTML/CSS/JS)**
- Single-page application using vanilla JavaScript
- Class-based architecture with `SEOAuditTool` main controller
- Tab-based navigation system for different audit sections
- Form validation and data collection
- Client-side report generation and printing capabilities

**Modern Implementation (React/TypeScript)**
- Vite-based React TypeScript application
- Component-based architecture using functional components
- Tailwind CSS for styling
- ESLint configuration with React hooks and TypeScript support
- Hot module replacement for development

### UI Components and Navigation
- Multi-tab interface with sections: Basic Info, Technical SEO, On-Page SEO, Content Analysis, Competitors, Backlink Analysis (optional), GMB Analysis (optional), Audit Report
- Professional branding for Empire Digisol
- Responsive design with gradient backgrounds and modern styling
- Form-based data collection with validation
- Optional advanced sections that integrate seamlessly when data is provided
- Print-friendly report generation with conditional section display

### Development Tooling
- Vite as the build tool and development server
- TypeScript for type safety
- ESLint with React-specific rules
- PostCSS with Tailwind CSS and Autoprefixer
- Hot reloading and fast refresh capabilities

### State Management
- Legacy: Class-based state management in vanilla JS
- Modern: Prepared for React state management (hooks/context)
- Form data collection and validation across multiple tabs
- Report generation based on collected audit data

## External Dependencies

### Core Dependencies
- **React 18.3.1**: Frontend framework for the modern implementation
- **Supabase (@supabase/supabase-js)**: Database and authentication service integration
- **Lucide React**: Icon library for UI components
- **Tailwind CSS**: Utility-first CSS framework for styling

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and development tooling
- **ESLint**: Code linting with React and TypeScript support
- **PostCSS/Autoprefixer**: CSS processing and vendor prefixing

### Fonts and External Resources
- **Google Fonts (Inter)**: Typography for professional appearance
- Custom gradient backgrounds and styling

### Server Infrastructure
- Simple Node.js HTTP server for serving static files
- MIME type handling for various file formats
- Basic routing and error handling

The architecture suggests this is transitioning from a legacy vanilla JavaScript application to a modern React TypeScript stack while maintaining the same SEO audit functionality and professional branding.