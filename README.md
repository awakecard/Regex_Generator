# REGEX Generator

This project is influenced by my professional work, where I am always writing regular expression and appear to be using either Regex101 or Grok Debugger.

The goal of the project is to have a clone of Regex101 with some prebuilt regular expressions, so that you can build a regular expression from the different templates making building and debugging regular expressions easy.

## Issues
- original input does not feel fluid, should allow for enter / on change event to trigger the basic
- no match highlighting to show what is matching.
- more patterns required
- grok needs to be added.

## Road Map

1. Regex101 simple clone
    - allow input box which can be manipulated
    - allow a text area where users can place their text
    - highlight matches

2. Auto Escape
    - this is to escape regex sensitive characters which would break the regex

3. Grok Functionality / Translations
    - allow for Grok items to be clicked and applied to the regular expression.
    - allow for custom Grok filters to be added for the translations

4. Clear pass fails into two text boxes so you can see what has passed the regular expression and what has failed the regular expression.
