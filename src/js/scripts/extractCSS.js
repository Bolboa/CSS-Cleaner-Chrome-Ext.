
/*----------INITIATE THE CLEANSE--------------*/
function CSStoString(document_root, message) {   
    
    //Get selected CSS from list of CSS stylesheets
    sSheetList = document_root.styleSheets;
    for (var i=0; i<sSheetList.length; i++) {
        if (sSheetList[i].href == message){
            selectedCSS = sSheetList[i];
        }
    }

    //get all classes and ids from html source code
    var html = getSourceHTML(document_root);
    //initiates the cleaning process, gets a boolean value as response
    //which indicates whether CSS is accessible or not
    var bool = cleanCSS(selectedCSS, html);

    return bool;
}


/*-----------ORGANIZING CSS --------------*/
function cleanCSS(stylesheet, sourceCode) {

    //get array of all classes used in the html of the current tab
    var originalSource = [];
    for (var i=0; i<sourceCode.classes.length; i++) {
        var attribute = sourceCode.classes[i].className;
        //splits the object passed into array of classes
        if (typeof attribute === 'string' || attribute instanceof String) {
            attribute = attribute.split(" ");
            for (var j=0; j<attribute.length; j++) {
                if(!originalSource.includes(attribute[j])) {
                    originalSource.push(attribute[j]);
                }
            }     
        }  
    }

    //get array of all IDs used in the html of the current tab
    var originalSourceId = [];
    for (var i=0; i<sourceCode.ids.length; i++) {
        var attributeId = sourceCode.ids[i].id;
        //splits the object passed into array of ids
        if (typeof attributeId === 'string' || attributeId instanceof String) {
            attributeId = attributeId.split(" ");
            for (var j=0; j<attributeId.length; j++) {
                if(!originalSourceId.includes(attributeId[j])) {
                    originalSourceId.push(attributeId[j]);
                }
            }   
        }
    }

    //returns false if CSS cannot be obtained
    if (stylesheet.cssRules == null) {
        return [false, percentage];
    }

    //isolate all CSS identifiers being used in selected stylesheet into an array
    else {
        var selectedSource =  [];
        for (var i=0; i<stylesheet.cssRules.length; i++) {
            styleSheetClass = stylesheet.cssRules[i].selectorText;
            selectedSource.push(styleSheetClass);
        }
        
        //mapping algorithm to determine which styles should remain in stylesheet
        var mapping = mapCSS(selectedSource, originalSource, originalSourceId);
        //the mapped attributes are places in a large string
        var CSSData = stringMappedCSS(stylesheet, mapping);
        //the string of CSS that should not be removed
        var newCSS = CSSData[0];
        //var CSSData also returns the percentage of CSS removed from stylesheet
        var percentage = CSSData[1];
        //CSS file is saved to the browser using the same name as original
        var fileName = stylesheet.href.substring(stylesheet.href.lastIndexOf("/") + 1);
        var data = newCSS;
        //save to the browser
        saveData(data, fileName);

    }

    return [true, percentage];   
}



/*------------------GET STRING OF MAPPED CSS-------------*/
function stringMappedCSS(stylesheet, mapping) {

    var newCSS = '';
    var oldCSS = '';
    var mappingArray = mapping[0];
    var htmlSource = mapping[1];
    var htmlsourceId = mapping[2];
    var before = mappingArray.length;
    var after = 0;
    for (var i=0; i<stylesheet.cssRules.length; i++) {
        oldCSS += stylesheet.cssRules[i].cssText;
        if (mappingArray[i] == 1) {
            newCSS += stylesheet.cssRules[i].cssText;
            after += 1;
        }
        else if (mappingArray[i] == 2) {
            cleanMediaQuery(stylesheet.cssRules[i].cssText, htmlSource, htmlsourceId);
        }
    }
   
    //Calculate how much CSS was removed
    var percentage = 100 - ((after/before)*100);
    percentage = Math.round(percentage*100)/100;
    
    return [newCSS, percentage];
    

}

/*-------------RETURN CLEAN VERSION OF MEDIA QUERY---------------------*/
function cleanMediaQuery(mediaQuery, htmlsource, htmlsourceId) {
    //the begining of the media query
    var media_start = mediaQuery.match(/@media(.*?){/);
    //this will be the content of the media query
    var media_content = '';

    if (mediaQuery != null && media_start != null) {
        var trim_media = mediaQuery.replace(/(\r\n|\n|\r)/gm,"");
        var media_start = media_start[0];
        
        var identifiers = mediaQuery.match(/\.(.*?)}/g);
        var id_identifiers = mediaQuery.match(/\#(.*?)}/g);
        if (identifiers != null && media_start != null) {
            for (var i=0; i<identifiers.length; i++) {

                var class_identifier = identifiers[i].match(/\.(.*){/);

                if (class_identifier != null) {
                    class_identifier = class_identifier[1].trim();
                    class_identifier = "." + class_identifier;
                    for (var j=0; j<htmlsource.length; j++) {
                        if (class_identifier.indexOf(htmlsource[j]) !== -1 && htmlsource[j]) {
                            media_content += " ";
                            media_content += identifiers[i];
                            //console.log(identifiers[i]);
                            break;
                          
                        }
                      
                    }
                }
               
            }
        }
        if (id_identifiers != null && media_start != null) {
            for (var i=0; i<id_identifiers.length; i++) {
                var id_identifier = id_identifiers[i].match(/\#(.*){/);
                if (id_identifier != null) {
                    id_identifier = id_identifier[1].trim();
                    id_identifier = "#" + id_identifier;
                    //console.log(id_identifier);
                    for (var j=0; j<htmlsourceId.length; j++) {
                        if (id_identifier.indexOf(htmlsourceId[j]) !== -1 && htmlsourceId[j]) {
                            media_content += " ";
                            media_content += id_identifier[i];

                            break;
                          
                        }
                    }
                }
            }
        
        }
        if (media_content) {
            media_start += media_content;
            media_start += '}';
            console.log(media_start);

        }
            

        
        
    }

}


/*-------------SAVE CSS FILE TO BROWSER-------------*/
var saveData = (function () {
    //create a hidden anchor tag
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        //the href of the tag will be the new file
        var blob = new Blob([data], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        //simulate a click
        a.click();
        //download to browser
        window.URL.revokeObjectURL(url);
    };
}());




/*---------------------MAP ALL CSS THAT SHOULD BE KEPT IN STYLESHEET------------------*/
function mapCSS(selectedSource, originalSource, originalSourceId) {

    var mapping = [];
    //loop through selected stylesheet
    for (var i=0; i<selectedSource.length; i++) {
        //value of check will determine whether the style is being used in original html source code
        var check = false;
        if (selectedSource[i] != undefined) {
            //if CSS identifier is a class
            if(selectedSource[i].startsWith('.')) {
                //check if class is being used in the array of classes existing in the html source code
                for(var j=0; j<originalSource.length; j++) {
                    //if it does exist
                    if (selectedSource[i].indexOf(originalSource[j]) !== -1 && originalSource[j]) {
                        check = true;
                        break;
                    }   
                }
            }

            //if css identifier is an ID
            else if (selectedSource[i].startsWith('#')) {
                //check if ID is being used in the array of IDs existing in the html source code
                for(var j=0; j<originalSourceId.length; j++) {
                    //if it does exist
                    if (selectedSource[i].indexOf(originalSourceId[j]) !== -1 && originalSourceId[j]) {
                        check = true;
                        break;
                    }
                }
            }

            //if css identifier is not a class nor ID, keep it in the stylesheet,
            //to determine whether an element is being used or not is much too difficult to
            //discern, even impossible given the approach of this algorithm
            else {
                check = true;
            }

            //if the identifier is being used, 1 (true) is pushed to the mapping array
            if (check == true) {
                mapping.push(1);
            }

            //if the identifier is not being used, 0 (false) is pushed to the mapping array
            else if (check == false) {
                mapping.push(0);
            }
        }

        //if it is a media query or a keyframe, 2 is pushed,
        //a different function will clean these
        else {
            mapping.push(2);
        }
    }

    return [mapping, originalSource, originalSourceId];
}





/*--------------GET HTML SOURCE AND DIVIDE INTO IDS AND CLASSES------------*/
function getSourceHTML(document_root) {
    var classes = [],
        elIds = [],
        //get all elements in the html source code
        all = document_root.getElementsByTagName("*");

    //loop through elements
    for (var i=0, max=all.length; i < max; i++) {
        //if element has a class, push class name to classes array
        if (all[i].className) {
            classes.push(all[i]);
        }
        //if element has an ID, push ID name to elIds array
        if (all[i].id) {
            elIds.push(all[i]);
        }
    }

    return {classes:classes, ids:elIds}
}




chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    //on message received, inject script and return the result back to the extension
    chrome.runtime.sendMessage({
        action: "getSourceCSS",
        source: CSStoString(document, message)
    });
});


