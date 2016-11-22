function CSStoString(document_root, message) {
    
    //Get selected CSS from list of CSS stylesheets
    sSheetList = document_root.styleSheets;
    for (var i=0; i<sSheetList.length; i++) {
        if (sSheetList[i].href == message){
            selectedCSS = sSheetList[i];
        }
    }
    var html = getSourceHTML(document_root);
    var bool = cleanCSS(selectedCSS, html);
    return bool;
}

function cleanCSS(stylesheet, sourceCode) {
    //Get arry of all classes used in the html of the current tab
    var originalSource = [];
    for (var i=0; i<sourceCode.classes.length; i++) {
        var attribute = sourceCode.classes[i].className;

        if (typeof attribute === 'string' || attribute instanceof String) {
            attribute = attribute.split(" ");
            for (var j=0; j<attribute.length; j++) {
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

    //Isolate all CSS identifiers being used in selected stylesheet
    
    if (stylesheet.cssRules == null) {
        return false;
    }
    else {
        var selectedSource =  [];
        for (var i=0; i<stylesheet.cssRules.length; i++) {
            styleSheetClass = stylesheet.cssRules[i].selectorText;
            selectedSource.push(styleSheetClass);
        }
       
        var mapping = mapCSS(selectedSource, originalSource, originalSourceId);
        
        var newCSS = stringMappedCSS(stylesheet, mapping);

        var fileName = stylesheet.href.substring(stylesheet.href.lastIndexOf("/") + 1);
        var data = newCSS;
        saveData(data, fileName);

    }

    return true;
    


    
}

//Function to get string of CSS that is mapped
function stringMappedCSS(stylesheet, mapping) {
    var newCSS = '';
    for (var i=0; i<stylesheet.cssRules.length; i++) {
        if (mapping[i] == 1) {
            newCSS += stylesheet.cssRules[i].cssText;
        }
    }
    return newCSS;
    

}

//Function to save cleaned CSS file to browser
var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var blob = new Blob([data], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());



//Function to map all CSS that should be kept in the stylesheet
function mapCSS(selectedSource, originalSource, originalSourceId) {
    var mapping = [];
    for (var i=0; i<selectedSource.length; i++) {
        var check = false;
        if (selectedSource[i] != undefined) {
            if(selectedSource[i].startsWith('.')) {
                for(var j=0; j<originalSource.length; j++) {
                    if (selectedSource[i].indexOf(originalSource[j]) !== -1 && originalSource[j]) {
                        check = true;
                        break;
                    }
                    
                }
              
            }
            else if (selectedSource[i].startsWith('#')) {
                for(var j=0; j<originalSourceId.length; j++) {
                    
                    if (selectedSource[i].indexOf(originalSourceId[j]) !== -1 && originalSourceId[j]) {
                        check = true;
                        break;
                    }
                    
                }
               
            }
            else {
                check = true;
            }
            if (check == true) {
                mapping.push(1);
            }
            else if (check == false) {
                mapping.push(0);
            }
        }
        else {
            mapping.push(1);
        }
    }
    return mapping;
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
    chrome.runtime.sendMessage({
        action: "getSourceCSS",
        source: CSStoString(document, message)
    });
});


