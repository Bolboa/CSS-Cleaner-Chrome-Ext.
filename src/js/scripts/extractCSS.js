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
    var originalSource = [];
    for (var i=0; i<sourceCode.classes.length; i++) {
        var attribute = sourceCode.classes[i].className;

        if (typeof attribute === 'string' || attribute instanceof String) {
            attribute = attribute.split(" ");
            for (var j=0; j<attribute.length; j++) {
                //console.log(attribute[j]);
                if(!originalSource.includes(attribute[j])) {
                    originalSource.push(attribute[j]);
                }
            }
               
        }  
    }
    //Get arry of all IDs used in the html of the current tab
    var originalSourceId = [];
    for (var i=0; i<sourceCode.ids.length; i++) {
        var attributeId = sourceCode.ids[i].id;
        if (typeof attributeId === 'string' || attributeId instanceof String) {
            attributeId = attributeId.split(" ");
            for (var j=0; j<attributeId.length; j++) {
                if(!originalSourceId.includes(attributeId[j])) {
                    originalSourceId.push(attributeId[j]);
                }
            }
               
        }
    }
    console.log("class", originalSource);
    console.log("id", originalSourceId);

    //Isolate all CSS identifiers being used in selected stylesheet
    var selectedSource =  [];
    for (var i=0; i<stylesheet.cssRules.length; i++) {
        styleSheetClass = stylesheet.cssRules[i].selectorText;
        selectedSource.push(styleSheetClass);
    }
   
    //Maps all CSS that should be kept in the stylesheet
    var mapping = [];
    for (var i=0; i<selectedSource.length; i++) {
        if (selectedSource[i] != undefined) {
            if(selectedSource[i].startsWith('.')) {
                for(var j=0; j<originalSource.length; j++) {
                    
                    if (selectedSource[i].indexOf(originalSource[j]) !== -1 && originalSource[j]) {
                        console.log("org" + selectedSource[i]);
                        console.log("sans"+originalSource[j]);
                        mapping.push(1);
                        break;
                    }
                }
            }
            else if (selectedSource[i].startsWith('#')) {
                console.log("id");
            }
            else {
                console.log("none");
            }
        }
        
    }
    console.log(mapping);

    
}

//Function to get html source code and divide it into Ids and Classes
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


