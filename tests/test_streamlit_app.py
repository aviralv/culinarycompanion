import pytest
from streamlit.testing.v1 import AppTest
import sys
import os

# Add the parent directory to the Python path so we can import the main app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import streamlit_app

def test_app_initialization():
    """Test basic app initialization and title rendering"""
    at = AppTest.from_file("streamlit_app.py")
    at.run()
    
    # Check if the app title is present
    assert "Culinary Companion" in at.get_page_markdown()
    
    # Check if the input form exists
    assert at.get_text_input(key="ingredient_form").label == "Ingredients"

def test_empty_input_validation():
    """Test that empty input shows an error message"""
    at = AppTest.from_file("streamlit_app.py")
    at.run()
    
    # Submit form with empty input
    form = at.get_form(key="ingredient_form")
    form.run_submit()
    
    # Check if error message is shown
    assert "Please enter some ingredients" in at.get_page_markdown()

def test_input_placeholder():
    """Test that input field has correct placeholder text"""
    at = AppTest.from_file("streamlit_app.py")
    at.run()
    
    input_widget = at.get_text_input(key="ingredient_form")
    assert "e.g., chicken, rice, onions, garlic" in input_widget.placeholder

def test_css_styles():
    """Test that required CSS styles are present"""
    at = AppTest.from_file("streamlit_app.py")
    at.run()
    
    page_html = at.get_page_html()
    
    # Check for essential style elements
    assert ".input-container" in page_html
    assert ".stButton > button" in page_html
    assert ".stTextInput > div > div > input" in page_html
    
    # Check for specific style properties
    assert "border-radius: 16px" in page_html
    assert "background-color: #386641" in page_html  # Button color
    assert "box-shadow" in page_html 