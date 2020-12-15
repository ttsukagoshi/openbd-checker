// Copyright 2020 Taro TSUKAGOSHI
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//    http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global chrome */

// Global variable(s)
const OPENBD_API_VERSION = 'v1'; // openBDのAPIバージョン。 https://openbd.jp/

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        "id": "openBDChecker",
        "title": "ISBN「%s」でopenBDを検索",
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
        let verifyIsbn = isbnText.match(/^(\d{10}|\d{13})$/);
        if (!verifyIsbn) {
            throw new Error('選択した文字列はISBNではないようです。選択範囲をご確認ください。');
        }
        // 前処理（chrome.storage.local内に残っている情報を削除）
        chrome.storage.local.remove(['openBdUrl', 'openBdResponse'], function () {
            console.log('Reset: openBdUrl and openBdResponse');
        });
        let url = `https://api.openbd.jp/${OPENBD_API_VERSION}/get?isbn=${encodeURIComponent(isbnText)}`;
        chrome.storage.local.set({ 'openBdUrl': url }, function () {
            console.log(`openBdUrl set to ${url}`);
        });
        // openBD APIからGETする。
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let status = xhr.status;
                if (status >= 200 && status < 400) {
                    chrome.storage.local.set({ 'openBdResponse': xhr.responseText }, function () {
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