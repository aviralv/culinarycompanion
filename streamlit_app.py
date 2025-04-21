import streamlit as st
import requests
import json
import os
from enum import Enum

# Define page states
class Page(Enum):
    INPUT = "input"
    LOADING = "loading"
    RESULTS = "results"

# Page configuration
st.set_page_config(
    page_title="Culinary Companion",
    page_icon="👨‍🍳",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Custom CSS
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    /* Design tokens */
    :root {
        --color-background: #F9FAFB;
        --color-white: #FFFFFF;
        --color-text-primary: #111827;
        --color-text-secondary: #6B7280;
        --color-accent: #6366F1;
        --color-accent-hover: #4F46E5;
        --color-border: #E5E7EB;
        --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Reset and base styles */
    .stApp {
        background-color: var(--color-background) !important;
        font-family: var(--font-family) !important;
    }

    /* Hide Streamlit branding */
    #MainMenu, footer, header {display: none;}
    
    /* Fix layout issues */
    .main .block-container {
        padding-top: 2rem !important;
        padding-bottom: 2rem !important;
        max-width: 48rem !important;
    }

    /* Main container */
    .main-container {
        background: var(--color-white);
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }

    /* App header */
    .app-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .app-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        display: inline-block;
    }

    /* Typography */
    h1 {
        color: var(--color-text-primary);
        font-size: 2.25rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .subtitle {
        color: var(--color-text-secondary);
        font-size: 1.125rem;
        text-align: center;
        margin-bottom: 2rem;
        max-width: 32rem;
        margin-left: auto;
        margin-right: auto;
    }

    /* Input field */
    .stTextInput > div > div > input {
        width: 100% !important;
        padding: 0.75rem 1rem !important;
        border: 1px solid var(--color-border) !important;
        border-radius: 0.5rem !important;
        font-size: 1rem !important;
        background: var(--color-white) !important;
    }

    /* Button */
    .stButton > button {
        width: 100% !important;
        background-color: var(--color-accent) !important;
        color: white !important;
        font-weight: 600 !important;
        padding: 0.75rem 1.5rem !important;
        border: none !important;
        border-radius: 0.5rem !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        margin-top: 1rem !important;
    }

    .stButton > button:hover {
        background-color: var(--color-accent-hover) !important;
        transform: translateY(-1px) !important;
    }

    /* Recipe cards */
    .recipe-card {
        background: var(--color-white);
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--color-border);
    }

    .recipe-title {
        color: var(--color-text-primary);
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .recipe-description {
        color: var(--color-text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    .recipe-section-title {
        color: var(--color-text-primary);
        font-size: 1.125rem;
        font-weight: 600;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
    }

    .recipe-list {
        margin-left: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .recipe-list li {
        margin-bottom: 0.5rem;
        line-height: 1.6;
    }
    </style>
""", unsafe_allow_html=True)

def verify_api_key():
    """Verify that the API key is set and valid"""
    api_key = os.getenv('GOOGLE_GENAI_API_KEY')
    if not api_key:
        st.error("⚠️ GOOGLE_GENAI_API_KEY is not set. Please configure it in your environment variables.")
        return False
    elif api_key == "your_api_key_here":
        st.error("⚠️ Please replace the default API key with your actual Gemini API key.")
        return False
    return True

def generate_recipes(ingredients):
    """Generate recipe ideas using the API"""
    try:
        api_key = os.getenv('GOOGLE_GENAI_API_KEY')
        url = "https://aviralv.app.n8n.cloud/webhook/4b812275-4ff0-42a6-a897-2c8ad444a1e1"
        payload = json.dumps({
            "ingredients": ingredients,
            "api_key": api_key
        })
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()
        
        data = response.json()
        if isinstance(data, dict) and 'recipe_output' in data:
            recipe_data = data['recipe_output']
            if isinstance(recipe_data, str):
                return json.loads(recipe_data), None
            elif isinstance(recipe_data, dict):
                return recipe_data, None
        return None, "Unexpected response structure"
        
    except requests.exceptions.RequestException as e:
        return None, f"Request failed: {str(e)}"
    except Exception as e:
        return None, f"An error occurred: {str(e)}"

def input_page():
    """Display the input page"""
    with st.container():
        # App header
        st.markdown('<div class="app-header">', unsafe_allow_html=True)
        st.markdown('<div class="app-icon">👨‍🍳</div>', unsafe_allow_html=True)
        st.markdown('<h1>Culinary Companion</h1>', unsafe_allow_html=True)
        st.markdown('<p class="subtitle">Turn your ingredients into creative meals. Just type what you\'ve got at home!</p>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Search form
        with st.form(key="recipe_form", clear_on_submit=False):
            ingredients = st.text_input(
                "Ingredients",
                placeholder="e.g., chicken, rice, onions, garlic",
                label_visibility="collapsed"
            )
            
            submit = st.form_submit_button("Create Recipes")
            
            if submit:
                if ingredients:
                    st.session_state.ingredients = ingredients
                    st.session_state.page = Page.LOADING
                    st.rerun()
                else:
                    st.error("Please enter some ingredients.")

def loading_page():
    """Display the loading page"""
    with st.container():
        st.markdown('<div class="app-header">', unsafe_allow_html=True)
        st.markdown('<div class="app-icon">👨‍🍳</div>', unsafe_allow_html=True)
        with st.spinner("Creating your culinary masterpiece..."):
            result, error = generate_recipes(st.session_state.ingredients)
            if error:
                st.error(error)
                st.session_state.page = Page.INPUT
            else:
                st.session_state.recipes = result
                st.session_state.page = Page.RESULTS
            st.rerun()

def results_page():
    """Display the results page"""
    with st.container():
        # Back button
        if st.button("← Back to Ingredients", key="back_button"):
            st.session_state.page = Page.INPUT
            st.rerun()
        
        # Display greeting
        st.markdown(f'<p class="subtitle">{st.session_state.recipes["greeting"]}</p>', unsafe_allow_html=True)
        
        # Display recipes
        for recipe in st.session_state.recipes['recipes']:
            st.markdown('<div class="recipe-card">', unsafe_allow_html=True)
            
            # Recipe title and description
            st.markdown(f'<h2 class="recipe-title">{recipe["name"]}</h2>', unsafe_allow_html=True)
            st.markdown(f'<p class="recipe-description">{recipe["description"]}</p>', unsafe_allow_html=True)
            
            # Additional ingredients
            if recipe['additional_ingredients']:
                st.markdown('<h3 class="recipe-section-title">Additional Ingredients Needed:</h3>', unsafe_allow_html=True)
                ingredients_list = ''.join([f'<li>{ingredient}</li>' for ingredient in recipe['additional_ingredients']])
                st.markdown(f'<ul class="recipe-list">{ingredients_list}</ul>', unsafe_allow_html=True)
            
            # Instructions
            st.markdown('<h3 class="recipe-section-title">Instructions:</h3>', unsafe_allow_html=True)
            instructions_list = ''.join([f'<li>{instruction}</li>' for instruction in recipe['instructions']])
            st.markdown(f'<ol class="recipe-list">{instructions_list}</ol>', unsafe_allow_html=True)
            
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Display sign-off
        st.markdown(f'<p class="subtitle"><em>{st.session_state.recipes["sign_off"]}</em></p>', unsafe_allow_html=True)

def main():
    # Initialize session state
    if 'page' not in st.session_state:
        st.session_state.page = Page.INPUT
    
    # Verify API key
    if not verify_api_key():
        st.stop()
    
    # Display appropriate page
    if st.session_state.page == Page.INPUT:
        input_page()
    elif st.session_state.page == Page.LOADING:
        loading_page()
    elif st.session_state.page == Page.RESULTS:
        results_page()

if __name__ == "__main__":
    main() 