import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/';

// Components
import FootballLeague from '../../views/football-league';
import FootballEvent from '../../views/football-event';


class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Route exact={true} path="/football/:cat_name" name="Football League" component={FootballLeague}/>
                <Route exact={true} path="/football/:cat_name/:event_id" name="Football Event" component={FootballEvent}/>
                <Redirect from="/" to="/dashboard"/>
              </Switch>
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
