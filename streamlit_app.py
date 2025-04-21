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

# App Config
st.set_page_config(
    page_title="Culinary Companion",
    page_icon="🍳",
    layout="centered",
)

# Custom CSS for visual polish
st.markdown("""
    <style>
        .main {
            padding: 2rem 1rem;
            background-color: #FAFAFA;
        }
        .block-container {
            padding-top: 1rem !important;
            padding-bottom: 0rem !important;
            max-width: 48rem !important;
        }
        h1 {
            font-size: 3rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 0.5rem;
            color: #111827;
        }
        .subtitle {
            font-size: 1.1rem;
            color: #6B7280;
            text-align: center;
            margin-bottom: 2rem;
        }
        .stTextInput>div>div>input {
            padding: 0.75rem;
            font-size: 1rem;
            border-radius: 0.75rem;
            border: 1px solid #E5E7EB;
            background-color: #F9FAFB;
        }
        .stButton>button {
            padding: 0.75rem;
            border-radius: 0.75rem;
            font-size: 1rem;
            font-weight: 600;
            background-color: #10B981 !important;
            color: white;
            border: none;
        }
        .stButton>button:hover {
            background-color: #059669 !important;
        }
        
        /* Recipe cards */
        .recipe-card {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .recipe-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #111827;
        }
        .recipe-description {
            color: #6B7280;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        .recipe-section-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: #111827;
        }
        .recipe-list {
            margin-left: 1.5rem;
            margin-bottom: 1.5rem;
            color: #374151;
        }
        .recipe-list li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
        }

        /* Custom form layout */
        .custom-form {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
        }
        .custom-form .input-container {
            flex: 1;
        }
        .custom-form .button-container {
            width: auto;
        }
        
        /* Hide Streamlit branding */
        #MainMenu, footer, header {display: none;}

        /* Remove box shadow from containers */
        .stApp {
            background-color: #FAFAFA !important;
        }
        div[data-testid="stForm"] {
            border: none;
            padding: 0;
            border-radius: 0;
            background-color: transparent;
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
    # Icon at top
    st.markdown('<div style="text-align: center;"><span style="font-size: 4rem;">🔍</span></div>', unsafe_allow_html=True)

    # Title & subtitle
    st.markdown("<h1>Culinary Companion</h1>", unsafe_allow_html=True)
    st.markdown("<p class='subtitle'>Turn your ingredients into creative meals. Just type what you've got at home!</p>", unsafe_allow_html=True)

    # Input Section with horizontal layout
    with st.form(key="recipe_form", clear_on_submit=False):
        col1, col2 = st.columns([0.7, 0.3])
        
        with col1:
            ingredients = st.text_input(
                "Ingredients",
                placeholder="e.g., chicken, rice, onions, garlic",
                label_visibility="collapsed"
            )
        
        with col2:
            submit = st.form_submit_button("🍽️ Create Recipes")
        
        if submit:
            if ingredients.strip():
                st.session_state.ingredients = ingredients
                st.session_state.page = Page.LOADING
                st.rerun()
            else:
                st.warning("Please enter some ingredients first.")

def loading_page():
    """Display the loading page"""
    # Icon at top
    st.markdown('<div style="text-align: center;"><span style="font-size: 4rem;">🔍</span></div>', unsafe_allow_html=True)
    
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