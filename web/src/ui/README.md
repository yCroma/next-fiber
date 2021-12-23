# components

- `parts`
  - 鋳型をイメージしている
  - 引数を与えることによって、初めてコンポーネントとして完成するもの
  - それ以外では動かない
    - useEffectで初期化しない
    - 状態は与えられるもののみ(props only)
- `units`
  - `units`は`parts`の状態を保持しているもの
  - `units`と`parts`の違いは初期化をしたり、ステートを持つかどうか
    - useEffectで初期化してよい
    - useStateで状態を持ってよい
  - `unit`間での組み合わせは可能
  - `page`で利用してもよい
- `components`
  - HTML における`header`や`footer`などのテンプレートのようなもの
  - `page`は基本的にコンポーネントの組み合わせで作成する
  - RootState は`components`が持ち、units`を組み合わせて作成する

# rules

- 各階層は、上位階層の状態が分からずとも機能を実行できるようにしている
- 下階層から上位階層の値を更新したいときは、setState を用いる
- `page`で利用している`units`が多い場合は、一度`components`にすることができないか考える
