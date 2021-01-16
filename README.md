# openBD情報チェッカー（Google Chrome拡張機能）
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/jmbcpombnleepfponcjibgeohkfcocgg) [![GitHub Super-Linter](https://github.com/ttsukagoshi/chrome-ext_openBD-checker/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter) [![Total alerts](https://img.shields.io/lgtm/alerts/g/ttsukagoshi/chrome-ext_openBD-checker.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ttsukagoshi/chrome-ext_openBD-checker/alerts/)  
ウェブブラウザ（Chrome）内で選択したISBNコードに基づいて、コンテクストメニュー（右クリックメニュー）から[openBD](https://openbd.jp/)に登録されている情報を参照できるようにする拡張機能。

<blockquote>
openBD is a project based in Japan to make cover images and book data openly available to anyone who loves books. This extension uses its API to refer to the data. Please note that the API, and consequently this extension, is available only in the Japanese language.
</blockquote>

![右クリックメニューで表示されたこの拡張機能のスクリーンショット](https://ttsukagoshi.github.io/scriptable-assets/assets/images/openBD-checker/screenshot_openBD_1.jpg)

## インストール
[Chromeウェブストア「openBD情報チェッカー」](https://chrome.google.com/webstore/detail/openbd%E6%83%85%E5%A0%B1%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC/jmbcpombnleepfponcjibgeohkfcocgg?hl=ja)からインストール（Chromeユーザ限定）

## 使い方
ブラウザ上でISBNを選択し、右クリック→「openBDを検索する（ISBN）」を選択すると、新しいタブで当該書籍のopenBD上での情報が表示される。
- ハイフン（-）が入ったISBN文字列でも検索可能。
- 旧ISBN（ISBN-10）でも検索可能（openBD APIの仕様）

![openBDの情報が表示された新しいタブのスクリーンショット例](https://ttsukagoshi.github.io/scriptable-assets/assets/images/openBD-checker/screenshot_openBD_2.jpg) 

## 利用規約
この拡張機能を利用するためには、[利用規約](https://ttsukagoshi.github.io/scriptable-assets/terms-and-conditions/) 及び[openBD API利用規約](https://openbd.jp/terms/)に同意する必要があります。

## アイコンについて
Icon made by [Freepik](https://www.flaticon.com/authors/freepik) from [www.flaticon.com](https://www.flaticon.com/)
