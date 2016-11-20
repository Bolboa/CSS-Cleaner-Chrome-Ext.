function CSStoString(document_root, message) {
    
    //Get selected CSS from list of CSS stylesheets
   sSheetList = document_root.styleSheets;
    for (var i=0; i<sSheetList.length; i++) {
        if (sSheetList[i].href == message){
            selectedCSS = sSheetList[i];
        }
    }
    var html = getSourceHTML(document_root);
    cleanCSS(selectedCSS, html);
    return selectedCSS;
}

function cleanCSS(stylesheet, sourceCode) {

    //Get arry of all classes used in the html of the current tab
    var orginalSource = [];
    for (var i=0; i<sourceCode.classes.length; i++) {
        var attribute = sourceCode.classes[i].className;

        if (typeof attribute === 'string' || attribute instanceof String) {
            attribute = attribute.split(" ");
            for (var j=0; j<attribute.length; j++) {
                //console.log(attribute[j]);
                if(!orginalSource.includes(attribute[j])) {
                    orginalSource.push(attribute[j]);
                }
            }
               
        }  
    }
    //Get arry of all IDs used in the html of the current tab
    var orginalSourceId = [];
    for (var i=0; i<sourceCode.ids.length; i++) {
        var attributeId = sourceCode.ids[i].id;
        if (typeof attributeId === 'string' || attributeId instanceof String) {
            attributeId = attributeId.split(" ");
            for (var j=0; j<attributeId.length; j++) {
                if(!orginalSourceId.includes(attributeId[j])) {
                    orginalSourceId.push(attributeId[j]);
                }
            }
               
        }
    }
    console.log("class", orginalSource);
    console.log("id", orginalSourceId);

    var selectedSource =  [];
    for (var i=0; i<stylesheet.cssRules.length; i++) {
        styleSheetClass = stylesheet.cssRules[i].selectorText;
        selectedSource.push(styleSheetClass);
    }
    console.log(selectedSource);

    
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
    console.log(message);
    chrome.runtime.sendMessage({
        action: "getSourceCSS",
        source: CSStoString(document, message)
    });
});


