import streamlit as st
import requests
import json
import re
import os

# Configure the page with improved metadata - MUST BE FIRST STREAMLIT COMMAND
st.set_page_config(
    page_title="Culinary Companion - Turn Ingredients into Delicious Recipes",
    page_icon="🍳",
    layout="centered",
    initial_sidebar_state="collapsed",
    menu_items={
        'Get Help': 'https://github.com/aviralv/culinarycompanion',
        'Report a bug': 'https://github.com/aviralv/culinarycompanion/issues',
        'About': '''
        # Culinary Companion 🍳
        
        Your AI-powered kitchen assistant that turns available ingredients into delicious recipes.
        
        Simply enter the ingredients you have, and let our witty chef create personalized recipe ideas for you!
        
        Made with ❤️ by Aviral
        '''
    }
)

# Add Open Graph and Twitter Card metadata for better link sharing
st.markdown("""
    <head>
        <title>Culinary Companion - Turn Ingredients into Delicious Recipes</title>
        <meta property="og:title" content="Culinary Companion - Recipe Generator" />
        <meta property="og:description" content="Transform your available ingredients into delicious recipes with our AI-powered kitchen assistant!" />
        <meta property="og:image" content="https://culinarycompanion.streamlit.app/public/68c53fe2-775b-4d15-9b6f-8cc4b7959627.png" />
        <meta property="og:url" content="https://culinarycompanion.streamlit.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Culinary Companion - Recipe Generator" />
        <meta name="twitter:description" content="Transform your available ingredients into delicious recipes with our AI-powered kitchen assistant!" />
        <meta name="twitter:image" content="https://culinarycompanion.streamlit.app/public/68c53fe2-775b-4d15-9b6f-8cc4b7959627.png" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🍳</text></svg>" type="image/svg+xml">
    </head>
""", unsafe_allow_html=True)

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
    /* Base theme-aware styles */
    :root {
        --background-color: #ffffff;
        --secondary-background-color: #f0f2f6;
        --text-color: #31333F;
        --primary-color: #386641;
        --primary-color-hover: #447751;
        --primary-color-active: #2d5234;
    }

    /* Main container */
    .block-container {
        padding-top: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    /* Form layout */
    [data-testid="stForm"] {
        max-width: 800px;
        margin: 2rem auto;
    }

    [data-testid="stForm"] > div:first-child {
        padding: 0;
    }

    /* Input container */
    .input-container {
        background-color: var(--secondary-background-color);
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        margin: 1rem 0;
        border: 1px solid rgba(49, 51, 63, 0.1);
    }

    /* Input field */
    .stTextInput > div > div > input {
        background-color: white !important;
        border: 1px solid rgba(49, 51, 63, 0.2) !important;
        border-radius: 8px !important;
        padding: 0.75rem 1rem !important;
        height: 3.2rem !important;
        font-size: 1.1rem !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
        transition: all 0.2s ease !important;
        width: 100% !important;
    }

    .stTextInput > div > div > input:focus {
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 0 2px rgba(56, 102, 65, 0.1) !important;
    }

    .stTextInput > div > div > input::placeholder {
        color: rgba(49, 51, 63, 0.6) !important;
        font-style: italic !important;
    }

    /* Button */
    .stButton > button {
        height: 3.2rem !important;
        padding: 0.75rem 1.5rem !important;
        background-color: var(--primary-color) !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        font-size: 1.1rem !important;
        font-weight: 600 !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        min-width: 140px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    .stButton > button:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
        background-color: var(--primary-color-hover) !important;
    }

    .stButton > button:active {
        transform: translateY(0) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        background-color: var(--primary-color-active) !important;
    }

    /* Column layout */
    [data-testid="column"] {
        padding: 0 0.75rem !important;
        display: flex !important;
        align-items: center !important;
    }

    [data-testid="column"] > div {
        width: 100% !important;
    }

    /* Remove 'Press Enter to apply' text */
    .stTextInput div div div div {
        display: none !important;
    }

    /* Help text */
    .stTextInput .help-text {
        margin-top: 0.4rem !important;
        font-size: 0.9rem !important;
        color: rgba(49, 51, 63, 0.7) !important;
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .input-container {
            padding: 1.5rem !important;
        }
        
        .stTextInput > div > div > input {
            height: 3rem !important;
            font-size: 1rem !important;
        }
        
        .stButton > button {
            height: 3rem !important;
            font-size: 1rem !important;
            min-width: 120px !important;
        }
    }

    /* Recipe card styling */
    .recipe-container {
        background-color: var(--secondary-background-color);
        border: 1px solid rgba(var(--primary-color-rgb), 0.2);
        border-radius: 8px;
        padding: 20px;
        margin: 10px 0;
        height: 100%;
        transition: all 0.2s ease;
    }
    .recipe-container:hover {
        box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.1);
    }

    /* Recipe text elements */
    .recipe-title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
        color: var(--text-color);
    }
    .recipe-section {
        margin: 15px 0;
        color: var(--text-color);
    }
    .recipe-section-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
        color: var(--text-color);
    }

    /* General text elements */
    .stMarkdown {
        color: var(--text-color);
    }
    p, h1, h2, h3, h4, h5, h6, li {
        color: var(--text-color) !important;
    }

    /* Separator styling */
    hr {
        border-color: rgba(var(--text-color-rgb), 0.1);
    }

    /* Error and warning messages */
    .stAlert {
        background-color: var(--secondary-background-color);
        color: var(--text-color);
    }

    /* Spinner/loader */
    .stSpinner > div {
        border-color: var(--primary-color) !important;
    }

    /* Fix list spacing */
    .stMarkdown ul {
        margin-top: -0.5em;
        margin-bottom: 0.5em;
    }
    
    .stMarkdown li {
        margin: 0.2em 0;
    }
    
    /* Adjust header margins */
    .stMarkdown h4, .stMarkdown h5 {
        margin-bottom: 0.5em;
    }
    
    /* Recipe container spacing */
    .element-container {
        margin-bottom: 0.5em;
    }
    
    /* Make regular text slightly smaller than headers */
    .stMarkdown p {
        font-size: 1em;
        margin: 0.3em 0;
    }

    /* Add padding between columns */
    [data-testid="column"] {
        padding: 0 1rem;
    }
    
    /* Remove 'Press Enter to apply' text */
    .stTextInput div div div div {
        display: none !important;
    }
    
    /* Add border between columns on larger screens */
    @media (min-width: 768px) {
        [data-testid="column"]:first-child {
            border-right: 1px solid rgba(var(--text-color-rgb), 0.1);
            padding-right: 2rem;
        }
        [data-testid="column"]:last-child {
            padding-left: 2rem;
        }
    }
    
    /* Improve help text visibility */
    .stTextInput .help-text {
        color: var(--text-color) !important;
        opacity: 0.7;
    }

    /* Vertically center the input field and help text */
    .stTextInput {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
    }
    
    /* Adjust help text position */
    .stTextInput .help-text {
        margin-top: 0.2rem;
        margin-bottom: 0;
    }
    
    /* Center the form elements vertically */
    [data-testid="stForm"] > div:first-child {
        height: 100%;
        display: flex;
        align-items: center;
    }
    
    /* Ensure consistent height for columns */
    [data-testid="column"] {
        height: 100%;
        display: flex;
        align-items: center;
    }

    /* Reset and base styles */
    div.stApp {
        background-color: #ffffff;
    }

    .main > div:first-child {
        padding-top: 2rem !important;
        padding-bottom: 3rem !important;
    }

    .block-container {
        padding: 0 !important;
        max-width: 1000px !important;
    }

    /* Main container styling */
    .main-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 1rem;
        max-width: 800px;
        margin: 0 auto;
    }

    /* Logo styling */
    .logo-container {
        font-size: 120px;
        line-height: 1;
        margin-bottom: 2rem;
        text-align: center;
    }

    /* Title and subtitle styling */
    .title {
        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;
        color: #1E1E1E;
        margin-bottom: 1rem;
        line-height: 1.2;
    }

    .subtitle {
        font-size: 1.2rem;
        text-align: center;
        color: #666;
        margin-bottom: 2.5rem;
        line-height: 1.5;
        max-width: 600px;
    }

    /* Form styling */
    .search-container {
        background: #f8f9fa;
        border-radius: 20px;
        padding: 2rem;
        width: 100%;
        max-width: 800px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        margin-top: 1rem;
    }

    /* Input field styling */
    .stTextInput > div > div > input {
        font-size: 1.2rem !important;
        padding: 1.5rem !important;
        border-radius: 12px !important;
        border: 2px solid #e0e0e0 !important;
        background-color: white !important;
        height: auto !important;
        min-height: 60px !important;
        transition: all 0.3s ease !important;
    }

    .stTextInput > div > div > input:focus {
        border-color: #386641 !important;
        box-shadow: 0 0 0 4px rgba(56, 102, 65, 0.1) !important;
    }

    .stTextInput > div > div > input::placeholder {
        color: #999 !important;
        font-size: 1.1rem !important;
    }

    /* Button styling */
    .stButton > button {
        width: 100% !important;
        min-height: 60px !important;
        background-color: #386641 !important;
        color: white !important;
        font-size: 1.2rem !important;
        font-weight: 600 !important;
        padding: 1rem 2rem !important;
        border: none !important;
        border-radius: 12px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        text-transform: none !important;
        margin: 0 !important;
    }

    .stButton > button:hover {
        background-color: #447751 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(56, 102, 65, 0.2) !important;
    }

    .stButton > button:active {
        transform: translateY(0) !important;
        box-shadow: 0 2px 6px rgba(56, 102, 65, 0.1) !important;
    }

    /* Form layout adjustments */
    [data-testid="column"] {
        padding: 0.5rem !important;
    }

    /* Hide Streamlit branding */
    #MainMenu, footer, header {
        visibility: hidden;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .title {
            font-size: 2rem;
        }
        
        .subtitle {
            font-size: 1.1rem;
            padding: 0 1rem;
        }
        
        .search-container {
            padding: 1.5rem;
        }
        
        .stTextInput > div > div > input {
            font-size: 1.1rem !important;
            min-height: 54px !important;
        }
        
        .stButton > button {
            min-height: 54px !important;
            font-size: 1.1rem !important;
        }
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

def display_recipe(recipe):
    """Display a single recipe in a card format"""
    with st.container():
        st.markdown(f"#### {recipe['name']}")
        st.write(recipe['description'])
        
        if recipe['additional_ingredients']:
            st.markdown("##### Additional Ingredients Needed:")
            # Create a more compact list with custom HTML/CSS
            ingredients_html = "<div style='margin-top: -1em;'>"
            for ingredient in recipe['additional_ingredients']:
                ingredients_html += f"<div style='margin: 0.2em 0;'>• {ingredient}</div>"
            ingredients_html += "</div>"
            st.markdown(ingredients_html, unsafe_allow_html=True)
        
        st.markdown("##### Instructions:")
        # Create a more compact list for instructions
        instructions_html = "<div style='margin-top: -1em;'>"
        for i, instruction in enumerate(recipe['instructions'], 1):
            instructions_html += f"<div style='margin: 0.2em 0;'>{i}. {instruction}</div>"
        instructions_html += "</div>"
        st.markdown(instructions_html, unsafe_allow_html=True)

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
            "api_key": api_key
        })
        headers = {'Content-Type': 'application/json'}

        response = requests.post(url, headers=headers, data=payload)
        
        # Check if response is successful
        response.raise_for_status()
        
        # Parse JSON response
        try:
            data = response.json()
            if isinstance(data, dict) and 'recipe_output' in data:
                recipe_data = data['recipe_output']
                if isinstance(recipe_data, str):
                    # Try to parse the string as JSON
                    try:
                        return json.loads(recipe_data), None
                    except json.JSONDecodeError:
                        return None, "Invalid JSON format in response"
                elif isinstance(recipe_data, dict):
                    return recipe_data, None
            return None, "Unexpected response structure from API"
            
        except json.JSONDecodeError:
            return None, "Invalid JSON response from API"
            
    except requests.exceptions.RequestException as e:
        return None, f"Request failed: {str(e)}"
    except Exception as e:
        return None, f"An error occurred: {str(e)}"

def input_page():
    """Display the input page for ingredients"""
    # Hide Streamlit's default elements
    hide_streamlit_style = """
        <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            header {visibility: hidden;}
        </style>
    """
    st.markdown(hide_streamlit_style, unsafe_allow_html=True)
    
    # Main container
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    
    # Logo
    st.markdown(
        '<div class="logo-container">🍳</div>',
        unsafe_allow_html=True
    )
    
    # Title and subtitle
    st.markdown(
        '<h1 class="title">Culinary Companion</h1>',
        unsafe_allow_html=True
    )
    st.markdown(
        '<p class="subtitle">'
        'Transform your available ingredients into delicious recipes! '
        'Enter what you have in your kitchen, and I\'ll suggest creative dishes you can make.'
        '</p>',
        unsafe_allow_html=True
    )
    
    # Search form
    with st.form(key="ingredient_form", clear_on_submit=True):
        st.markdown('<div class="search-container">', unsafe_allow_html=True)
        
        # Create columns with custom ratio
        cols = st.columns([7, 3])
        
        with cols[0]:
            ingredients = st.text_input(
                "Ingredients",
                placeholder="e.g., chicken, rice, onions, garlic",
                label_visibility="collapsed"
            )
        
        with cols[1]:
            submit = st.form_submit_button(
                "Create Recipes",
                use_container_width=True
            )
        
        st.markdown('</div>', unsafe_allow_html=True)
        
        if submit:
            if ingredients:
                st.session_state.ingredients = ingredients
                st.session_state.page = "results"
                st.rerun()
            else:
                st.error("Please enter some ingredients.")
    
    st.markdown('</div>', unsafe_allow_html=True)

def loading_page():
    """Display loading state while generating recipes"""
    # Back button at the top
    if st.button("← Back to Ingredients"):
        st.session_state.page = "input"
        st.rerun()
    
    st.title("Ideas")
    st.subheader(f"Ideas using: {st.session_state.ingredients}")
    
    # Center the spinner and add a message
    col1, col2, col3 = st.columns([2, 1, 2])
    with col2:
        st.spinner("Creating your culinary adventure...")

def results_page():
    """Display the results page with recipe ideas"""
    # Back button at the top
    if st.button("← Back to Ingredients"):
        st.session_state.page = "input"
        st.rerun()
    
    st.title("Recipe Ideas")
    st.write(f"Using: {st.session_state.ingredients}")
    
    # Show loading state first
    with st.spinner("Creating your culinary adventure..."):
        result, error = generate_recipe_ideas(st.session_state.ingredients)
    
    if error:
        st.error(error)
        return
        
    if not result:
        st.error("No recipes were generated. Please try again.")
        return
    
    # Display greeting as regular text, not a header
    st.write(result['greeting'])
    
    # Add some spacing
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Create two columns for recipes
    col1, col2 = st.columns(2)
    
    # Display first recipe in first column
    with col1:
        display_recipe(result['recipes'][0])
    
    # Display second recipe in second column
    with col2:
        display_recipe(result['recipes'][1])
    
    # Display sign-off with some spacing
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown(f"<em>{result['sign_off']}</em>", unsafe_allow_html=True)

def main():
    # Initialize session state variables at the very beginning
    if "page" not in st.session_state:
        st.session_state.page = "input"
        st.session_state.ingredients = ""
    
    # Verify environment variables first
    if not verify_env_variables():
        st.stop()
    
    if st.session_state.page == "input":
        input_page()
    elif st.session_state.page == "results":
        results_page()

if __name__ == "__main__":
    main()