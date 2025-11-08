# Contributing to Leverage Journal™

Thank you for your interest in contributing to Leverage Journal! We welcome contributions from the community and are excited to see what you'll bring to the project.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue template** when available
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/device information

### Suggesting Features

We love feature suggestions! Please:

1. **Check existing feature requests** first
2. **Describe the problem** you're trying to solve
3. **Explain your proposed solution**
4. **Consider the impact** on existing users

### Code Contributions

#### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/leveragejournal.git
   cd leveragejournal
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

#### Development Guidelines

##### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use descriptive, camelCase variable names

##### Component Guidelines

- **Functional Components**: Use React functional components with hooks
- **Props Interface**: Define TypeScript interfaces for all props
- **Accessibility**: Ensure components are accessible (WCAG 2.1)
- **Responsive**: Design mobile-first, responsive components

##### File Structure

```
components/
├── ui/                 # Base UI components
│   ├── button.tsx     # Reusable button component
│   └── card.tsx       # Reusable card component
├── forms/             # Form-specific components
└── layout/            # Layout components
```

##### Commit Messages

Use conventional commits:

```
feat: add new goal tracking feature
fix: resolve mobile navigation issue
docs: update installation instructions
style: improve button hover animations
refactor: optimize dashboard performance
test: add unit tests for auth flow
```

#### Testing

- **Unit Tests**: Write tests for utility functions
- **Component Tests**: Test component behavior and props
- **Integration Tests**: Test user workflows
- **Accessibility Tests**: Ensure WCAG compliance

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run accessibility tests
npm run test:a11y
```

#### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update the README** if applicable
5. **Request review** from maintainers

##### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Accessibility considerations addressed

## 🎨 Design Guidelines

### Brand Colors

- **Primary Yellow**: `#EAB308` (yellow-500)
- **Secondary Black**: `#000000`
- **Accent Gray**: `#6B7280` (gray-500)
- **Success Green**: `#10B981` (emerald-500)
- **Error Red**: `#EF4444` (red-500)

### Typography

- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, appropriate contrast
- **Interactive Elements**: Clear hover/focus states

### Spacing

- **Consistent**: Use Tailwind spacing scale
- **Breathing Room**: Adequate white space
- **Mobile-First**: Responsive spacing

## 📱 Mobile Considerations

- **Touch Targets**: Minimum 44px for interactive elements
- **Performance**: Optimize for slower connections
- **Gestures**: Support common mobile gestures
- **Orientation**: Handle both portrait and landscape

## 🔒 Security Guidelines

- **Input Validation**: Sanitize all user inputs
- **Authentication**: Follow security best practices
- **Dependencies**: Keep dependencies updated
- **Secrets**: Never commit sensitive information

## 📊 Performance Guidelines

- **Core Web Vitals**: Maintain excellent scores
- **Bundle Size**: Monitor and optimize bundle size
- **Images**: Optimize images and use next/image
- **Caching**: Implement appropriate caching strategies

## 🌍 Internationalization

- **Text Externalization**: Use i18n for all user-facing text
- **RTL Support**: Consider right-to-left languages
- **Cultural Sensitivity**: Be mindful of cultural differences
- **Date/Time**: Handle different formats appropriately

## 📝 Documentation

- **Code Comments**: Comment complex logic
- **README Updates**: Keep documentation current
- **API Documentation**: Document all APIs
- **Examples**: Provide usage examples

## 🚀 Release Process

1. **Version Bump**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md
3. **Testing**: Comprehensive testing on staging
4. **Review**: Code review and approval
5. **Deploy**: Deploy to production
6. **Monitor**: Monitor for issues post-deployment

## 🆘 Getting Help

- **Documentation**: Check existing docs first
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create an issue for bugs
- **Email**: Contact [dev@leveragejournal.com](mailto:dev@leveragejournal.com)

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, nationality
- Personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**

- Trolling, insulting/derogatory comments, personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Report unacceptable behavior to [conduct@leveragejournal.com](mailto:conduct@leveragejournal.com). All reports will be reviewed and investigated promptly and fairly.

## 🎉 Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **Release Notes**: Major contribution mentions
- **Website**: Contributor spotlight (with permission)
- **Swag**: Contributor merchandise for significant contributions

## 📞 Contact

- **General Questions**: [hello@leveragejournal.com](mailto:hello@leveragejournal.com)
- **Technical Issues**: [dev@leveragejournal.com](mailto:dev@leveragejournal.com)
- **Security Issues**: [security@leveragejournal.com](mailto:security@leveragejournal.com)

---

Thank you for contributing to Leverage Journal™! Together, we're helping people transform their lives in 90 days. 🚀
