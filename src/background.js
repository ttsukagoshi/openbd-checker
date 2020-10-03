// Global variable(s)
const OPENBD_API_VERSION = 'v1'; // openBDのAPIバージョン。 https://openbd.jp/

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        "id": "openBDChecker",
        "title": "openBDを検索する（ISBN）",
        "type": "normal",
        "contexts": [
            "selection"
        ]
    });
});

chrome.contextMenus.onClicked.addListener(function (info) {
    if (info.menuItemId == "openBDChecker") {
        openBDCheckerAlert(info);
    }
});

function openBDCheckerAlert(info) {
    console.log(info);
    try {
        if (!info.selectionText) {
            throw new Error('ISBNが選択されていません。');
        }
        let isbnText = info.selectionText.replace(/\-/g, '');
        /*
        verify isbnText
        */
        let url = `https://api.openbd.jp/${OPENBD_API_VERSION}/get?isbn=${encodeURIComponent(isbnText)}`;
        chrome.storage.local.set({'openBdUrl': url}, function() {
            console.log(`openBD URL set to ${url}`);
        });
        chrome.tabs.create({
            'url': chrome.runtime.getURL('result.html'),
            'active': true
        });
    } catch (error) {
        let message = `${error.message}\n\n▼詳細\n${error.stack}`;
        alert(message);
    }
}