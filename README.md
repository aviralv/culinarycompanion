# Culinary Companion

An AI-powered recipe generator that helps you create delicious meals with the ingredients you have.

## Setup

1. Clone the repository
```bash
git clone https://github.com/aviralv/culinarycompanion.git
cd culinarycompanion
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (if needed for frontend)

4. Run the application
```bash
npm start
```

The backend is managed via n8n with a Google Gemini integration. All API requests are now handled by the production n8n endpoint: https://automation.chiragsangani.com/webhook/4b812275-4ff0-42a6-a897-2c8ad444a1e1

## Features

- Generate recipe ideas based on available ingredients
- Get detailed instructions and ingredients list
- Beautiful, easy-to-read recipe cards
- Responsive design for all devices

## Environment Variables

The following environment variables are required:

- `GOOGLE_GENAI_API_KEY`: Your Google Gemini API key for recipe generation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Note

Never commit your `.env` file or expose your API keys. The `.env` file is listed in `.gitignore` to prevent accidental commits.
