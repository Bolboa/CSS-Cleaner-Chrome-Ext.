##In Progress--

#CSS-Cleaner-Chrome-Ext.-
Extension to clean any unused CSS from any CSS file being used in the current tab. The extension provides a list of CSS files being used in the current tab and allows the user to select from the list which file they want cleaned. Once selected, an algorithm is injected into the page to get all identifiers from the HTML, and it is subsequently compared to the CSS file selected by the user. Any identifier not referenced in the HTML source code is removed, along with its CSS attributes, and a new CSS file is downloaded to the browser.

##How To Use
* When the Chrome Extension is launched, code will be injected into the DOM to retrieve all stylesheets being used. The user must then select the stylesheet he wishes to clean. When the clean button is pressed, the Chrome App will compare the CSS to the DOM and remove most of the unnecessary CSS from the stylesheet.  
![Alt text](/gifs/step2.gif)

* Next, a cleaned version of the selected CSS file is downloaded to the browser bearing the same name as the original. The user may use this new file.  
![Alt text](/gifs/step3.gif)

* Some stylsheets might be unattainable. This has to do largely with CORS issues. You may need to set some proper headers in order for the Chrome Extension to have access to them.
![Alt text](/gifs/step4.gif)

##Technologies
* React-Redux
* Chrome API
