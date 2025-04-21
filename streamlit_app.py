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
    /* Design tokens */
    :root {
        /* Colors */
        --primary-color: #386641;
        --primary-hover: #447751;
        --primary-active: #2d5234;
        --text-color: #1E1E1E;
        --text-secondary: #666666;
        --background-light: #ffffff;
        --border-color: #e0e0e0;
        --error-color: #dc3545;
        --success-color: #28a745;
        
        /* Typography */
        --font-size-xs: 0.875rem;
        --font-size-sm: 1rem;
        --font-size-md: 1.125rem;
        --font-size-lg: 1.25rem;
        --font-size-xl: 1.5rem;
        --font-size-2xl: 2rem;
        --font-size-3xl: 2.5rem;
        
        /* Font weights */
        --font-weight-normal: 400;
        --font-weight-medium: 500;
        --font-weight-semibold: 600;
        --font-weight-bold: 700;
        
        /* Spacing */
        --space-xs: 0.25rem;
        --space-sm: 0.5rem;
        --space-md: 1rem;
        --space-lg: 1.5rem;
        --space-xl: 2rem;
        --space-2xl: 3rem;
        
        /* Border radius */
        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 16px;
        
        /* Shadows */
        --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
        --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
        
        /* Transitions */
        --transition-fast: 150ms ease;
        --transition-normal: 300ms ease;
        --transition-slow: 500ms ease;
        
        /* Breakpoints */
        --breakpoint-sm: 640px;
        --breakpoint-md: 768px;
        --breakpoint-lg: 1024px;
        --breakpoint-xl: 1280px;
    }

    /* Reset Streamlit styles */
    .stApp {
        background-color: var(--background-light);
    }

    .main > div:first-child {
        padding: var(--space-md) !important;
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
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: var(--space-xl) var(--space-md);
        min-height: 100vh;
    }

    /* Logo */
    .logo {
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto var(--space-xl);
    }

    .logo img {
        width: 100%;
        height: auto;
    }

    /* Typography */
    .title {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        text-align: center;
        color: var(--text-color);
        margin-bottom: var(--space-md);
        line-height: 1.2;
        width: 100%;
    }

    .subtitle {
        font-size: var(--font-size-lg);
        text-align: center;
        color: var(--text-secondary);
        margin-bottom: var(--space-2xl);
        line-height: 1.5;
        max-width: 600px;
        width: 100%;
    }

    /* Form */
    .search-form {
        width: 100%;
        max-width: 800px;
        background: var(--background-light);
        border-radius: var(--radius-lg);
        padding: var(--space-lg);
        box-shadow: var(--shadow-sm);
        transition: var(--transition-normal);
        margin: 0 auto;
    }

    .search-form:hover {
        box-shadow: var(--shadow-md);
    }

    /* Form layout */
    .form-row {
        display: flex;
        gap: var(--space-md);
        width: 100%;
    }

    .input-column {
        flex: 1;
    }

    .button-column {
        width: 160px;
    }

    /* Input field */
    .stTextInput {
        width: 100%;
    }

    .stTextInput > div {
        width: 100%;
        padding: 0 !important;
    }

    .stTextInput > div > div {
        width: 100%;
    }

    .stTextInput > div > div > input {
        width: 100% !important;
        font-size: var(--font-size-lg) !important;
        padding: var(--space-md) var(--space-lg) !important;
        border-radius: var(--radius-md) !important;
        border: 2px solid var(--border-color) !important;
        height: 56px !important;
        transition: var(--transition-normal) !important;
        margin: 0 !important;
        background-color: var(--background-light) !important;
    }

    .stTextInput > div > div > input:focus {
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 0 4px rgba(56, 102, 65, 0.1) !important;
    }

    /* Button */
    .stButton {
        width: 100%;
        margin: 0 !important;
    }

    .stButton > button {
        width: 100% !important;
        height: 56px !important;
        background-color: var(--primary-color) !important;
        color: white !important;
        font-size: var(--font-size-lg) !important;
        font-weight: var(--font-weight-semibold) !important;
        padding: var(--space-md) !important;
        border: none !important;
        border-radius: var(--radius-md) !important;
        transition: var(--transition-normal) !important;
        margin: 0 !important;
        line-height: 1.2 !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        overflow: hidden !important;
    }

    .stButton > button:hover {
        background-color: var(--primary-hover) !important;
        transform: translateY(-2px) !important;
        box-shadow: var(--shadow-md) !important;
    }

    .stButton > button:active {
        background-color: var(--primary-active) !important;
        transform: translateY(0) !important;
        box-shadow: var(--shadow-sm) !important;
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
        font-size: var(--font-size-xl);
        color: var(--text-color);
        margin-top: var(--space-xl);
        text-align: center;
    }

    /* Recipe cards */
    .recipe-card {
        background: var(--background-light);
        border-radius: var(--radius-lg);
        padding: var(--space-xl);
        margin: var(--space-md) 0;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border-color);
        transition: var(--transition-normal);
    }

    .recipe-card:hover {
        box-shadow: var(--shadow-md);
    }

    .recipe-title {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        color: var(--text-color);
        margin-bottom: var(--space-md);
    }

    .recipe-description {
        color: var(--text-secondary);
        margin-bottom: var(--space-lg);
        line-height: 1.6;
    }

    .recipe-section-title {
        font-size: var(--font-size-md);
        font-weight: var(--font-weight-semibold);
        color: var(--text-color);
        margin: var(--space-lg) 0 var(--space-sm) 0;
    }

    .recipe-list {
        margin: 0;
        padding-left: var(--space-lg);
    }

    .recipe-list li {
        margin: var(--space-sm) 0;
        color: var(--text-secondary);
    }

    /* Back button */
    .back-button {
        margin-bottom: var(--space-xl) !important;
    }

    .back-button button {
        background-color: transparent !important;
        color: var(--text-color) !important;
        border: 1px solid var(--border-color) !important;
        font-size: var(--font-size-sm) !important;
        height: 40px !important;
        transition: var(--transition-normal) !important;
    }

    .back-button button:hover {
        background-color: rgba(0, 0, 0, 0.05) !important;
        transform: none !important;
        box-shadow: none !important;
    }

    /* Error messages */
    .stAlert {
        background-color: var(--background-light) !important;
        border-radius: var(--radius-md) !important;
        border: 1px solid var(--error-color) !important;
        color: var(--error-color) !important;
        padding: var(--space-md) var(--space-lg) !important;
        margin: var(--space-md) 0 !important;
    }

    /* Responsive design */
    @media (max-width: var(--breakpoint-sm)) {
        .title {
            font-size: var(--font-size-2xl);
        }
        
        .subtitle {
            font-size: var(--font-size-md);
        }
        
        .recipe-card {
            padding: var(--space-md);
        }
    }

    @media (max-width: var(--breakpoint-md)) {
        .stTextInput > div > div > input,
        .stButton > button {
            height: 50px !important;
            font-size: var(--font-size-md) !important;
        }
    }

    @media (min-width: var(--breakpoint-lg)) {
        .main-container {
            padding: 0 var(--space-xl);
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
    st.markdown(
        '<div class="logo">'
        '<img src="https://raw.githubusercontent.com/aviralv/culinarycompanion/master/assets/logo.png" '
        'alt="Recipe Generator Logo" onerror="this.onerror=null; this.innerHTML=\'🍳\'">'
        '</div>',
        unsafe_allow_html=True
    )
    
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
        st.markdown('<div class="form-row">', unsafe_allow_html=True)
        
        cols = st.columns([7, 3])
        with cols[0]:
            st.markdown('<div class="input-column">', unsafe_allow_html=True)
            ingredients = st.text_input(
                "Ingredients",
                placeholder="e.g., chicken, rice, onions, garlic",
                label_visibility="collapsed"
            )
            st.markdown('</div>', unsafe_allow_html=True)
        
        with cols[1]:
            st.markdown('<div class="button-column">', unsafe_allow_html=True)
            submit = st.form_submit_button("Create Recipes")
            st.markdown('</div>', unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)
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