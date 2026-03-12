---
name: review
description: Firefox WebExtension のセキュリティ・ベストプラクティスレビュー。コードの安全性やMozillaガイドライン準拠を確認したいときに使う。
tools:
  - Read
  - Grep
  - Glob
  - Bash
model: sonnet
---

以下のFirefox拡張機能のコードをレビューしてください。
Mozilla Extension Workshop および MDN のベストプラクティスに基づき、下記の観点でチェックしてください。
各指摘にはファイルパスと行番号を含め、重要度（高/中/低/情報）を付けてください。

## 1. セキュリティ

### 1-1. リモートコード実行の排除

- `eval()`, `new Function()`, `setTimeout(string)` を使用していないか
- 外部CDNやリモートURLからスクリプトを読み込んでいないか
- manifest.json の `content_security_policy` をデフォルトから変更していないか

### 1-2. フィンガープリンティング防止

- Content Script が DOM にインジェクトする要素に `moz-extension://` パスが含まれていないか
  - CSS: `url(moz-extension://...)` の参照がないか
  - img, iframe 等の src に `moz-extension://` が設定されていないか
  - `web_accessible_resources` に不必要なリソースが含まれていないか
- 代わりにインラインスタイル or `<style>` 要素でスタイリングしているか

### 1-3. ページスクリプトとの分離

- `wrappedJSObject` を使用していないか
- `window.eval()` をContent Scriptから呼び出していないか
- `page` の world ではなく Content Script の isolated world 内で完結しているか
- ページ側の DOM イベントハンドラやプロトタイプを上書きしていないか

### 1-4. 入力値の検証

- `browser.storage` から読み出した設定値（ブラックリストパターン等）をそのままDOMに挿入していないか
- `innerHTML` の代わりに `textContent`, `createElement`, `setAttribute` を使用しているか
- ユーザー入力（検索クエリ、コマンド入力等）が正規表現に渡される場合、適切にエスケープしているか

## 2. パーミッション

### 2-1. 最小権限の原則

- manifest.json の `permissions` に実際に使用しているパーミッションのみが記載されているか
- 以下のうち未使用のものが含まれていないか確認:
  - `tabs` — タブのURL/title取得に必要（タブ検索機能で使用）
  - `storage` — 設定・ブラックリストの永続化に必要
  - `sessions` — 閉じたタブの復元に必要
  - `clipboardWrite` — URLコピー/ヤンクに必要
- `<all_urls>` や `activeTab` の使い分けは適切か

### 2-2. optional_permissions の活用

- `clipboardWrite` など、コア機能以外で必要なパーミッションは `optional_permissions` に移せないか
- `browser.permissions.request()` でランタイムに要求する形にできるか

### 2-3. host_permissions

- Content Script の `matches` パターンは適切か（`<all_urls>` は意図的か）
- ブラックリスト機能でマッチを制限する場合でも、manifest 側では全URLマッチが必要な点を理解しているか

## 3. manifest.json

### 3-1. Manifest V3 準拠

- `manifest_version: 3` が指定されているか
- `background` が `service_worker` として定義されているか（Firefox では `scripts` も可だが V3 標準に合わせているか）
- `action` を使用しているか（`browser_action` ではなく）
- `browser_specific_settings.gecko.id` が設定されているか（AMO 署名に必要）

### 3-2. アイコン

- `icons` に複数サイズ（16, 32, 48, 96, 128）が定義されているか
- `action.default_icon` にツールバー用アイコンが設定されているか

## 4. Content Script の設計

### 4-1. パフォーマンス

- Content Script の初期化処理は軽量か（DOMContentLoaded を待っているか、即座に重い処理をしていないか）
- ヒントモードの要素収集で `querySelectorAll` のスコープが広すぎないか
- `MutationObserver` を使用している場合、監視対象が適切に絞られているか
- イベントリスナーが不要になった際に `removeEventListener` しているか
- スクロールイベント等の高頻度イベントにデバウンス/スロットルが適用されているか

### 4-2. DOM 操作

- インジェクトする UI 要素（ヒントラベル、サーチバー、タブファインダー）が既存ページのレイアウトを壊さないか
  - `position: fixed` または `position: absolute` を使用しているか
  - `z-index` が十分に高いか
  - CSS クラス名やID がページ側と衝突しないプレフィックスを使っているか（例: `vimimin-*`）
- UI 要素の除去時にクリーンアップが完全か（DOM ノード、イベントリスナー、スタイル要素）

### 4-3. キー入力の処理

- `keydown` イベントで `event.key` を使用しているか（`event.keyCode` は非推奨）
- Insert モード（input, textarea, contenteditable）でキーイベントを適切にスルーしているか
- `event.preventDefault()` は意図したキーのみに適用しているか（ブラウザのデフォルトショートカットを壊していないか）
- IME 入力（日本語等）の composing 中にキーバインドが発火しないか（`event.isComposing` のチェック）

## 5. Background (Service Worker)

### 5-1. 状態管理

- グローバル変数に永続的な状態を持っていないか（Service Worker は停止・再起動される）
- 永続化が必要な状態は `browser.storage.session` または `browser.storage.local` に保存しているか
- `browser.storage` の読み書きが非同期であることを正しくハンドリングしているか

### 5-2. メッセージング

- Content Script ↔ Background のメッセージに型定義があるか
- 不明なメッセージタイプへのフォールバック処理があるか
- `browser.runtime.onMessage` のリスナーで非同期処理を行う場合、`return true` または Promise を返しているか

## 6. ビルド・配布

### 6-1. ビルド成果物

- `dist/` にソースマップが含まれていないか（AMO 提出時にソースコードの提供で対応）
- バンドル後のコードに不要なdevDependencies のコードが含まれていないか
- `web-ext lint` でエラーが出ないか

### 6-2. AMO 提出（unlisted の場合も）

- ソースコードが難読化されていないか（AMO レビューポリシー）
- ビルド手順が README に記載されているか（レビュアーが再現ビルドできるように）
