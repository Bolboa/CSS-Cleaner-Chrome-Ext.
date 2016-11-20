##In Progress--

#CSS-Cleaner-Chrome-Ext.-
Extension to clean any unused CSS from any CSS file being used in the current tab. The extension provides a list of CSS files being used in the current tab and allows the user to select from the list which file they want cleaned. Once selected, an algorithm is injected into the page to get all identifiers from the HTML, and it is subsequently compared to the CSS file selected by the user. Any identifier not referenced in the HTML source code is removed, along with its CSS attributes, and the a new CSS file is downloaded to the browser.

##Technologies
* React-Redux
* Chrome API
