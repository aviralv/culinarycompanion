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
    page_icon="🍳",
    layout="centered"
)

# Custom CSS
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    .main {
        background-color: #F9FAFB;
        padding: 3rem;
    }

    .input-container {
        background-color: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        margin-bottom: 2rem;
    }

    .centered {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    /* Hide Streamlit branding */
    #MainMenu, footer, header {display: none;}

    /* Typography */
    h1 {
        color: #111827;
        font-size: 2.25rem;
        font-weight: 700;
        margin: 1rem 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .subtitle {
        color: #6B7280;
        font-size: 1.125rem;
        margin-bottom: 2rem;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Recipe cards */
    .recipe-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid #E5E7EB;
    }

    .recipe-title {
        color: #111827;
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .recipe-description {
        color: #6B7280;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    .recipe-section-title {
        color: #111827;
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

    /* Button styling */
    .stButton > button {
        width: 100% !important;
        background-color: #6366F1 !important;
        color: white !important;
        padding: 0.75rem 1.5rem !important;
        font-weight: 600 !important;
        border-radius: 0.5rem !important;
        border: none !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
    }

    .stButton > button:hover {
        background-color: #4F46E5 !important;
        transform: translateY(-1px) !important;
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
    # Logo/Icon
    st.markdown('<div class="centered"><h1 style="font-size:96px;">🍳</h1></div>', unsafe_allow_html=True)

    # Title & subtitle
    st.markdown("<h1 style='text-align: center;'>Culinary Companion</h1>", unsafe_allow_html=True)
    st.markdown("<p class='subtitle' style='text-align: center;'>Turn your ingredients into creative meals. Just type what you've got at home!</p>", unsafe_allow_html=True)

    # Input Section
    with st.container():
        st.markdown('<div class="input-container">', unsafe_allow_html=True)
        st.markdown("#### 🔍 Ingredients:")
        
        with st.form(key="recipe_form", clear_on_submit=False):
            ingredients = st.text_input(
                "Enter ingredients separated by commas",
                placeholder="e.g., chicken, rice, onions, garlic",
                label_visibility="collapsed"
            )
            
            submit = st.form_submit_button("🍽️ Create Recipes", use_container_width=True)
            
            if submit:
                if ingredients.strip():
                    st.session_state.ingredients = ingredients
                    st.session_state.page = Page.LOADING
                    st.rerun()
                else:
                    st.warning("Please enter some ingredients first.")
        
        st.markdown('</div>', unsafe_allow_html=True)

def loading_page():
    """Display the loading page"""
    # Logo/Icon
    st.markdown('<div class="centered"><h1 style="font-size:96px;">🍳</h1></div>', unsafe_allow_html=True)
    
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
    # Back button
    if st.button("← Back to Ingredients", key="back_button"):
        st.session_state.page = Page.INPUT
        st.rerun()
    
    # Display greeting
    st.markdown(f'<p class="subtitle" style="text-align: center;">{st.session_state.recipes["greeting"]}</p>', unsafe_allow_html=True)
    
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
    st.markdown(f'<p class="subtitle" style="text-align: center;"><em>{st.session_state.recipes["sign_off"]}</em></p>', unsafe_allow_html=True)

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