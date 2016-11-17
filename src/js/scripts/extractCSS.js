function CSStoString(document_root, message) {
    
    //Get selected CSS from list of CSS stylesheets
    sSheetList = document_root.styleSheets;
    for (var i=0; i<sSheetList.length; i++) {
        if (sSheetList[i].href == message){
            selectedCSS = sSheetList[i];
        }
    }
    console.log(message);
    var html = getSourceHTML(document_root);
    console.log(html);
    //console.log(selectedCSS);
    cleanCSS(selectedCSS, html);
    return selectedCSS;
}

function cleanCSS(stylesheet, sourceCode) {
    console.log(stylesheet.cssRules.length);

    for (var i=0; i<sourceCode.classes.length; i++) {
            var attribute = sourceCode.classes[i].className;
            if (typeof attribute === 'string' || attribute instanceof String) {
                attribute = attribute.split(" ");
                console.log(attribute);
               for (var i=0; i<stylesheet.cssRules.length; i++) {
                    styleSheetClass = stylesheet.cssRules[i].selectorText;
                    //console.log(stylesheet.cssRules[i]);
                }
            }
            
        }

    
}

//get html source code and divided it into Ids and Classes
function getSourceHTML(document_root) {
    var classes = [],
        elIds = [],
        all = document_root.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        if (all[i].className) {
            classes.push(all[i]);
        }
        if (all[i].id) {
            elIds.push(all[i]);
        }

    }
    return {classes:classes, ids:elIds}
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    chrome.runtime.sendMessage({
        action: "getSourceCSS",
        source: CSStoString(document, message)
    });
});


