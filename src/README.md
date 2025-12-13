# FF14 ロール抽選ツール

8人パーティーのロールを自動抽選するツールです。

## 機能

- 8種類のロールに対応（メインタンク、サブタンク、ピュアヒーラー、バリアヒーラー、メレー１、メレー２、レンジ、キャス）
- 各プレイヤーが複数の希望ロールを選択可能
- カスタマイズ可能なロール構成
- ランダムな自動割り当てアルゴリズム

## GitHub Pagesへのデプロイ方法

### 1. リポジトリの設定

1. GitHubリポジトリの「Settings」→「Pages」に移動
2. 「Source」を「GitHub Actions」に設定

### 2. デプロイ

mainブランチにプッシュすると自動的にデプロイされます：

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 3. サブディレクトリでデプロイする場合

リポジトリ名がURLに含まれる場合（例：`https://username.github.io/ff14-role-lottery/`）は、
`vite.config.ts`の`base`を以下のように変更してください：

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/ff14-role-lottery/', // リポジトリ名に合わせて変更
  build: {
    outDir: 'dist',
  },
});
```

## ローカルでの開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# ビルドのプレビュー
npm run preview
```

## 使い方

1. 各プレイヤーの名前を入力
2. 希望するロールを選択（複数選択可能）
3. 必要に応じてロール構成を変更
4. 「ロールを抽選」ボタンをクリック
5. 各プレイヤーにロールが自動で割り当てられます

## 技術スタック

- React
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (アイコン)
