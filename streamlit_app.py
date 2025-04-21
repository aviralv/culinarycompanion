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
    page_title="Recipe Generator",
    page_icon="🍳",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Custom CSS
st.markdown("""
    <style>
    /* Base theme colors */
    :root {
        --primary-color: #386641;
        --primary-hover: #447751;
        --primary-active: #2d5234;
        --text-color: #1E1E1E;
        --text-secondary: #666666;
        --background-light: #ffffff;
        --border-color: #e0e0e0;
    }

    /* Reset Streamlit styles */
    .stApp {
        background-color: var(--background-light);
    }

    .main > div:first-child {
        padding: 1rem !important;
    }

    .block-container {
        padding: 0 !important;
        max-width: 1000px !important;
    }

    /* Hide Streamlit branding */
    #MainMenu, footer, header {
        visibility: hidden;
    }

    /* Main container */
    .main-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 800px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    /* Logo */
    .logo {
        font-size: 120px;
        line-height: 1;
        text-align: center;
        margin-bottom: 2rem;
    }

    /* Typography */
    .title {
        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;
        color: var(--text-color);
        margin-bottom: 1rem;
        line-height: 1.2;
    }

    .subtitle {
        font-size: 1.2rem;
        text-align: center;
        color: var(--text-secondary);
        margin-bottom: 2rem;
        line-height: 1.5;
        max-width: 600px;
    }

    /* Form */
    .search-form {
        width: 100%;
        max-width: 800px;
        background: white;
        border-radius: 16px;
        padding: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    /* Input field */
    .stTextInput > div {
        padding: 0 !important;
    }

    .stTextInput > div > div > input {
        font-size: 1.2rem !important;
        padding: 0.8rem 1.2rem !important;
        border-radius: 12px !important;
        border: 2px solid var(--border-color) !important;
        height: 56px !important;
        transition: all 0.3s ease !important;
        margin: 0 !important;
    }

    .stTextInput > div > div > input:focus {
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 0 4px rgba(56, 102, 65, 0.1) !important;
    }

    /* Button */
    .stButton {
        margin: 0 !important;
    }

    .stButton > button {
        width: 100% !important;
        height: 56px !important;
        background-color: var(--primary-color) !important;
        color: white !important;
        font-size: 1.2rem !important;
        font-weight: 600 !important;
        padding: 0.8rem 1.5rem !important;
        border: none !important;
        border-radius: 12px !important;
        transition: all 0.3s ease !important;
        margin: 0 !important;
        line-height: 1.2 !important;
    }

    .stButton > button:hover {
        background-color: var(--primary-hover) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(56, 102, 65, 0.2) !important;
    }

    .stButton > button:active {
        background-color: var(--primary-active) !important;
        transform: translateY(0) !important;
        box-shadow: 0 2px 6px rgba(56, 102, 65, 0.1) !important;
    }

    /* Loading animation */
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
    }

    .loading-text {
        font-size: 1.5rem;
        color: var(--text-color);
        margin-top: 2rem;
        text-align: center;
    }

    /* Recipe cards */
    .recipe-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        margin: 1rem 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
    }

    .recipe-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 1rem;
    }

    .recipe-description {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    .recipe-section-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 1.5rem 0 0.5rem 0;
    }

    .recipe-list {
        margin: 0;
        padding-left: 1.5rem;
    }

    .recipe-list li {
        margin: 0.5rem 0;
        color: var(--text-secondary);
    }

    /* Back button */
    .back-button {
        margin-bottom: 2rem !important;
    }

    .back-button button {
        background-color: transparent !important;
        color: var(--text-color) !important;
        border: 1px solid var(--border-color) !important;
        font-size: 1rem !important;
        height: 40px !important;
    }

    .back-button button:hover {
        background-color: rgba(0, 0, 0, 0.05) !important;
        transform: none !important;
        box-shadow: none !important;
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .title {
            font-size: 2rem;
        }
        
        .subtitle {
            font-size: 1.1rem;
        }
        
        .stTextInput > div > div > input,
        .stButton > button {
            height: 50px !important;
            font-size: 1.1rem !important;
        }
        
        .recipe-card {
            padding: 1.5rem;
        }
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
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    
    # Logo
    st.markdown('<div class="logo">🍳</div>', unsafe_allow_html=True)
    
    # Title and subtitle
    st.markdown(
        '<h1 class="title">Recipe Generator</h1>'
        '<p class="subtitle">'
        'Transform your available ingredients into delicious recipes! '
        'Enter what you have in your kitchen, and I\'ll suggest creative dishes you can make.'
        '</p>',
        unsafe_allow_html=True
    )
    
    # Search form
    with st.form(key="recipe_form"):
        st.markdown('<div class="search-form">', unsafe_allow_html=True)
        
        cols = st.columns([7, 3])
        with cols[0]:
            ingredients = st.text_input(
                "Ingredients",
                placeholder="e.g., chicken, rice, onions, garlic",
                label_visibility="collapsed"
            )
        
        with cols[1]:
            submit = st.form_submit_button("Create Recipes")
        
        st.markdown('</div>', unsafe_allow_html=True)
        
        if submit:
            if ingredients:
                st.session_state.ingredients = ingredients
                st.session_state.page = Page.LOADING
                st.rerun()
            else:
                st.error("Please enter some ingredients.")
    
    st.markdown('</div>', unsafe_allow_html=True)

def loading_page():
    """Display the loading page"""
    st.markdown('<div class="main-container loading-container">', unsafe_allow_html=True)
    st.markdown('<div class="logo">👨‍🍳</div>', unsafe_allow_html=True)
    with st.spinner("Creating your culinary masterpiece..."):
        result, error = generate_recipes(st.session_state.ingredients)
        if error:
            st.error(error)
            st.session_state.page = Page.INPUT
        else:
            st.session_state.recipes = result
            st.session_state.page = Page.RESULTS
        st.rerun()
    st.markdown('</div>', unsafe_allow_html=True)

def results_page():
    """Display the results page"""
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    
    # Back button
    if st.button("← Back to Ingredients", key="back_button"):
        st.session_state.page = Page.INPUT
        st.rerun()
    
    # Display greeting
    st.write(st.session_state.recipes['greeting'])
    
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
    st.markdown(f'<p><em>{st.session_state.recipes["sign_off"]}</em></p>', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)

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