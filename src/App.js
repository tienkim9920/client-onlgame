import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Caro from './component/Caro/Caro';
import Footer from './component/Footer/Footer';
import Room from './component/Caro/Room';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/caro" component={Room} />
          <Route path="/caro/board" component={Caro} />
        </Switch>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
