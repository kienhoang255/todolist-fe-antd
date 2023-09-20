import "./App.css";

import { Provider } from "react-redux";
import store from "./store/store";

import View from "./view";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <View />
      </Provider>
    </div>
  );
}

export default App;
