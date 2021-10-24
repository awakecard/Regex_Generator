# REGEX Generator

This project is infulenced by my professuional work, where I am always writing regualar expression and appear to be using either Regex101 or Grok Debugger.

The goal of the project is to have a clone of Regex101 with some prebuilt regular expressions, so that you can build a regualar expression from the diffrent templates making building and debugging regular expressions easy.

## Issues
- original input does not feel fluid, should allow for enter / onchange event to trigger the basic
- no match highlighting to show what is matching.
- more patterns required
- grok needs to be added.

## Road Map

1. Regex101 simple clone
    - allow input box which can be maipluated
    - allow a text area where users can place their text
    - highlight matches

2. Auto Escape
    - this is to escape regex sensitive charactors which would break the regex

3. Grok Functionallity / Transaltions
    - allow for Grok items to be clicked and applied to the regular expression.
    - allow for custom Grok filters to be added for the transaltions

4. Clear pass fails into two text boxes so you can see what has passed the regualar expression and what has failed the regular expression.