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

window.addEventListener('load', function () {
  // openBD APIから取得した取得したデータをchrome.storageから読み込む
  chrome.storage.local.get(['openBdUrl', 'openBdResponse'], function (result) {
    let url = result.openBdUrl || null;
    let response = JSON.parse(result.openBdResponse || '[null]');
    // result.htmlへの反映処理
    returnBookInfo(url, response);
  });
});

/**
 * result.htmlへの反映処理
 * @param {string} openBdUrl 当該書籍に関するopenBDのURL
 * @param {array} openBdResponse 当該書籍に関するopenBD登録情報
 */
function returnBookInfo(openBdUrl, openBdResponse) {
  try {
    let bookInfo = openBdResponse.map((element) => {
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
    let bookInfoObj = bookInfo[0];
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
    document.getElementById('openbd-url').innerHTML = openBdUrl
      ? `<a href="${openBdUrl}">${openBdUrl}</a>`
      : '<p>NA</p>';
  } catch (error) {
    let errorMessage = document.createElement('errorMessage');
    errorMessage.textContent = `${error.message} - ${error.stack}`;
    document.getElementById('pre').appendChild(errorMessage);
  }
}
