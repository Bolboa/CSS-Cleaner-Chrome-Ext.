

/*------------RETURNS ALL STYLESHEETS IN USE ON THE PAGE---------*/
function listOfCSS(document_root) {

    //Get list of stylesheets being used on page
    var stylesheet = document_root.styleSheets[(document_root.styleSheets.length - 1)];
    var styleList = [];
    
    //gets the array of stylesheets
    for( var i in document_root.styleSheets ){
        stylesheet = document_root.styleSheets[i];
        styleList.push(stylesheet.href);
    }

    var CSS = {styles:styleList};
    return CSS;
}

//return the list of stylesheets to the chrome extension
chrome.runtime.sendMessage({
    action: "getSource",
    source: listOfCSS(document)
});