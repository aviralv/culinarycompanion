import streamlit as st
import requests
import json
import re
import os

# Configure the page
st.set_page_config(
    page_title="Culinary Companion",
    layout="centered",
    initial_sidebar_state="collapsed",
)

# Verify environment variables
def verify_env_variables():
    api_key = os.getenv('GOOGLE_GENAI_API_KEY')
    if not api_key:
        st.error("⚠️ GOOGLE_GENAI_API_KEY is not set. Please configure it in your environment variables.")
        return False
    elif api_key == "your_api_key_here":
        st.error("⚠️ Please replace the default API key with your actual Gemini API key.")
        return False
    return True

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
        color: inherit;
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
    .recipe-container {
        background-color: var(--background-color);
        border: 1px solid rgba(128, 128, 128, 0.2);
        border-radius: 8px;
        padding: 20px;
        margin: 10px 0;
        height: 100%;
    }
    .recipe-title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
        color: inherit;
    }
    .recipe-section {
        margin: 15px 0;
        color: inherit;
    }
    .recipe-section-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
        color: inherit;
    }
    /* Ensure text is visible in both modes */
    .stMarkdown {
        color: inherit;
    }
    p, h1, h2, h3, h4, h5, h6, li {
        color: inherit !important;
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
        
        # Split by double newlines to separate sections
        sections = [section.strip() for section in clean_output.split('\n\n') if section.strip()]
        
        if sections:
            return sections
        
    return []

def generate_recipe_ideas(ingredients):
    """Call API to generate recipe ideas"""
    try:
        # Verify API key is available
        api_key = os.getenv('GOOGLE_GENAI_API_KEY')
        if not api_key:
            return None, "API key not configured. Please check your environment variables."
            
        url = "https://aviralv.app.n8n.cloud/webhook/4b812275-4ff0-42a6-a897-2c8ad444a1e1"
        payload = json.dumps({
            "ingredients": ingredients,
            "api_key": api_key  # Add API key to payload
        })
        headers = {'Content-Type': 'application/json'}

        response = requests.post(url, headers=headers, data=payload)
        
        # Check if response is successful
        response.raise_for_status()
        
        # Try to decode JSON response
        try:
            data = response.json()
        except json.JSONDecodeError:
            # If JSON decoding fails, try to use the text directly
            text_response = response.text
            if text_response:
                # Split the text response into sections
                sections = [section.strip() for section in text_response.split('\n\n') if section.strip()]
                if sections:
                    return sections, None
            return None, "Invalid response format from API"
            
        # Handle JSON response
        if isinstance(data, dict) and 'recipe_output' in data:
            recipe_text = data['recipe_output']
            if isinstance(recipe_text, str):
                # Split the text into sections
                sections = [section.strip() for section in recipe_text.split('\n\n') if section.strip()]
                if sections:
                    return sections, None
            
        return None, "Unexpected response structure from API"
        
    except requests.exceptions.RequestException as e:
        return None, f"Request failed: {str(e)}"
    except Exception as e:
        return None, f"An error occurred: {str(e)}"

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
    ingredients = []
    directions = []
    current_section = None
    
    # Split the text into lines and process each line
    lines = recipe_text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check for section headers
        lower_line = line.lower()
        if 'description:' in lower_line:
            continue  # Skip description lines
        elif any(word in lower_line for word in ['ingredient', 'you\'ll need', 'you need']):
            current_section = 'ingredients'
            continue
        elif any(word in lower_line for word in ['instruction', 'direction', 'method', 'step']):
            current_section = 'directions'
            continue
            
        # Process content based on current section
        if current_section == 'ingredients':
            # Clean up the ingredient line
            clean_line = line.lstrip('•-*').strip()
            if clean_line and not clean_line.lower().startswith(('ingredient', 'additional')):
                ingredients.append(clean_line)
        elif current_section == 'directions':
            # Clean up the direction line
            clean_line = re.sub(r'^\d+[\.\)]?\s*', '', line).strip()
            if clean_line and not clean_line.lower().startswith(('instruction', 'direction')):
                directions.append(clean_line)
                
    # If sections weren't explicitly marked, try to infer them
    if not ingredients and not directions:
        # Assume first part is ingredients, second part is directions
        split_point = len(lines) // 2
        ingredients = [line.strip() for line in lines[:split_point] if line.strip()]
        directions = [line.strip() for line in lines[split_point:] if line.strip()]
    
    return ingredients, directions

def results_page():
    """Display the results page with recipe ideas"""
    # Back button at the top
    if st.button("← Back to Ingredients"):
        st.session_state.page = "input"
        st.rerun()
    
    st.title("Ideas")
    st.subheader(f"Ideas using: {st.session_state.ingredients}")
    
    # Generate recipes with spinner
    with st.spinner("Generating recipe ideas..."):
        recipe_sections, error = generate_recipe_ideas(st.session_state.ingredients)
    
    if error:
        st.error(error)
    elif recipe_sections and len(recipe_sections) > 0:
        # Add custom CSS for layout
        st.markdown("""
            <style>
            .stHorizontalBlock {
                gap: 1rem;
            }
            .element-container {
                margin: 0 !important;
                padding: 0 !important;
            }
            .recipe-container {
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 20px;
                margin: 10px 0;
                height: 100%;
            }
            .recipe-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 15px;
                color: white;
            }
            .recipe-section {
                margin: 15px 0;
            }
            .recipe-section-title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
                color: white;
            }
            </style>
        """, unsafe_allow_html=True)
        
        # Display introduction (first element)
        if len(recipe_sections) > 0:
            st.markdown(recipe_sections[0])
            st.markdown("---")
        
        # Create columns for recipes
        if len(recipe_sections) > 1:
            cols = st.columns(3)
            
            # Process remaining recipes (up to 3)
            for idx, recipe in enumerate(recipe_sections[1:4]):
                with cols[idx]:
                    # Start recipe container
                    st.markdown('<div class="recipe-container">', unsafe_allow_html=True)
                    
                    # Split recipe into sections
                    recipe_parts = recipe.split('\n')
                    
                    # Title (first non-empty line)
                    title = next((line.strip() for line in recipe_parts if line.strip()), "")
                    if title.startswith(('1.', '2.', '3.')):
                        title = title.split('.', 1)[1].strip()
                    st.markdown(f'<div class="recipe-title">{title}</div>', unsafe_allow_html=True)
                    
                    # Join remaining lines back together
                    content = '\n'.join(recipe_parts[1:])
                    
                    # Split into sections
                    content_sections = content.split('\n\n')
                    
                    for section in content_sections:
                        section = section.strip()
                        if not section:
                            continue
                            
                        if 'Description:' in section:
                            desc = section.split('Description:', 1)[1].strip()
                            st.markdown(f'<div class="recipe-section">{desc}</div>', unsafe_allow_html=True)
                        
                        elif any(keyword in section.lower() for keyword in ['ingredient', 'you\'ll need']):
                            st.markdown('<div class="recipe-section">', unsafe_allow_html=True)
                            st.markdown('<div class="recipe-section-title">Ingredients</div>', unsafe_allow_html=True)
                            lines = [line.strip() for line in section.split('\n')]
                            for line in lines:
                                if line and not any(keyword in line.lower() for keyword in ['ingredient', 'you\'ll need']):
                                    st.markdown(f"• {line.lstrip('•-*')}")
                            st.markdown('</div>', unsafe_allow_html=True)
                        
                        elif any(keyword in section.lower() for keyword in ['direction', 'instruction', 'preparation']):
                            st.markdown('<div class="recipe-section">', unsafe_allow_html=True)
                            st.markdown('<div class="recipe-section-title">Directions</div>', unsafe_allow_html=True)
                            lines = [line.strip() for line in section.split('\n')]
                            step_num = 1
                            for line in lines:
                                if line and not any(keyword in line.lower() for keyword in ['direction', 'instruction', 'preparation']):
                                    st.markdown(f"{step_num}. {line.lstrip('1234567890. ')}")
                                    step_num += 1
                            st.markdown('</div>', unsafe_allow_html=True)
                    
                    # End recipe container
                    st.markdown('</div>', unsafe_allow_html=True)
    else:
        st.warning("No recipe ideas were generated. Try different ingredients!")

def main():
    if "page" not in st.session_state:
        st.session_state.page = "input"
    
    # Verify environment variables first
    if not verify_env_variables():
        st.stop()
    
    if st.session_state.page == "input":
        input_page()
    elif st.session_state.page == "results":
        results_page()

if __name__ == "__main__":
    main()