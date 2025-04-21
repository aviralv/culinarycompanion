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

# Custom CSS with new design system
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    /* Design tokens */
    :root {
        /* Colors */
        --color-background: #F9FAFB;
        --color-white: #FFFFFF;
        --color-text-primary: #111827;
        --color-text-secondary: #6B7280;
        --color-accent: #6366F1;
        --color-accent-hover: #4F46E5;
        --color-accent-active: #4338CA;
        --color-border: #E5E7EB;
        
        /* Typography */
        --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        --font-size-sm: 0.875rem;
        --font-size-base: 1rem;
        --font-size-lg: 1.125rem;
        --font-size-xl: 1.25rem;
        --font-size-2xl: 1.5rem;
        --font-size-3xl: 2.25rem;
        
        /* Spacing */
        --space-2: 0.5rem;
        --space-3: 0.75rem;
        --space-4: 1rem;
        --space-5: 1.25rem;
        --space-6: 1.5rem;
        --space-8: 2rem;
        --space-10: 2.5rem;
        
        /* Shadows */
        --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        --shadow-lg: 0 6px 16px 0 rgb(0 0 0 / 0.05);
        
        /* Border Radius */
        --radius-md: 0.375rem;
        --radius-lg: 0.75rem;
        --radius-xl: 1rem;
    }

    /* Reset Streamlit styles */
    .stApp {
        background-color: var(--color-background);
        font-family: var(--font-family);
    }

    /* Hide Streamlit branding */
    #MainMenu, footer, header {
        visibility: hidden;
    }

    /* Main container */
    .main-container {
        max-width: 600px;
        margin: 0 auto;
        padding: var(--space-8);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* Logo */
    .logo {
        font-size: 4rem;
        width: 96px;
        height: 96px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--space-6);
        color: var(--color-accent);
        transition: transform 0.3s ease;
    }

    .logo:hover {
        transform: translateY(-2px);
    }

    /* Typography */
    .title {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--color-text-primary);
        text-align: center;
        margin-bottom: var(--space-4);
        line-height: 1.2;
    }

    .subtitle {
        font-size: var(--font-size-base);
        color: var(--color-text-secondary);
        text-align: center;
        margin-bottom: var(--space-8);
        line-height: 1.5;
        max-width: 500px;
    }

    /* Input container */
    .input-container {
        width: 100%;
        background: var(--color-white);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        box-shadow: var(--shadow-lg);
        margin-bottom: var(--space-8);
    }

    /* Input label */
    .input-label {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--color-text-primary);
        font-weight: 500;
        margin-bottom: var(--space-4);
    }

    .input-label svg {
        width: 20px;
        height: 20px;
        color: var(--color-text-secondary);
    }

    /* Input field */
    .stTextInput > div {
        width: 100% !important;
    }

    .stTextInput > div > div > input {
        width: 100% !important;
        padding: var(--space-4) var(--space-5) !important;
        border: 1px solid var(--color-border) !important;
        border-radius: var(--radius-md) !important;
        font-size: var(--font-size-base) !important;
        color: var(--color-text-primary) !important;
        background: var(--color-white) !important;
        height: 48px !important;
        transition: all 0.2s ease !important;
    }

    .stTextInput > div > div > input:focus {
        border-color: var(--color-accent) !important;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
    }

    .stTextInput > div > div > input::placeholder {
        color: var(--color-text-secondary) !important;
    }

    /* Button */
    .stButton > button {
        width: 100% !important;
        height: 48px !important;
        background-color: var(--color-accent) !important;
        color: white !important;
        font-weight: 600 !important;
        font-size: var(--font-size-base) !important;
        padding: var(--space-3) var(--space-4) !important;
        border: none !important;
        border-radius: var(--radius-md) !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        margin-top: var(--space-4) !important;
    }

    .stButton > button:hover {
        background-color: var(--color-accent-hover) !important;
        transform: translateY(-1px) !important;
        box-shadow: var(--shadow-md) !important;
    }

    .stButton > button:active {
        background-color: var(--color-accent-active) !important;
        transform: translateY(0) !important;
    }

    /* Responsive design */
    @media (max-width: 640px) {
        .main-container {
            padding: var(--space-4);
        }

        .title {
            font-size: var(--font-size-2xl);
        }

        .input-container {
            padding: var(--space-4);
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
    
    # Logo with animation
    st.markdown(
        '<div class="logo">👨‍🍳</div>',
        unsafe_allow_html=True
    )
    
    # Title and subtitle
    st.markdown(
        '<h1 class="title">Culinary Companion</h1>'
        '<p class="subtitle">'
        'Turn your ingredients into creative meals. Just type what you\'ve got at home!'
        '</p>',
        unsafe_allow_html=True
    )
    
    # Input container
    st.markdown('<div class="input-container">', unsafe_allow_html=True)
    
    # Input label with icon
    st.markdown(
        '<div class="input-label">'
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">'
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />'
        '</svg>'
        'Ingredients:'
        '</div>',
        unsafe_allow_html=True
    )
    
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
    
    st.markdown('</div>', unsafe_allow_html=True)
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