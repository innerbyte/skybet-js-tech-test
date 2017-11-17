import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Badge, Nav, NavItem, NavLink as RsNavLink, Label, Input} from 'reactstrap';
import classNames from 'classnames';

import SidebarFooter from './../SidebarFooter';
import SidebarHeader from './../SidebarHeader';
import SidebarMinimizer from './../SidebarMinimizer';

import { connect } from 'react-redux';
import { fetch_events } from '../../redux/actions/events.action';
import { update_settings, fetch_settings } from '../../redux/actions/settings.action';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.on_decimals_change = this.on_decimals_change.bind(this);
    this.on_primary_change = this.on_primary_change.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName, props) {
    // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
    return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';

  }

  // todo Sidebar nav secondLevel
  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  componentDidMount() {
    this.props.fetch_events()
    .then(() => {
      if (!this.props.events || this.props.events.length === 0)
        setTimeout(() => { this.componentDidMount(); }, 1500);
    });
  }

  on_primary_change(e) {
    this.props.update_settings({
      primary_markets: e.target.checked,
      decimal_odds: this.props.settings.decimal_odds
    });
  }

  on_decimals_change(e) {
    this.props.update_settings({
      primary_markets: this.props.settings.primary_markets,
      decimal_odds: e.target.checked
    });
  }

  event_item(event, key) {
    
    const variant = classNames("nav-link");

    return (
      <NavItem key={key}>
        { 
          <NavLink to={`/football/${event.cat_name}`} className={variant} activeClassName="active">
            <i className="icon-puzzle"></i>{ event.linkedEventTypeName || event.typeName }
          </NavLink>
        }
      </NavItem>
    )
  }

  events_display() {
    let cats = [];

    return this.props.events.map((v, i) => {
      if (!cats.find((c) => c === v.cat_name)) {
        cats.push(v.cat_name);
        return this.event_item(v, i);
      }
    });
  }

  render() {
    // sidebar-nav root
    return (
      <div className="sidebar">
        <SidebarHeader/>
        <nav className="sidebar-nav">
          <Nav>
            <li className="nav-title">Settings</li>

            <NavItem>
                &nbsp;
                &nbsp;
                <Label className="switch switch-3d switch-primary">
                  <Input type="checkbox" className="switch-input" id="settings_primary_markets" checked={ this.props.settings.primary_markets } onChange={ this.on_primary_change } />
                  <span className="switch-label"></span>
                  <span className="switch-handle"></span>
                </Label>
                &nbsp;
                &nbsp;
                <Label for="settings_primary_markets">
                  Primary markets
                </Label>
            </NavItem>

            <NavItem>
                &nbsp;
                &nbsp;
                <Label className="switch switch-3d switch-primary">
                  <Input type="checkbox" className="switch-input" id="settings_decimal_odds" checked={ this.props.settings.decimal_odds } onChange={ this.on_decimals_change } />
                  <span className="switch-label"></span>
                  <span className="switch-handle"></span>
                </Label>
                &nbsp;
                &nbsp;
                <Label for="settings_decimal_odds">
                  Decimal odds
                </Label>
            </NavItem>

            <li className="nav-title">Football</li>
            { this.events_display() }
          </Nav>
        </nav>
        <SidebarFooter/>
        <SidebarMinimizer/>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    events: state.events,
    settings: state.settings
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetch_events: () => {
      return dispatch(fetch_events());
    },
    update_settings: (settings) => {
      dispatch(update_settings(settings));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);