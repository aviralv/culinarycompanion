import streamlit as st
import requests
import json
import re

# Configure the page to be responsive and dark themed
st.set_page_config(
    page_title="Culinary Companion",
    layout="centered",
    initial_sidebar_state="collapsed",
    page_icon="🍳"
)

# Custom CSS to improve the visual appearance
st.markdown("""
    <style>
    .stApp {
        background-color: #1E1E1E;
    }
    .main {
        max-width: 1200px;
        padding: 2rem;
    }
    .stButton button {
        background-color: #FF4B4B;
        color: white;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        border: none;
    }
    .stTextInput input {
        background-color: #2E2E2E;
        color: white;
        border: 1px solid #3E3E3E;
        border-radius: 4px;
    }
    div[data-testid="stImage"] {
        display: flex;
        justify-content: center;
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
        # Use positive lookbehind to keep the numbers in the split result
        parts = re.split(r'(?=\n\s*\d+[\.\)]\s*)', clean_output)
        
        for part in parts:
            if part.strip():
                # Remove any leading/trailing whitespace while preserving internal formatting
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
    # Add vertical spacing at the top
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Center and display the icon
    col1, col2, col3 = st.columns([1, 1, 1])
    with col2:
        st.image("public/68c53fe2-775b-4d15-9b6f-8cc4b7959627.png", width=150)
    
    # Add title with custom styling
    st.markdown("<h1 style='text-align: center; color: white; margin-bottom: 2rem;'>Culinary Companion</h1>", unsafe_allow_html=True)
    
    # Add subtitle with custom styling
    st.markdown("<p style='text-align: center; color: #CCCCCC; margin-bottom: 2rem;'>Enter ingredients you have and get recipe ideas!</p>", unsafe_allow_html=True)
    
    # Create form with horizontal layout for input and button
    with st.form(key="ingredient_form"):
        cols = st.columns([6, 2])  # Adjust ratio for input and button
        
        with cols[0]:
            ingredients = st.text_input(
                "Ingredients",
                placeholder="Enter ingredients (e.g., chicken, rice, vegetables)",
                key="ingredients_input",
                label_visibility="collapsed"
            )
        
        with cols[1]:
            submit_button = st.form_submit_button(
                label="Create Recipes",
                use_container_width=True,
            )
        
        if submit_button and ingredients:
            st.session_state.ingredients = ingredients
            st.session_state.page = "results"
            st.rerun()
        elif submit_button and not ingredients:
            st.error("Please enter some ingredients.")

def results_page():
    """Display the results page with recipe ideas"""
    st.title("Culinary Companion - Recipe Ideas")
    
    # Display back button
    if st.button("← Back to Ingredients"):
        st.session_state.page = "input"
        st.rerun()
    
    # Display a spinner while processing
    with st.spinner("Generating recipe ideas..."):
        # Generate recipe ideas based on ingredients
        recipe_ideas, error = generate_recipe_ideas(st.session_state.ingredients)
    
    # Display ingredients used
    st.subheader(f"Ideas using: {st.session_state.ingredients}")
    
    # Display recipe ideas or error
    if error:
        st.error(error)
    elif recipe_ideas:
        for idea in recipe_ideas:
            with st.container():
                # Remove any extra newlines while preserving formatting
                cleaned_idea = re.sub(r'\n\s*\n', '\n', idea)
                # Ensure proper spacing for bullet points
                cleaned_idea = re.sub(r'\n\s*•', '\n\n•', cleaned_idea)
                # Ensure proper spacing for numbered items
                cleaned_idea = re.sub(r'(\d+[\.\)])\s*', r'\1 ', cleaned_idea)
                
                st.markdown(cleaned_idea)
                st.divider()
    else:
        st.warning("No recipe ideas were generated. Try different ingredients!")

def main():
    # Initialize session state
    if "page" not in st.session_state:
        st.session_state.page = "input"
    
    # Display appropriate page based on session state
    if st.session_state.page == "input":
        input_page()
    elif st.session_state.page == "results":
        results_page()

if __name__ == "__main__":
    main()