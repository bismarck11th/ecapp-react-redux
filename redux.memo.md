# Redux

## **Three Principles (3 原則)**

### [ Single source of truth ]

アプリケーション全体の状態(state)はツリーの形で１つのオブジェクトで作られ、１つのストアに保存される。

- state が保存しやすいので、ユニバーサルアプリケーションがつくりやすい。
- state が一つだから、デバッグしやすい、開発しやすい。

### [ State is read-only ]

状態を変更する手段は、変更内容をもった action オブジェクトを発行して実行するだけ。

- ビューやコールバックが状態を直接変更させることはできない。
- 変更は一つずつ順番に行なわれる。
- action はオブジェクトなので、保存可能であり、テストしやすい。

### [ Mutations are written as pure functions ]

アクションがどのように状態を変更するかを「Reducer」で行う。

- 「Reducer」は状態とアクションを受けて、新しい状態を返す関数である。
- 現在の state オブジェクトを変更することはせずに、新しい state オブジェクトを作って返すというのがポイント。
- 開発するときは、最初はアプリケーションで一つの Reducer を用意して、巨大化してきたら Reducer を分割していく。

### Prior Art 　( 既存技術との比較 )

### [ Flux ]

Redux は Flux の実装かといれば Yes でもあり No でもある。
Flux の要素を取り入れている部分も多い。

- 更新ロジックを一カ所にまとめている(Flux なら Store, Redux なら Reducer)
- アプリケーションが状態を直接変更することはなく、状態の変更はアクションですべておこなわれる

### Flux とは異なる点

- Redux には dispatcher がない。(Reducer で担う)
- Redux では状態のオブジェクトに変更を行なうことはない。新しい状態オブジェクトを作る。

## **Actions**

- action はアプリケーションからの情報を store へ送る為のオブジェクト。
- action は store.dispatch()で store へ送られる。
- action は、何を行なうものかを識別するために"type"プロパティを必ず持つ。他のプロパティについては自由。

```javascript
const ADD_TODO = 'ADD_TODO'
{
  type: ADD_TODO,
  text: 'Build my first Redux app'
}
```

- type の値は文字列。アプリケーションが大きくなる場合は、type の定義値を別モジュールにするとよい。

```javascript
import { ADD_TODO, REMOVE_TODO } from '../actionTypes';
```

### Action creators

action creators は、その名の通り action を生成するメソッド

- Flux では、action creator 内で action を作成して、そのまま dispatch までを行なうのが一般的。

```javascript
function addTodoWithDispatch(text) {
  const action = {
    type: ADD_TODO,
    text
  };
  dispatch(action);
}
```

- 対して Redux では、シンプルに action を作るだけ。その方がテストしやすいから。

```javascript
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  };
}
```

- dispatch するときは creator で作成した action を渡す。

```javascript
dispatch(addTodo(text));
dispatch(completeTodo(index));
```

- または、bound action creator として dispatch までを行なう creator を別途用意する。

```javascript
dispatch(addTodo(text));
dispatch(completeTodo(index));
```

- react-redux ライブラリの connect を import して、ヘルパーの bindActionCreators()を使うのもいいでしょう。

```javascript
import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

let boundActionCreators = bindActionCreators(TodoActionCreators, dispatch);
```

## **Reducers**

reducer は、action を受けて state を変更するの為のメソッド

### Designing the State Shap (State のデータ設計)

- Redux では、state はすべて個別のオブジェクトとして保持される。
- state には UI の内容を入れないようにするのが推奨されている。

### Handling Actions (action の制御)

reducer は、現在の state と action を受けて新しい state を返すだけの純粋なメソッド。

```javascript
(previousState, action) => newState;
```

reducer の中で以下のことをやってはいけない。

- 引数の state, action インスタンスの値を変更する
- 副作用をおこす(API を呼んだり、ルーティングを変えるなどなど)
- 毎回値が変わるもの(Date.now() や Math.random())を扱う

Redux では最初に reducer は state が undefined で呼び出す。その際に初期値を設定。

```javascript
function todoApp(state = initialState, action) {
  // For now, don’t handle any actions
  // and just return the state given to us.
  return state;
}
```

処理を action によって Switch で分岐

```javascript
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      });
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      });
    case COMPLETE_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos.slice(0, action.index),
          Object.assign({}, state.todos[action.index], {
            completed: true
          }),
          ...state.todos.slice(action.index + 1)
        ]
      });
    default:
      return state;
  }
}
```

### Splitting Reducers（Reducers を分割）

reducer 内での visiblity_filter と todos の処理を子 reducer として分割すると分かりやすくなります。
初期値の値の処理はそれぞれの子 reducer に記述します。
これは reducer composition と呼ばれていて、Redux アプリケーションの基本的な構成です。

```javascript
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ];
    case COMPLETE_TODO:
      return [
        ...state.slice(0, action.index),
        Object.assign({}, state[action.index], {
          completed: true
        }),
        ...state.slice(action.index + 1)
      ];
    default:
      return state;
  }
}

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}

function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  };
}
```

最後に、Redux では combineReducers()というユーティリティを提供しており、todoApp を書き換えることができます。combineReducer では分割された子 reducer 名と同じキーの state が使用されます。

```javascript
import { combineReducers } from 'redux';

const todoApp = combineReducers({
  visibilityFilter,
  todos
});

export default todoApp;
```

## **Stores**

ストアの役割は、

- state を保持する
- state へアクセスするための getState()を提供する
- state を更新するための dispatch(action)を提供する
- リスナーを登録するための subscribe(listener)を提供する

Redux では store は必ず一つする。
data ごとにロジックを分割したい場合は、store を分割せずに reducer composition を使用。

store をつくるには、combineReducer でつくられた reducer を createStore()へ渡す。

```javascript
import { createStore } from 'redux';
import todoApp from './reducers';
let store = createStore(todoApp);
```

## **Data Flow**

Redux のデータフローの基本は、一方向ということです。
すべての Redux アプリケーションでのデータのライフサイクルは以下の 4 つのステップをたどる。

### 1. store.dispatch(action)を呼ぶ

- action は「何をする」という内容を持ったオブジェクト。
- store.dispatch(action)はアプリケーション上のどこからでも読み出すことが出来ます。

### **2.store は受けた action と現在保持している state を reducer へ渡す**

- reducer は action と state を元に、新しい state を作成して返すメソッド
- reducer のメソッドは副作用を起こさないものでなければならず、A という state に対して毎回必ず B という state を返すような関数でなければならない

### **3. 子 reducer の返した state を親 reducer がまとめて一つのツリー状の state を返す**

- state のプロパティはツリー状になっており、reducer はプロパティに対応した子 reducer が処理し、また一つのツリー状の state として返す。
- 親 reducer をどのように実装するかは自由。Redux では、reducer を分割するための combineReducers()をヘルパーとして提供しています。

### **4.reducer が作成した新しい state を store が保存する**

- store.subscribe(listener) でリスナーを登録した場合、リスナーでは store.getState()で現在の state を取得して reducer が呼び出される。
