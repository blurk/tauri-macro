import { moveWindow, Position } from "@tauri-apps/plugin-positioner";
import { Howl } from "howler";

import * as monaco from "monaco-editor/esm/vs/editor/editor.main";

import Macro from "./Macro";

moveWindow(Position.TopRight);

const soundStart = new Howl({
  src: ["/sounds/start.mp3"],
  volume: 0.2,
});

const soundContinue = new Howl({
  src: ["/sounds/continue.mp3"],
  volume: 0.2,
});

const soundStop = new Howl({
  src: ["/sounds/stop.mp3"],
  volume: 0.2,
});

const soundReset = new Howl({
  src: ["/sounds/reset.mp3"],
  volume: 0.2,
});

const soundWait = new Howl({
  src: ["/sounds/wait.mp3"],
  volume: 0.2,
  loop: true,
});

window.addEventListener("DOMContentLoaded", async () => {
  /** @type {Macro} */
  let macro;

  const txtCountDown = document.getElementById("txtCountDown");
  const btnStart = document.getElementById("btnStart");
  const btnStop = document.getElementById("btnStop");
  const btnContinue = document.getElementById("btnContinue");
  const btnReset = document.getElementById("btnReset");

  const editor = monaco.editor.create(document.getElementById("editor"), {
    theme: "vs-dark",
    automaticLayout: true,
    minimap: { enabled: false, renderCharacters: false },
    renderIndentGuides: false,
    renderLineHighlightOnlyWhenFocus: true,
    language: "typescript",
    value: value,
  });

  btnStart.onclick = async () => {
    const content = editor.getValue();

    if (!content) {
      alert("NO!");
      return;
    }

    macro = new Macro({
      content: content,
      wait: 21000,
      delay: 987,
    });

    soundWait.play();
    txtCountDown.innerText = "Will run after 10s!";

    setTimeout(async () => {
      soundWait.stop();
      soundStart.play();
      await macro.run();
      txtCountDown.innerText = "Started!";
    }, 10 * 1000);
  };

  btnStop.onclick = async () => {
    soundWait.stop();
    soundStop.play();
    macro.stop();
    txtCountDown.innerText = "Stopped!";
  };

  btnContinue.onclick = async () => {
    soundWait.play();
    txtCountDown.innerText = "Will continue after 5s!";

    setTimeout(async () => {
      soundWait.stop();

      soundContinue.play();
      await macro.continue();
      txtCountDown.innerText = "Continued!";
    }, 5 * 1000);
  };

  btnReset.onclick = async () => {
    soundReset.play();
    await macro.reset();
    txtCountDown.innerText = "Reset done!";
  };
});

const value = `import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import axios from 'axios';

// Redux Action Types
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

// Redux Actions
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// Redux Reducer
interface State {
  count: number;
}

const initialState: State = { count: 0 };

const rootReducer = (state = initialState, action: { type: string }) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

// Create Redux Store
const store = createStore(rootReducer);

// Counter Component
interface CounterProps {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const Counter: React.FC<CounterProps> = ({ count, increment, decrement }) => (
  <div>
    <h1>Counter: {count}</h1>
    <button onClick={increment}>Increment</button>
    <button onClick={decrement}>Decrement</button>
  </div>
);

const mapStateToProps = (state: State) => ({
  count: state.count,
});

const mapDispatchToProps = {
  increment,
  decrement,
};

const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);

// Quote Component
interface QuoteState {
  quote: string;
  author: string;
}

class Quote extends Component<{}, QuoteState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      quote: '',
      author: '',
    };
  }

  fetchQuote = () => {
    axios.get('https://api.quotable.io/random')
      .then(response => {
        const { content, author } = response.data;
        this.setState({ quote: content, author });
      })
      .catch(error => {
        console.error('Error fetching quote:', error);
      });
  };

  componentDidMount() {
    this.fetchQuote();
  }

  render() {
    return (
      <div>
        <p>"{this.state.quote}"</p>
        <p>- {this.state.author}</p>
        <button onClick={this.fetchQuote}>New Quote</button>
      </div>
    );
  }
}

// Main App Component
const App: React.FC = () => (
  <Provider store={store}>
    <Router>
      <div>
        <h1>My App</h1>
        <nav>
          <Link to="/">Counter</Link>
          <Link to="/quote">Quote</Link>
        </nav>
        <Switch>
          <Route path="/" exact component={ConnectedCounter} />
          <Route path="/quote" component={Quote} />
        </Switch>
      </div>
    </Router>
  </Provider>
);

// Render the App
ReactDOM.render(<App />, document.getElementById('root'));`;
