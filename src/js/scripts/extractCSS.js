function CSStoString(document_root) {

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
    
    //Get list of stylesheets source code
    
    return document_root.styleSheets;
}

chrome.runtime.sendMessage({
    action: "getSourceCSS",
    source: CSStoString(document)
});