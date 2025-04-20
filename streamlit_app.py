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
    /* Override Streamlit's default button styles */
    .stButton > button {
        background-color: #1E2530;
        color: white;
        height: 46px;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: auto !important;
        min-width: 120px !important;
    }
    .stTextInput > div > div > input {
        background-color: rgba(255, 255, 255, 0.05);
        color: white;
        height: 46px;
    }
    div[data-testid="stImage"] {
        display: flex;
        justify-content: center;
        padding: 1rem 0;
    }
    div[data-testid="stImage"] > img {
        display: block;
        margin: 0 auto;
    }
    /* Fix form layout */
    div[data-testid="stForm"] {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    }
    /* Recipe card styling */
    .recipe-card {
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 1rem;
        height: 100%;
    }
    .recipe-card h3 {
        margin-bottom: 1rem;
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
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Display centered logo
    col1, col2, col3 = st.columns([2, 1, 2])
    with col2:
        st.image("public/68c53fe2-775b-4d15-9b6f-8cc4b7959627.png", width=260)
    
    # Title and subtitle
    st.markdown("<h1 style='text-align: center; color: white;'>Culinary Companion</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; color: #CCCCCC;'>Enter ingredients you have and get recipe ideas!</p>", unsafe_allow_html=True)
    
    # Add some spacing
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Create form with adjusted column ratio
    with st.form(key="ingredient_form"):
        cols = st.columns([7, 2])  # Adjusted ratio to give more space to the button
        
        with cols[0]:
            ingredients = st.text_input(
                "Ingredients",
                placeholder="Enter ingredients (e.g., chicken, rice, vegetables)",
                label_visibility="collapsed"
            )
        
        with cols[1]:
            submit = st.form_submit_button("Create Recipes")
        
        if submit:
            if ingredients:
                st.session_state.ingredients = ingredients
                st.session_state.page = "results"
                st.rerun()
            else:
                st.error("Please enter some ingredients.")

def format_recipe_content(recipe_text):
    """Format recipe text into ingredients and directions"""
    # Split content by sections
    sections = recipe_text.split('\n\n')
    ingredients = []
    directions = []
    current_section = None
    
    for line in recipe_text.split('\n'):
        line = line.strip()
        if not line:
            continue
        if 'ingredient' in line.lower():
            current_section = 'ingredients'
            continue
        if any(word in line.lower() for word in ['direction', 'instruction', 'preparation', 'method']):
            current_section = 'directions'
            continue
        if current_section == 'ingredients' and line.startswith('•'):
            ingredients.append(line[1:].strip())
        elif current_section == 'directions' and (line[0].isdigit() or line.startswith('•')):
            directions.append(line.lstrip('0123456789.•').strip())
    
    return ingredients, directions

def results_page():
    """Display the results page with recipe ideas"""
    # Back button at the top
    if st.button("← Back to Ingredients"):
        st.session_state.page = "input"
        st.rerun()
    
    st.title("Culinary Companion - Recipe Ideas")
    st.subheader(f"Ideas using: {st.session_state.ingredients}")
    
    # Generate recipes with spinner
    with st.spinner("Generating recipe ideas..."):
        recipe_ideas, error = generate_recipe_ideas(st.session_state.ingredients)
    
    if error:
        st.error(error)
    elif recipe_ideas:
        # Create three columns for recipes
        cols = st.columns(3)
        
        # Display up to three recipes
        for idx, recipe in enumerate(recipe_ideas[:3]):
            with cols[idx]:
                # Create a card-like container
                with st.container():
                    st.markdown('<div class="recipe-card">', unsafe_allow_html=True)
                    
                    # Extract recipe title (first line)
                    title = recipe.split('\n')[0].strip()
                    st.markdown(f"### {title}")
                    
                    # Format and display ingredients and directions
                    ingredients, directions = format_recipe_content(recipe)
                    
                    # Display ingredients
                    st.markdown("**Ingredients:**")
                    for ingredient in ingredients:
                        st.markdown(f"• {ingredient}")
                    
                    # Display directions
                    st.markdown("**Directions:**")
                    for i, direction in enumerate(directions, 1):
                        st.markdown(f"{i}. {direction}")
                    
                    st.markdown('</div>', unsafe_allow_html=True)
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