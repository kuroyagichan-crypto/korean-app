# 🇰🇷 韓국語学習アプリ — デプロイガイド

## 必要なもの

- [Node.js](https://nodejs.org/) v18以上
- [Vercelアカウント](https://vercel.com)（無料）
- [Anthropic APIキー](https://console.anthropic.com)

---

## ステップ1：GitHubにリポジトリを作る

1. [github.com/new](https://github.com/new) でリポジトリを作成（名前例：`korean-app`）
2. このフォルダの中身を全部アップロード

```bash
cd korean-webapp
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/あなたのユーザー名/korean-app.git
git push -u origin main
```

---

## ステップ2：Vercelにデプロイ

1. [vercel.com/new](https://vercel.com/new) を開く
2. 「Import Git Repository」→ 作ったGitHubリポジトリを選択
3. 「Environment Variables」で以下を追加：

| 変数名 | 値 |
|--------|-----|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxx...`（Anthropicで発行） |

4. 「Deploy」ボタンをクリック

→ 数分で `https://korean-app-xxxx.vercel.app` のようなURLが発行されます。

---

## ステップ3：iPhoneのホーム画面に追加

1. iPhoneのSafariでURLを開く
2. 下部の共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」→ 「追加」

これでアプリのように使えます。

---

## ローカル開発（確認用）

```bash
npm install
cp .env.example .env.local   # .env.localにAPIキーを書く
npm run dev
```

→ http://localhost:5173 で動作確認できます。

---

## Anthropic APIキーの取得

1. [console.anthropic.com](https://console.anthropic.com) にアクセス
2. 「API Keys」→「Create Key」
3. 発行されたキー（`sk-ant-...`）をコピー
4. Vercelの環境変数に設定

※APIの利用料金は使った分だけ発生します（Claude Sonnet: 約$3/100万トークン）。
　毎日10分程度の使用なら月数十円〜数百円程度の見込みです。
