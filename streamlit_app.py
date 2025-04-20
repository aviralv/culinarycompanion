import streamlit as st
import requests
import json
import re

# Configure the page to be responsive
st.set_page_config(
    page_title="Culinary Companion",
    layout="wide",
    initial_sidebar_state="collapsed"
)

def remove_html_tags(text):
    """Remove html tags from a string"""
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

def format_recipe_ideas(recipe_output):
    """Format recipe output into a list of clean recipe ideas"""
    if isinstance(recipe_output, str):
        # Clean any HTML tags first
        clean_output = remove_html_tags(recipe_output)
        
        # Split the string into a list of recipe ideas based on numbering
        # Look for patterns like "1." or "1)" at the beginning of a line
        recipe_ideas = re.split(r'\n\s*\d+[\.\)]\s*', clean_output)
        
        # Remove any empty strings from the list and clean up each idea
        return [idea.strip() for idea in recipe_ideas if idea.strip()]
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
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.title("Culinary Companion")
        st.write("Enter ingredients you have and get recipe ideas!")
        
        # Create form to handle Enter key press
        with st.form(key="ingredient_form"):
            ingredients = st.text_input(
                "Enter ingredients (e.g., chicken, rice, vegetables)",
                key="ingredients_input"
            )
            
            submit_button = st.form_submit_button(label="Generate Ideas")
            
            if submit_button and ingredients:
                # Store ingredients in session state and switch to results page
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
        for i, idea in enumerate(recipe_ideas, 1):
            with st.container():
                # Check if the idea starts with a title-like format
                if re.match(r'^The |^Classic |^Simple |^Basic |^Easy ', idea):
                    # If it has a title format, use it as the header
                    st.markdown(f"### {i}. {idea.split('\n')[0]}")
                    
                    # The rest becomes the description with proper formatting
                    description_lines = idea.split('\n')[1:]
                    if description_lines:
                        description = '\n'.join(description_lines)
                        # Replace **text** with actual bold formatting
                        description = re.sub(r'\*\*(.*?)\*\*', r'**\1**', description)
                        st.markdown(description)
                else:
                    # Just display as a regular markdown
                    formatted_idea = re.sub(r'\*\*(.*?)\*\*', r'**\1**', idea)
                    st.markdown(f"### {i}. {formatted_idea}")
                
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