import streamlit as st
import requests
import json
import re

def remove_html_tags(text):
    """Remove html tags from a string"""
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

def main():
    st.set_page_config(
        page_title="Culinary Companion",
        page_icon="public/culinary-companion-logo.png",
    )

    st.title("Culinary Companion")
    st.image("public/culinary-companion-logo.png", width=300)
    ingredients = st.text_input("Enter ingredients (e.g., chicken, rice, vegetables)", key="ingredients_input")

    if st.button("Generate Ideas") or ingredients:
        if not ingredients:
            st.error("Please enter some ingredients.")
        else:
            try:
                url = "https://aviralv.app.n8n.cloud/webhook/4b812275-4ff0-42a6-a897-2c8ad444a1e1"
                payload = json.dumps({"ingredients": ingredients})
                headers = {'Content-Type': 'application/json'}

                response = requests.post(url, headers=headers, data=payload)

                if response.status_code == 200:
                    data = response.json()
                    if 'recipe_output' in data:
                        recipe_output = data['recipe_output']
                        if isinstance(recipe_output, str):
                            recipe_ideas = re.split(r'\n\d+\.\s*', recipe_output)
                            recipe_ideas = [idea.strip() for idea in recipe_ideas if idea.strip()]

                            if recipe_ideas:
                                st.subheader("Recipe Ideas:")
                                for idea in recipe_ideas:
                                    clean_idea = remove_html_tags(idea)
                                    st.markdown(clean_idea)
                            else:
                                st.warning("No recipe ideas found in the response.")
                        else:
                            st.error("Unexpected response format: recipe_output is not a string.")
                    else:
                        st.error("Unexpected response structure from the API.")
                else:
                    st.error(f"HTTP error! status: {response.status_code}")
            except requests.exceptions.RequestException as e:
                st.error(f"Request failed: {e}")
            except json.JSONDecodeError as e:
                st.error(f"Failed to decode JSON response: {e}")

if __name__ == "__main__":
    main()
