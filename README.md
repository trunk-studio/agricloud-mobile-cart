# AgriCloud Mobile Shopping Cart

## 需求

* iojs-v2.5.0

## 資料夾說明

* assets-nativeDroid2 新佈景的程式碼
* assets-legacy 保留舊的程式碼

## 開始之前

```
npm install
```

## 如何執行

```
node server.js
```

## 如何使用 bower 安裝前端套件

先切換到 `assets-nativeDroid2` 資料夾

預設安裝路徑定義在 `.bowerrc`

Search:

```
bower search jquery
```

Install:

```
bower install jquery-twzipcode
```

## 以下暫時無用

``demo`` 資料夾是展示用的靜態網站。

使用方式：

```
npm install -g http-server
```

```
http-server demo -p 3001 --cors
```
