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

const OPENBD_API_VERSION = 'v1'; // openBDのAPIバージョン。 https://openbd.jp/

window.addEventListener('load', function () {
  // storageから、選択したテキストを読み込む
  chrome.storage.local.get(['selectedText'], (result) => {
    // result.htmlへの反映処理
    returnBookInfo(result.selectedText);
  });
});

/**
 * result.htmlへの反映処理
 * @param {string} selectedText コンテクストメニューで選択された文字列
 */
function returnBookInfo(selectedText) {
  try {
    // 選択したテキストの整形
    const isbnText = selectedText.replace(/-|,/g, '');
    // ISBN文字列の検証
    const verifyIsbn = isbnText.match(/^(\d{10}|\d{13})$/);
    if (!verifyIsbn) {
      throw new Error(
        '選択した文字列はISBNではないようです。選択範囲をご確認ください。'
      );
    }
    // openBD APIを参照するためのURLを定義
    const openBdUrl = `https://api.openbd.jp/${OPENBD_API_VERSION}/get?isbn=${encodeURIComponent(
      isbnText
    )}`;
    // openBD APIからGETする。
    getOpenBdData(openBdUrl).then((openBdResponse) => {
      const bookInfo = openBdResponse.map((element) => {
        element = element || { summary: {} };
        let bookSummary = {
          isbn: element.summary.isbn || 'NA',
          title: element.summary.title || 'NA',
          volume: element.summary.volume || 'NA',
          series: element.summary.series || 'NA',
          author: element.summary.author || 'NA',
          publisher: element.summary.publisher || 'NA',
          pubdate: element.summary.pubdate || 'NA',
          coverUrl: element.summary.cover || 'NA',
          coverUrlImg: element.summary.cover
            ? `<img src="${element.summary.cover}">`
            : '<p>NA</p>',
          coverUrlAhref: element.summary.cover
            ? `<a href="${element.summary.cover}">${element.summary.cover}</a>`
            : '<p>NA</p>',
          openBDUrl: openBdUrl,
        };
        return bookSummary;
      });
      if (!bookInfo.length) {
        throw new Error('該当する書籍情報がありません。');
      } else if (bookInfo.length > 1) {
        throw new Error(
          '2つ以上の書籍情報が取得されました。選択したISBNを確認してください。'
        );
      }
      const bookInfoObj = bookInfo[0];
      // 書影
      document.getElementById('book-cover').innerHTML = bookInfoObj.coverUrlImg;
      // 書籍の概要
      document.getElementById('book-summary').innerHTML = `<ul>
              <li><strong>ISBN: </strong>${bookInfoObj.isbn}</li>
              <li><strong>書籍名: </strong>${bookInfoObj.title}</li>
              <li><strong>Volume: </strong>${bookInfoObj.volume}</li>
              <li><strong>Series: </strong>${bookInfoObj.series}</li>
              <li><strong>著者: </strong>${bookInfoObj.author}</li>
              <li><strong>出版社: </strong>${bookInfoObj.publisher}</li>
              <li><strong>発行日（yyyy-MM）: </strong>${bookInfoObj.pubdate}</li>
              <li><strong>書影URL: </strong>${bookInfoObj.coverUrlAhref}</li>
              </ul>`;
      // openBDでの登録内容
      document.getElementById('openbd-content').textContent =
        JSON.stringify(openBdResponse);
      // openBDのURL
      const prettyUrl = openBdUrl + '&pretty';
      document.getElementById('openbd-url').innerHTML = openBdUrl
        ? `<a href="${prettyUrl}">${prettyUrl}</a>`
        : '<p>NA</p>';
    });
  } catch (error) {
    let errorMessage = document.createElement('errorMessage');
    errorMessage.textContent = `${error.message} - ${error.stack}`;
    document.getElementById('pre').appendChild(errorMessage);
  }
}

/**
 * Fetch response from the openBD API.
 * @param {String} url The request URL for the openBD API
 * @returns {Object}
 */
async function getOpenBdData(url) {
  const response = await fetch(url, {
    method: 'GET',
  });
  return response.json();
}
