import streamlit as st
import requests
import json
import re

# Configure the page
st.set_page_config(
    page_title="Culinary Companion",
    layout="centered",
    initial_sidebar_state="collapsed",
)

# Custom CSS
st.markdown("""
    <style>
    .stApp {
        background-color: #1E1E1E;
    }
    .block-container {
        padding-top: 2rem;
        max-width: 700px;
    }
    .stButton > button {
        background-color: #1E2530;
        color: white;
        height: 46px;
        white-space: nowrap;
    }
    .stTextInput > div > div > input {
        background-color: rgba(255, 255, 255, 0.05);
        color: white;
        height: 46px;
    }
    [data-testid="stImage"] {
        display: flex;
        justify-content: center;
    }
    [data-testid="stImage"] > img {
        width: 27px !important;
        margin: 0 auto;
    }
    </style>
""", unsafe_allow_html=True)

def remove_html_tags(text):
    """Remove html tags from a string"""
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

def format_recipe_ideas(recipe_output):
    """Format recipe output into a list of clean recipe ideas"""
    if isinstance(recipe_output, str):
        # Clean any HTML tags first
        clean_output = remove_html_tags(recipe_output)
        
        # Split by numbered items but preserve the numbers
        recipe_ideas = []
        parts = re.split(r'(?=\n\s*\d+[\.\)]\s*)', clean_output)
        
        for part in parts:
            if part.strip():
                recipe_ideas.append(part.strip())
        
        return recipe_ideas
    return []

def generate_recipe_ideas(ingredients):
    """Call API to generate recipe ideas"""
    try:
        url = "https://aviralv.app.n8n.cloud/webhook/4b812275-4ff0-42a6-a897-2c8ad444a1e1"
        payload = json.dumps({"ingredients": ingredients})
        headers = {'Content-Type': 'application/json'}

        response = requests.post(url, headers=headers, data=payload)

        if response.status_code == 200:
            data = response.json()
            if 'recipe_output' in data:
                return format_recipe_ideas(data['recipe_output']), None
            else:
                return None, "Unexpected response structure from the API."
        else:
            return None, f"HTTP error! status: {response.status_code}"
    except requests.exceptions.RequestException as e:
        return None, f"Request failed: {e}"
    except json.JSONDecodeError as e:
        return None, f"Failed to decode JSON response: {e}"

def input_page():
    """Display the input page for ingredients"""
    # Add some spacing
    st.markdown("<br><br>", unsafe_allow_html=True)
    
    # Display centered logo with much smaller size
    st.image("public/68c53fe2-775b-4d15-9b6f-8cc4b7959627.png", width=35)
    
    # Title and subtitle
    st.markdown("<h1 style='text-align: center; color: white;'>Culinary Companion</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; color: #CCCCCC;'>Enter ingredients you have and get recipe ideas!</p>", unsafe_allow_html=True)
    
    # Add some spacing
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Create form
    with st.form(key="ingredient_form"):
        col1, col2 = st.columns([4, 1])
        
        with col1:
            ingredients = st.text_input(
                "Ingredients",
                placeholder="Enter ingredients (e.g., chicken, rice, vegetables)",
                label_visibility="collapsed"
            )
        
        with col2:
            submit = st.form_submit_button("Create Recipes")
        
        if submit:
            if ingredients:
                st.session_state.ingredients = ingredients
                st.session_state.page = "results"
                st.rerun()
            else:
                st.error("Please enter some ingredients.")

def results_page():
    """Display the results page with recipe ideas"""
    st.title("Culinary Companion - Recipe Ideas")
    
    if st.button("← Back to Ingredients"):
        st.session_state.page = "input"
        st.rerun()
    
    with st.spinner("Generating recipe ideas..."):
        recipe_ideas, error = generate_recipe_ideas(st.session_state.ingredients)
    
    st.subheader(f"Ideas using: {st.session_state.ingredients}")
    
    if error:
        st.error(error)
    elif recipe_ideas:
        for idea in recipe_ideas:
            with st.container():
                cleaned_idea = re.sub(r'\n\s*\n', '\n', idea)
                cleaned_idea = re.sub(r'\n\s*•', '\n\n•', cleaned_idea)
                cleaned_idea = re.sub(r'(\d+[\.\)])\s*', r'\1 ', cleaned_idea)
                st.markdown(cleaned_idea)
                st.divider()
    else:
        st.warning("No recipe ideas were generated. Try different ingredients!")

def main():
    if "page" not in st.session_state:
        st.session_state.page = "input"
    
    if st.session_state.page == "input":
        input_page()
    elif st.session_state.page == "results":
        results_page()

if __name__ == "__main__":
    main()