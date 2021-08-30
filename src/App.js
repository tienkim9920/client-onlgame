import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Caro from "./component/Caro/Caro";
import Footer from "./component/Footer/Footer";
import Room from "./component/Caro/Room";
import Home from "./component/Home/Home";
import Header from "./component/Header/Header";
import logo from "./global/logo.png";
import SignIn from "./component/Auth/SignIn";
import SignUp from "./component/Auth/SignUp";
import Profile from "./component/Auth/Profile";
import Tetris from "./component/Tetris/Tetris";
import Snake from "./component/Snake/Snake";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Header />
          <div className="group-home-title">
            <h1>Cùng chơi nào</h1>
            <div className="line-title-home">
              <div className="line-title">
                <div className="show-line"></div>
                <img src={logo} alt="" />
                <div className="show-line"></div>
              </div>
            </div>
          </div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/caro" component={Room} />
            <Route path="/caro/board" component={Caro} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/profile" component={Profile} />
            <Route path="/tetris" component={Tetris} />
            <Route path="/snake" component={Snake} />
          </Switch>
          <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
