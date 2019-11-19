import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationBar from './helper/nav-bar';
import CreateSurvey from './survey/create-survey';
import ProfilePage from './user/profile-page';
import Login from './user/login';
import TakeSurvey from './survey/take-survey';

export default function App(props) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const localUser = window.localStorage.getItem('userInfo');
    if (localUser) {
      setUserInfo(JSON.parse(localUser));
    }
  }, [userInfo]);

  const logout = () => {
    setUserInfo(null);
    window.localStorage.removeItem('userInfo');
    window.localStorage.removeItem('token');
  };

  return (
    <Router>
      <NavigationBar logout={logout}/>
      <Switch>
        <Route
          exact
          path="/"
          render={props => userInfo ? (
            <ProfilePage
              {...props}
            />
          ) : (
            <Login
              {...props}
              setUserInfo={setUserInfo}
            />
          )}
        />
        <Route path="/create-survey" render={props => <CreateSurvey {...props}/>} />
        <Route path="/surveys/take" render={props => <TakeSurvey {...props}/>} />
      </Switch>
    </Router>
  );
}
