// Global variable(s)
const OPENBD_API_VERSION = 'v1'; // openBDのAPIバージョン。 https://openbd.jp/

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        "id": "openBDChecker",
        "title": "openBDを検索する（ISBN）",
        "type": "normal",
        "contexts": [
            "selection",
            "editable"
        ]
    });
});

chrome.contextMenus.onClicked.addListener(function (info) {
    if (info.menuItemId == "openBDChecker") {
        openBDCheckerAlert(info);
    }
});

function openBDCheckerAlert(info) {
    if (!info.selectionText) {
        alert('ISBNコードが選択されていません。');
    }
    var isbnText = info.selectionText.replace(/\-/g, '');
    var baseUrl = `https://api.openbd.jp/${OPENBD_API_VERSION}/get`;
    var url = baseUrl + `?isbn=${encodeURIComponent(isbnText)}`;
    chrome.tabs.create({
        'url': url,
        'active': true
    });
}