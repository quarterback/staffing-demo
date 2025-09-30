# Contributing to Nautilus

Thank you for your interest in contributing to Nautilus! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- A Supabase account for backend functionality

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/nautilus-staffing.git
   cd nautilus-staffing
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase credentials
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code formatting and patterns
- Use meaningful variable and function names
- Add TypeScript types for all data structures

### Component Guidelines
- Place new components in `/src/components/`
- Use functional components with hooks
- Follow the existing component structure and naming
- Add proper TypeScript interfaces for props

### Design System
- Follow the established design patterns in `Guidelines.md`
- Use the existing Tailwind CSS classes and design tokens
- Maintain consistency with the professional SaaS aesthetic
- Ensure responsive design for all new components

### Backend Integration
- Use the existing API service layer in `/src/utils/api.ts`
- Add proper error handling and loading states
- Follow the Supabase integration patterns
- Test with the key-value store architecture

## 🔧 Pull Request Process

### Before Submitting
1. Ensure your code follows the existing style guidelines
2. Add or update tests for your changes
3. Update documentation as needed
4. Test your changes thoroughly
5. Make sure the build passes: `npm run build`

### Pull Request Guidelines
1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes with clear, descriptive commits:
   ```bash
   git commit -m "feat: add AI recommendation confidence scoring"
   ```

3. Push to your fork and submit a pull request
4. Fill out the pull request template completely
5. Link any related issues

### Commit Message Format
Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## 🐛 Bug Reports

When filing a bug report, please include:
- Clear description of the issue
- Steps to reproduce the problem
- Expected vs actual behavior
- Browser and environment information
- Screenshots if applicable
- Any error messages or console logs

## 💡 Feature Requests

For feature requests, please provide:
- Clear description of the proposed feature
- Use case and business justification
- Mockups or wireframes if applicable
- Technical considerations
- Impact on existing functionality

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Add unit tests for utility functions
- Add integration tests for API interactions
- Add component tests for complex components
- Follow the existing test patterns and structure

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components (do not modify)
│   └── ...             # Custom application components
├── utils/              # Utility functions and API services
├── data/               # Mock data and type definitions
├── styles/             # Global CSS and styling
└── supabase/           # Backend edge functions
```

### Adding New Components
1. Create the component file in `/src/components/`
2. Export from the component file
3. Add TypeScript interfaces for props
4. Include proper error boundaries if needed
5. Add to the appropriate parent component

### API Integration
- Use the existing API service layer
- Add new endpoints to `/src/utils/api.ts`
- Follow the established error handling patterns
- Add proper TypeScript types for requests/responses

## 🔒 Security Guidelines

- Never commit sensitive information (API keys, passwords)
- Use environment variables for configuration
- Follow secure coding practices
- Report security vulnerabilities privately

## 📖 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props with TypeScript interfaces
- Include usage examples for utility functions
- Update README.md for significant changes

### Component Documentation
- Document component purpose and usage
- Include prop descriptions and types
- Add examples of common use cases
- Note any dependencies or requirements

## 🎨 Design Contributions

### UI/UX Guidelines
- Follow the Nautilus design system guidelines
- Maintain consistency with existing components
- Consider accessibility requirements
- Test responsive design across devices

### Design Assets
- Use consistent iconography (Lucide React)
- Follow the established color palette
- Maintain proper spacing and typography
- Include hover and active states

## 🚀 Release Process

### Version Numbering
- Follow semantic versioning (semver)
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)
- [ ] Performance impact assessed

## 📞 Getting Help

- Check existing issues and discussions
- Read the documentation thoroughly
- Ask questions in GitHub Discussions
- Join the development chat (if available)

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation
- Annual contributor recognition

Thank you for contributing to Nautilus! 🚀