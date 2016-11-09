
function DOMtoString(document_root) {
    var html = [],
        all = document_root.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        if (all[i].className) {
            html.push(all[i]);
        }
    }
    console.log(html);
    return html;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});