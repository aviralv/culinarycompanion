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
pip install -r requirements.txt
```

3. Set up environment variables
- Copy `.env.example` to `.env`
```bash
cp .env.example .env
```
- Edit `.env` and add your Google Gemini API key
  - Get your API key from: https://makersuite.google.com/app/apikey
  - Replace `your_api_key_here` with your actual API key

4. Run the application
```bash
streamlit run streamlit_app.py
```

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
