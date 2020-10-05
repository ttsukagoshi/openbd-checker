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
        openBDChecker(info);
    }
});

function openBDChecker(info) {
    try {
        if (!info.selectionText) {
            throw new Error('ISBNが選択されていません。');
        }
        let isbnText = info.selectionText.replace(/\-|\,/g, '');
        /*
        verify isbnText
        */
        let url = `https://api.openbd.jp/${OPENBD_API_VERSION}/get?isbn=${encodeURIComponent(isbnText)}`;
        chrome.storage.local.set({ 'openBdUrl': url }, function () {
            console.log(`openBdUrl set to ${url}`);
        });
        // openBD APIからGETする。
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let status = xhr.status;
                if (status >= 200 && status < 400) {
                    chrome.storage.local.set({ 'openBdResponse': xhr.responseText }, function() {
                        console.log(`openBdResponse set to ${xhr.responseText}`);
                    });
                } else {
                    throw new Error('Open BD APIからのGETエラー');
                }
            }
        };
        xhr.send();
        // responseの内容を表示するための result.html を別タブで表示する
        chrome.tabs.create({
            'url': chrome.runtime.getURL('result.html'),
            'active': true
        });
    } catch (error) {
        let message = `${error.message}\n\n▼詳細\n${error.stack}`;
        alert(message);
    }
}