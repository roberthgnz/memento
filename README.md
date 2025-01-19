<div align="center">
  <h1>Memento</h1>
  <h3>A beautiful and intuitive sticky notes application</h3>
  <p>Built with Next.js, Supabase, and TipTap</p>
</div>

## 🌟 Features

- ✨ Beautiful and intuitive sticky notes interface
- 📝 Rich text editing with TipTap
- 🎨 Customizable note colors
- 📌 Pin important notes
- 🔄 Real-time sync across devices
- 🌓 Light/Dark mode support
- 🔒 Authentication with GitHub and Google
- 🔗 Share notes with public links
- 📱 Responsive design

## 🚀 Tech Stack

- **Framework:** [Next.js 13](https://nextjs.org/) with App Router
- **Database:** [Supabase](https://supabase.com/)
- **Authentication:** Supabase Auth
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Rich Text Editor:** [TipTap](https://tiptap.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide](https://lucide.dev/)

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/roberthgnz/memento.git
cd memento
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm run dev
```

## 🤝 Contributing

We love contributions! Here's how you can help:

### Contributing Guidelines

1. Fork the repository
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- We use ESLint and Prettier for code formatting
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features

### Development Workflow

1. Pick an issue to work on
2. Create a branch with a descriptive name
3. Make your changes
4. Write or update tests
5. Update documentation if needed
6. Submit a pull request

### Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation if you're adding or changing features
3. The PR will be merged once you have the sign-off of at least one maintainer

## 📝 Project Structure

```
memento/
├── app/             # Next.js app router pages
├── components/      # React components
│   ├── ui/          # shadcn/ui components
│   └── ...          # Feature components
├── lib/             # Utility functions and shared logic
├── public/          # Static assets
├── styles/          # Global styles
├── types/           # TypeScript type definitions
└── supabase/        # Supabase configurations and migrations
```

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [TipTap](https://tiptap.dev/) for the amazing rich text editor
- [Supabase](https://supabase.com/) for the backend infrastructure
- All our contributors and supporters

## 🤔 Questions?

Feel free to [open an issue](https://github.com/roberthgnz/memento/issues/new)

---

<div align="center">
  Made with ❤️ 
</div>