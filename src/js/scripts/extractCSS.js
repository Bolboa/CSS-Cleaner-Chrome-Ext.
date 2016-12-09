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
    var percentage = 0;
    if (stylesheet.cssRules == null) {
        return [false, percentage];
    }
    else {
        var selectedSource =  [];
        for (var i=0; i<stylesheet.cssRules.length; i++) {
            styleSheetClass = stylesheet.cssRules[i].selectorText;
            selectedSource.push(styleSheetClass);
        }
       
        var mapping = mapCSS(selectedSource, originalSource, originalSourceId);
        
        var CSSData = stringMappedCSS(stylesheet, mapping);
        var newCSS = CSSData[0];
        percentage = CSSData[1];
        var fileName = stylesheet.href.substring(stylesheet.href.lastIndexOf("/") + 1);
        var data = newCSS;
        saveData(data, fileName);

    }

    return [true, percentage];   
}



/*------------------GET STRING OF MAPPED CSS-------------*/

function stringMappedCSS(stylesheet, mapping) {

    var newCSS = '';
    var oldCSS = '';

    var before = mapping.length;
    var after = 0;
    for (var i=0; i<stylesheet.cssRules.length; i++) {
        oldCSS += stylesheet.cssRules[i].cssText;
        if (mapping[i] == 1) {
            newCSS += stylesheet.cssRules[i].cssText;
            after += 1;
        }
        else if (mapping[i] == 2) {
            cleanMediaQuery(stylesheet.cssRules[i].cssText);
        }
    }
   
    //Calculate how much CSS was removed
    var percentage = 100 - ((after/before)*100);
    percentage = Math.round(percentage*100)/100;
    
    return [newCSS, percentage];
    

}

/*-------------RETURN CLEAN VERSION OF MEDIA QUERY---------------------*/

function cleanMediaQuery(mediaQuery) {
    var trim_media = mediaQuery.replace(/(\r\n|\n|\r)/gm,"");
    //console.log(trim_media);
    var identifiers = mediaQuery.match(/\.(.*)}/g);
    console.log(identifiers);

}


/*-------------SAVE CSS FILE TO BROWSER-------------*/

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




/*---------------------MAP ALL CSS THAT SHOULD BE KEPT IN STYLESHEE------------------*/

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
            mapping.push(2);
        }
    }
    return mapping;
}





/*--------------GET HTML SOURCE AND DIVIDE INTO IDS AND CLASSES------------*/

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


