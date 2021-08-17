// Copyright 2021 Taro TSUKAGOSHI
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

// See latest info for this Chrome extension on its GitHub repository: https://github.com/ttsukagoshi/openbd-checker

/* global chrome */

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'openBDChecker',
    title: 'ISBN「%s」でopenBDを検索',
    type: 'normal',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId == 'openBDChecker') {
    openBDChecker(info);
  }
});

function openBDChecker(info) {
  try {
    if (!info.selectionText) {
      throw new Error('ISBNが選択されていません。');
    }
    // 前処理（chrome.storage.local内に残っている情報を削除）
    chrome.storage.local.remove(
      ['selectedText', 'openBdResponse'],
      function () {
        console.info('[openBD Checker] Reset storage values');
      }
    );
    // 選択された文字列をいったんstorageに保存
    chrome.storage.local.set({ selectedText: info.selectionText }, function () {
      console.info(`[openBD Checker] Selected text: ${info.selectionText}`);
    });
    // responseの内容を表示するための result.html を別タブで表示する
    chrome.tabs.create({
      url: chrome.runtime.getURL('result.html'),
      active: true,
    });
  } catch (error) {
    console.error(error);
  }
}
