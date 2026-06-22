# Contributing to Trading Recommendation System

Thank you for your interest in contributing! Here are the guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature: `git checkout -b feature/my-feature`
4. Set up your development environment
5. Make your changes
6. Test your changes
7. Commit your changes: `git commit -m 'Add my feature'`
8. Push to your fork: `git push origin feature/my-feature`
9. Create a Pull Request

## Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Code Style

- Use PEP 8 for Python code
- Use ESLint for JavaScript/TypeScript code
- Write meaningful commit messages
- Add comments for complex logic

## Testing

Before submitting a PR:
- Run backend tests: `pytest`
- Run frontend tests: `npm test`
- Ensure no linting errors

## Reporting Issues

When reporting issues, please include:
- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- System information

## License

By contributing, you agree that your contributions will be licensed under the MIT License.