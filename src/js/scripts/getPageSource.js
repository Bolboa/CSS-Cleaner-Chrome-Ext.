
function DOMtoString(document_root) {

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
    
    //Get list of stylesheets being used on page
    var stylesheet = document_root.styleSheets[(document_root.styleSheets.length - 1)];
    var styleList = [];
    
    for( var i in document_root.styleSheets ){
        stylesheet = document_root.styleSheets[i];
        styleList.push(stylesheet.href);
        
    }

    var html = {styles:styleList};

    return html;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});