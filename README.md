# Culinary Companion

A Streamlit web application that helps you generate recipe ideas based on ingredients you have on hand. The app uses n8n as a backend service to process and generate recipe suggestions.

## Features

- Simple and intuitive interface
- Real-time recipe generation
- Clean and responsive design
- Error handling and user feedback

## Local Development

1. Install Streamlit:
```bash
pip install streamlit
```

2. Run the app locally:
```bash
streamlit run streamlit_app.py
```

## Deployment

This app is designed to be deployed on Streamlit Cloud. To deploy:

1. Push your code to a GitHub repository
2. Go to [Streamlit Cloud](https://streamlit.io/cloud)
3. Connect your GitHub repository
4. Deploy the app

## Environment Variables

The app requires the following environment variables:
- `N8N_WEBHOOK_URL`: The URL of your n8n webhook endpoint

Make sure to set these variables in your Streamlit Cloud deployment settings.

## Backend

The backend is powered by n8n, which processes the ingredients and generates recipe suggestions. The webhook URL is configured in the app to communicate with your n8n instance.
