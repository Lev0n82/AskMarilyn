# Ask Marilyn About Software Testing

A comprehensive, interactive web-based course teaching **Action-Based Testing (ABT)** methodology through the persona of Marilyn vos Savant. This application delivers structured learning content with gamification elements, progress tracking, and community features.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Database Setup](#database-setup)
8. [Running the Application](#running-the-application)
9. [Project Structure](#project-structure)
10. [API Reference](#api-reference)
11. [Testing](#testing)
12. [Accessibility](#accessibility)
13. [Contributing](#contributing)
14. [License](#license)

---

## Overview

Ask Marilyn is an educational platform designed to teach software testers and developers the principles of Action-Based Testing. The course content is presented through a unique editorial format inspired by Marilyn vos Savant's "Ask Marilyn" column, making complex testing concepts accessible and engaging.

The platform includes ten core modules covering ABT fundamentals, three bonus courses on related topics, interactive challenges, and a comprehensive progress tracking system with certificates and badges.

---

## Features

### Core Learning Modules

The ABT Fundamentals course consists of ten progressive modules:

| Module | Title | Description |
|--------|-------|-------------|
| 1 | The Testing Paradox | Introduction to common testing challenges |
| 2 | The Three Layers | Understanding ABT's layered architecture |
| 3 | Anti-Patterns | Identifying and avoiding common mistakes |
| 4 | Architecture | Structuring test suites effectively |
| 5 | Language of Logic | Writing clear, logical test cases |
| 6 | Test Life-Cycle | Managing tests from creation to retirement |
| 7 | Building Test Modules | Practical module construction |
| 8 | Advanced Techniques | Data-driven and parameterized testing |
| 9 | Anti-Pattern Gallery | Real-world examples of what to avoid |
| 10 | Test Design Template | Ready-to-use templates and patterns |

### Bonus Courses

Three additional courses complement the ABT fundamentals:

- **Coding Style Guide**: Best practices for writing maintainable code
- **Art of Commenting**: Effective documentation strategies
- **Technical Writing Guide**: Professional documentation techniques

### Interactive Features

- **Refactoring Game**: Transform poorly written tests into ABT-compliant code
- **Boss Level Challenge**: The Architect's Challenge for advanced learners
- **Final Assessment Quiz**: Comprehensive knowledge evaluation
- **Test Builder**: Interactive tool for creating ABT-style tests

### Gamification System

- **Badges**: Earn achievements for completing courses and challenges
- **Leaderboard**: Compete with other learners
- **Streaks**: Track daily learning consistency
- **Certificates**: Downloadable completion certificates

### Community Features

- **Discussion Forum**: Share questions and examples with other learners
- **Learning Progress Dashboard**: Visualize your journey
- **Peer Comparison Statistics**: See how you compare to the community

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.1 | UI framework |
| TypeScript | 5.9.3 | Type-safe JavaScript |
| Tailwind CSS | 4.1.14 | Utility-first styling |
| Vite | 7.1.7 | Build tool and dev server |
| tRPC | 11.6.0 | End-to-end typesafe APIs |
| TanStack Query | 5.90.2 | Server state management |
| Wouter | 3.3.5 | Lightweight routing |
| Radix UI | Various | Accessible component primitives |
| Framer Motion | 12.23.22 | Animation library |
| Recharts | 2.15.2 | Data visualization |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 4.21.2 | HTTP server |
| tRPC Server | 11.6.0 | API procedures |
| Drizzle ORM | 0.44.5 | Database ORM |
| MySQL2 | 3.15.0 | Database driver |
| Jose | 6.1.0 | JWT handling |
| Zod | 4.1.12 | Schema validation |

### Infrastructure

| Service | Purpose |
|---------|---------|
| MySQL/TiDB | Primary database |
| AWS S3 | File storage |
| Manus OAuth | Authentication provider |

---

## Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
├─────────────────────────────────────────────────────────────┤
│  Pages          │  Components      │  Contexts              │
│  - Modules      │  - Layout        │  - AuthContext         │
│  - Quiz         │  - UI Components │  - ProgressContext     │
│  - Forum        │  - UserProfile   │  - ThemeContext        │
│  - Progress     │  - ModuleProgress│                        │
└────────────────────────────┬────────────────────────────────┘
                             │ tRPC Client
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Server (Express + tRPC)                  │
├─────────────────────────────────────────────────────────────┤
│  Routers         │  Core Services   │  Database             │
│  - auth          │  - OAuth         │  - Drizzle ORM        │
│  - leaderboard   │  - JWT           │  - MySQL/TiDB         │
│  - badges        │  - LLM           │                        │
│  - forum         │  - Storage       │                        │
│  - progress      │  - Notifications │                        │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authentication**: Users authenticate via Manus OAuth, receiving a JWT session cookie
2. **API Calls**: Frontend uses tRPC hooks to call backend procedures
3. **Data Persistence**: Drizzle ORM manages all database operations
4. **File Storage**: User uploads and generated certificates stored in S3

---

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 22.x or higher
- **pnpm**: Version 10.4.1 or higher (specified in packageManager)
- **MySQL**: Version 8.0 or higher (or TiDB)

### Clone the Repository

```bash
git clone https://github.com/Lev0n82/AskMarilyn.git
cd AskMarilyn
```

### Install Dependencies

```bash
pnpm install
```

This will install all required dependencies and apply any necessary patches.

---

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
DATABASE_URL=mysql://username:password@host:port/database_name

# Authentication
JWT_SECRET=your-secure-jwt-secret-key
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# Owner Information
OWNER_OPEN_ID=owner-open-id
OWNER_NAME=Owner Name

# Built-in Services (Manus Platform)
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Application Branding
VITE_APP_TITLE=Ask Marilyn About Software Testing
VITE_APP_LOGO=/logo.svg
```

### Environment Variable Descriptions

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string with SSL support |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens (min 32 characters) |
| `VITE_APP_ID` | Yes | Manus OAuth application identifier |
| `OAUTH_SERVER_URL` | Yes | Manus OAuth backend URL |
| `VITE_OAUTH_PORTAL_URL` | Yes | Manus login portal URL for frontend redirects |
| `OWNER_OPEN_ID` | Yes | Owner's Manus OpenID for admin features |
| `OWNER_NAME` | Yes | Display name for the application owner |
| `BUILT_IN_FORGE_API_URL` | Yes | Manus Forge API endpoint |
| `BUILT_IN_FORGE_API_KEY` | Yes | Server-side Forge API key |
| `VITE_FRONTEND_FORGE_API_KEY` | Yes | Client-side Forge API key |
| `VITE_FRONTEND_FORGE_API_URL` | Yes | Client-side Forge API endpoint |
| `VITE_APP_TITLE` | No | Application title (default: Ask Marilyn) |
| `VITE_APP_LOGO` | No | Path to application logo |

---

## Database Setup

### Schema Overview

The application uses the following database tables:

| Table | Purpose |
|-------|---------|
| `users` | User accounts and authentication |
| `leaderboard` | Game scores and rankings |
| `badges` | User achievement badges |
| `forum_posts` | Discussion forum posts |
| `forum_replies` | Replies to forum posts |
| `user_streaks` | Daily activity tracking |
| `quiz_attempts` | Individual quiz attempt records |
| `course_progress` | Overall course completion status |
| `topic_progress` | Granular topic-level progress |
| `course_certificates` | Issued completion certificates |
| `spaced_repetition_queue` | Failed questions for review |
| `community_stats` | Aggregated community statistics |

### Running Migrations

Generate and apply database migrations:

```bash
pnpm db:push
```

This command runs `drizzle-kit generate` followed by `drizzle-kit migrate` to synchronize your database schema.

### Database Connection

The application expects a MySQL-compatible database with SSL support. When connecting to cloud databases (TiDB, PlanetScale, etc.), ensure SSL is enabled in your connection string:

```
mysql://user:password@host:port/database?ssl={"rejectUnauthorized":true}
```

---

## Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Production Build

Build the application for production:

```bash
pnpm build
```

This creates optimized bundles in the `dist` directory.

### Start Production Server

Run the production server:

```bash
pnpm start
```

### Additional Commands

| Command | Description |
|---------|-------------|
| `pnpm check` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run test suite with Vitest |
| `pnpm db:push` | Generate and apply database migrations |

---

## Project Structure

```
AskMarilyn/
├── client/                    # Frontend application
│   ├── public/               # Static assets
│   │   ├── images/          # Course images and illustrations
│   │   └── abt_cheat_sheet.pdf
│   └── src/
│       ├── _core/           # Core hooks and utilities
│       │   └── hooks/       # useAuth and other core hooks
│       ├── components/      # Reusable UI components
│       │   ├── ui/         # shadcn/ui components
│       │   ├── Layout.tsx  # Main layout with navigation
│       │   ├── UserProfileMenu.tsx
│       │   ├── ModuleProgress.tsx
│       │   └── ResumeLearning.tsx
│       ├── contexts/        # React contexts
│       │   ├── ProgressContext.tsx
│       │   └── ThemeContext.tsx
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utility libraries
│       │   ├── trpc.ts     # tRPC client configuration
│       │   └── utils.ts    # Helper functions
│       ├── pages/           # Page components
│       │   ├── Home.tsx
│       │   ├── Module1.tsx through Module10.tsx
│       │   ├── Quiz.tsx
│       │   ├── RefactoringChallenge.tsx
│       │   ├── BossLevel.tsx
│       │   ├── Certificate.tsx
│       │   ├── CourseCatalog.tsx
│       │   ├── CodingStyleGuide.tsx
│       │   ├── CommentingGuide.tsx
│       │   ├── TechnicalWritingGuide.tsx
│       │   └── ...
│       ├── App.tsx          # Route definitions
│       ├── main.tsx         # Application entry point
│       └── index.css        # Global styles and theme
├── server/                   # Backend application
│   ├── _core/               # Core server infrastructure
│   │   ├── context.ts      # tRPC context builder
│   │   ├── env.ts          # Environment configuration
│   │   ├── llm.ts          # LLM integration
│   │   ├── oauth.ts        # OAuth handlers
│   │   └── trpc.ts         # tRPC initialization
│   ├── db.ts                # Database query helpers
│   ├── routers.ts           # tRPC procedure definitions
│   └── storage.ts           # S3 storage helpers
├── drizzle/                  # Database schema and migrations
│   ├── schema.ts            # Table definitions
│   ├── relations.ts         # Table relationships
│   └── migrations/          # Generated migrations
├── shared/                   # Shared types and constants
│   ├── types.ts             # Shared TypeScript types
│   └── const.ts             # Shared constants
├── patches/                  # Dependency patches
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── drizzle.config.ts        # Drizzle ORM configuration
└── vitest.config.ts         # Test configuration
```

---

## API Reference

The application uses tRPC for type-safe API communication. All procedures are defined in `server/routers.ts`.

### Authentication Procedures

| Procedure | Type | Description |
|-----------|------|-------------|
| `auth.me` | Query | Get current authenticated user |
| `auth.logout` | Mutation | End user session |

### Leaderboard Procedures

| Procedure | Type | Description |
|-----------|------|-------------|
| `leaderboard.getAll` | Query | Fetch leaderboard entries |
| `leaderboard.submit` | Mutation | Submit a new score |

### Badge Procedures

| Procedure | Type | Description |
|-----------|------|-------------|
| `badges.getUserBadges` | Query | Get user's earned badges |
| `badges.awardBadge` | Mutation | Award a badge to user |

### Forum Procedures

| Procedure | Type | Description |
|-----------|------|-------------|
| `forum.getPosts` | Query | List forum posts |
| `forum.getPost` | Query | Get single post with replies |
| `forum.createPost` | Mutation | Create new post |
| `forum.createReply` | Mutation | Reply to a post |

### Progress Procedures

| Procedure | Type | Description |
|-----------|------|-------------|
| `progress.getCourseProgress` | Query | Get progress for all courses |
| `progress.getTopicProgress` | Query | Get progress for specific topic |
| `progress.updateProgress` | Mutation | Update topic progress |
| `progress.recordQuizAttempt` | Mutation | Record quiz attempt |

### Certificate Procedures

| Procedure | Type | Description |
|-----------|------|-------------|
| `certificates.getUserCertificates` | Query | Get user's certificates |
| `certificates.issueCertificate` | Mutation | Issue new certificate |
| `certificates.verifyCertificate` | Query | Verify certificate validity |

---

## Testing

The application uses Vitest for unit and integration testing.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage
```

### Test Structure

Tests are co-located with their source files using the `.test.ts` suffix:

```
server/
├── auth.logout.test.ts    # Authentication tests
├── routers.ts
└── db.ts
```

### Writing Tests

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should behave correctly', async () => {
    // Arrange
    const input = { /* test data */ };
    
    // Act
    const result = await someFunction(input);
    
    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
```

---

## Accessibility

This application is designed to meet **WCAG 2.2 AAA** compliance standards.

### Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators throughout
- **Color Contrast**: Meets AAA contrast ratios
- **Responsive Design**: Works across all device sizes
- **Motion Preferences**: Respects `prefers-reduced-motion`

### Theme Support

The application supports both light and dark themes:

- **Light Mode**: Default theme with warm, paper-like aesthetics
- **Blueprint Mode**: Dark theme with technical blueprint styling

Users can toggle themes via the user profile dropdown menu.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Write tests** for any new functionality
3. **Follow the existing code style** (run `pnpm format` before committing)
4. **Update documentation** for any API changes
5. **Submit a pull request** with a clear description

### Code Style

The project uses Prettier for code formatting. Configuration is in `.prettierrc`:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Marilyn vos Savant** for the inspiration behind the educational format
- **LogiGear** for the Action-Based Testing methodology
- **shadcn/ui** for the beautiful component library
- **Manus Platform** for hosting and authentication services

---

## Support

For questions or issues, please:

1. Check the [Discussion Forum](https://github.com/Lev0n82/AskMarilyn/discussions) for existing answers
2. Open a [GitHub Issue](https://github.com/Lev0n82/AskMarilyn/issues) for bug reports
3. Contact the maintainers for security-related concerns

---

*"Logic is the beginning of wisdom, not the end."* — Marilyn vos Savant
