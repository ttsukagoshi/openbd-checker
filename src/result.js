window.addEventListener('load', function () {
    // openBD APIから取得した取得したデータをchrome.storageから読み込む
    chrome.storage.local.get(['openBdUrl', 'openBdResponse'], function (result) {
        let url = result.openBdUrl;
        let response = JSON.parse(result.openBdResponse);
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
        let bookInfo = openBdResponse.map(element => {
            element = element || { 'summary': {} };
            let bookSummary = {
                'isbn': element.summary.isbn || 'NA',
                'title': element.summary.title || 'NA',
                'volume': element.summary.volume || 'NA',
                'series': element.summary.series || 'NA',
                'author': element.summary.author || 'NA',
                'publisher': element.summary.publisher || 'NA',
                'pubdate': element.summary.pubdate || 'NA',
                'coverUrl': element.summary.cover || 'NA',
                'coverUrlImg': (element.summary.cover ? `<img src="${element.summary.cover}">` : '<p>NA</p>'),
                'coverUrlAhref': (element.summary.cover ? `<a href="${element.summary.cover}">${element.summary.cover}</a>` : '<p>NA</p>'),
                'openBDUrl': openBdUrl
            };
            return bookSummary;
        });
        if (!bookInfo.length) {
            throw new Error('該当する書籍情報がありません。');
        } else if (bookInfo.length > 1) {
            throw new Error('2つ以上の書籍情報が取得されました。選択したISBNを確認してください。');
        }
        bookInfoObj = bookInfo[0];
        // 書影
        document.getElementById('bookCover').innerHTML = bookInfoObj.coverUrlImg;
        // 書籍の概要
        document.getElementById('bookSummary').innerHTML =
            `<ul>
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
        document.getElementById('openBdContent').textContent = JSON.stringify(openBdResponse);
        // openBDのURL
        document.getElementById('openBdUrl').innerHTML = `<a href="${openBdUrl}">${openBdUrl}</a>`;
        // 後処理（chrome.storage内の情報を削除）
        chrome.storage.local.remove(['openBdUrl', 'openBdResponse'], function () {
            console.log('Reset: openBdUrl and openBdResponse');
        })
    } catch (error) {
        let errorMessage = document.createElement('errorMessage');
        errorMessage.textContent = `${error.message} - ${error.stack}`;
        document.getElementById('pre').appendChild(errorMessage);
    }
}