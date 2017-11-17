import React, { Component } from 'react';
import { Badge, Collapse, Container, Row, Col, Card, CardHeader, CardFooter, CardBody, NavLink } from 'reactstrap';

import { connect } from 'react-redux';
import { fetch_events, fetch_event } from '../redux/actions/events.action';
import { fetch_market } from '../redux/actions/markets.action';
import { fetch_outcome, update_outcome } from '../redux/actions/outcomes.action';
import config from '../config';

import moment from 'moment';

class FootballEvent extends Component {
    constructor(props) {
		super(props);
		
		this.ws = null;

		this.state = {
			event: null
		};
    }

    init() {
        if (!this.ws) {
            this.ws = new WebSocket(`ws://${config.ws.url}:${config.ws.port}`);
            this.ws.addEventListener("message", e => this.on_price_change(e.data)); // logs all data to console
        }
        
        let event = this.props.events.find((v, i) => {
			return v.eventId == this.props.match.params.event_id;
		});

		this.setState({
			event: event
		});

        this.props.fetch_event(event.eventId)
            .then(() => {
                let markets = this.props.markets.filter((v) => {
                    return v.eventId === event.eventId
                });

                let market_keys = [];
                let outcome_keys = [];

                markets.map(m => {
                    market_keys.push(("m." + m.marketId.toString()));
                    this.props.fetch_market(m.marketId)
                        .then(() => {
                            let outcomes = this.props.outcomes.filter((o) => {
                                return m.marketId === o.marketId;
                            });

                            outcomes.map((o) => {
                                outcome_keys.push("o." + o.outcomeId.toString());
                            });

                            this.ws.send(JSON.stringify({type: "subscribe", keys: market_keys}));
                            this.ws.send(JSON.stringify({type: "subscribe", keys: outcome_keys}));
                        });
                });
            });
    }

    on_price_change(data) {
        if (data.type == "PRICE_CHANGE") {
            let outcome_id = data.data.outcomeId;
            let price = data.data.price;
            let status = data.data.status;

            let outcome = Object.assign({}, this.props.outcomes.find(v => v.outcomeId === outcome_id));
            outcome.price = price;
            outcome.status = status;

            this.props.update_outcome(outcome);
        }
    }

	componentDidMount() {
		if (this.props.events.length === 0) {
			this.props.fetch_events().then(() => {
				this.init();
			});;
		} else {
			this.init();
		}
	}

	componentWillUnmount() {
		if (this.ws) {
			this.ws.send(JSON.stringify({type: "unsubscribe"}));
			this.ws.close();
		}
	}

	componentDidUpdate(prev_props) {
		if (this.props.location !== prev_props.location)
			this.init();
	}

    get_event_name() {
        if (this.state.event == null)
            return;

        const home = this.state.event.competitors.find(v => v.position === 'home');
        const away = this.state.event.competitors.find(v => v.position === 'away');

        return (
            <div>
                <h5>
                    <strong>
                        { home.name }
                        &nbsp;
                        <Badge color="primary">{ this.state.event.scores.home }</Badge>
                        &nbsp;
                        -
                        &nbsp;
                        <Badge color="primary">{ this.state.event.scores.away }</Badge>
                        &nbsp;
                        { away.name }
                    </strong>
                    &nbsp; ({ moment(this.state.event.startTime).format('DD/MM/YY @ HH:mm') })
                </h5>
            </div>
        );
    }

    on_collapse(id) {
        let obj = {};
        obj[id] = this.state[id] ? false : true;

        this.setState(obj);
    }

    get_markets() {
        if (this.state.event == null)
            return;

        let markets = this.props.markets.filter(v => v.eventId === this.state.event.eventId);

        return markets.map((v, i) => {
            let collapse_id = `${v.marketId}_is_open`;
            return (
                <Card key={i} style={{cursor: "pointer"}} >
                    <CardHeader>
                        <div onClick={ () => this.on_collapse(collapse_id) }>
                        <span>
                            <i className={ ("fa " + (this.state[collapse_id] ? "fa-arrow-down" : "fa-arrow-right")) } aria-hidden="true"></i>
                        </span>
                        <span> { v.name } </span>
                        </div>
                    </CardHeader>
                    <Collapse isOpen={ this.state[collapse_id] }>
                        <CardBody>
                            { this.get_outcomes(v) }
                        </CardBody>
                    </Collapse>
                </Card>
            );
        });
    }

    get_cs_outcome(market) {
        let outcomes = this.props.outcomes.filter((v, i) => v.marketId === market.marketId);
        
        let home = outcomes.filter((v) => v.type === "home");
        let draw = outcomes.filter((v) => v.type === "draw");
        let away = outcomes.filter((v) => v.type === "away");

        let max = 0;

        if (home.length > max) max = home.length;
        if (draw.length > max) max = draw.length;
        if (away.length > max) max = away.length;

        let outcome_list = [];

        for (let i = 0; i < max; ++i) {
            let home_outcome = home[i];
            let draw_outcome = draw[i];
            let away_outcome = away[i];

            let home_score = "-";
            let home_odds = "";

            let draw_score = "-";
            let draw_odds = "";

            let away_score = "-";
            let away_odds = "";

            if (home_outcome) {
                home_score = (home_outcome.score.home + " - " + home_outcome.score.away);
                home_odds = (this.props.settings.decimal_odds ? (home_outcome.price.decimal) : (home_outcome.price.num + "/" + home_outcome.price.den));
            }

            if (draw_outcome) {
                draw_score = (draw_outcome.score.home + " - " + draw_outcome.score.away);
                draw_odds = (this.props.settings.decimal_odds ? (draw_outcome.price.decimal) : (draw_outcome.price.num + "/" + draw_outcome.price.den));
            }

            if (away_outcome) {
                away_score = (away_outcome.score.away + " - " + away_outcome.score.home);
                away_odds = (this.props.settings.decimal_odds ? (away_outcome.price.decimal) : (away_outcome.price.num + "/" + away_outcome.price.den));
            }

            let key = market.marketId.toString() + "_" + i.toString();

            outcome_list.push(
                <Col xs="12" sm="12" md="12" key={key}>
                    <Row>
                        <Col xs="4" sm="4" md="4" className="text-center">
                            <strong> { home_score } </strong>
                            &nbsp;
                            &nbsp;
                            <Badge color="primary">{ home_odds }</Badge>
                        </Col>
                        <Col xs="4" sm="4" md="4" className="text-center">
                            <strong> { draw_score } </strong>
                            &nbsp;
                            &nbsp;
                            <Badge color="primary">{ draw_odds }</Badge>
                        </Col>
                        <Col xs="4" sm="4" md="4" className="text-center">
                            <strong> { away_score } </strong>
                            &nbsp;
                            &nbsp;
                            <Badge color="primary">{ away_odds }</Badge>
                        </Col>
                    </Row>
                </Col>
            );
        }

        let key = market.marketId.toString();
        return (
            <Row key={ key }>
                <Col xs="4" sm="4" md="4" className="text-center">
                    <strong> Home </strong>
                </Col>
                <Col xs="4" sm="4" md="4" className="text-center">
                    <strong> Draw </strong>
                </Col>
                <Col xs="4" sm="4" md="4" className="text-center">
                    <strong> Away </strong>
                </Col>

                <Row>
                    {
                        outcome_list
                    }
                </Row>
            </Row>
        );
    }

    get_wdw_outcome(market) {
        let outcomes = this.props.outcomes.filter((v, i) => v.marketId === market.marketId);

        let key = market.marketId.toString();
        return (
			<Row key={ key }>
                <Col xs="4" sm="4" md="4" className="text-center">
					<strong> { outcomes[0].name } </strong>
					&nbsp;
					&nbsp;
					<Badge color="primary">{ this.props.settings.decimal_odds ? (outcomes[0].price.decimal) : (outcomes[0].price.num + "/" + outcomes[0].price.den) }</Badge>
				</Col>
				<Col xs="4" sm="4" md="4" className="text-center">
					<strong> { outcomes[1] ? outcomes[1].name : '-' } </strong>
					&nbsp;
					&nbsp;
					<Badge color="primary">{ outcomes[1] ? (this.props.settings.decimal_odds ? (outcomes[1].price.decimal) : (outcomes[1].price.num + "/" + outcomes[1].price.den)) : '' }</Badge>
				</Col>
				<Col xs="4" sm="4" md="4" className="text-center">
					<strong> { outcomes[2] ? outcomes[2].name : '-' } </strong>
					&nbsp;
					&nbsp;
					<Badge color="primary">{ outcomes[2] ? (this.props.settings.decimal_odds ? (outcomes[2].price.decimal) : (outcomes[2].price.num + "/" + outcomes[2].price.den)) : '' }</Badge>
				</Col>
            </Row>
		);
    }

    get_std_outcome(outcome, i) {
        let key = outcome.marketId.toString() + "_" + outcome.outcomeId.toString() + "_" + i.toString();
        return (
            <Row key={ key }>
              <Col xs="12" sm="12" md="12" className="">
                <Row>
                    <Col xs="10" sm="10" md="10" className="">
                        <strong> { outcome.name } </strong>
                    </Col>
                    <Col xs="2" sm="2" md="2" className="text-center">
                        <strong>
                            {
                                this.props.settings.decimal_odds ? (outcome.price.decimal) : (outcome.price.num + "/" + outcome.price.den)
                            }
                        </strong>
                    </Col>
                </Row>
              </Col>  
            </Row>
        );
    }

    get_outcomes(market) {
        switch(market.type) {
            case "standard":
                return this.props.outcomes.filter((v) => {
                    return v.marketId == market.marketId
                }).map((v, i) => {
                    return this.get_std_outcome(v, i); 
                });
            case "win-draw-win":
                return this.get_wdw_outcome(market);
            case "correct-score":
                return this.get_cs_outcome(market);
                // return this.props.outcomes.filter((v) => {
                //     return v.marketId == market.marketId
                // }).map((v, i) => {
                //     return this.get_std_outcome(v, i); 
                // });
        }
    }

    render() {
        return (
            <div className="animated fadeIn">
            <Card>
                <CardHeader>
                    { this.get_event_name() }
                </CardHeader>
                <CardBody>
                    { this.get_markets() }
                </CardBody>
            </Card>
        </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
	  events: state.events,
	  settings: state.settings,
	  markets: state.markets,
	  outcomes: state.outcomes
    };
  };
  
  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetch_events: () => {
			return dispatch(fetch_events());
        },
        fetch_event: (event_id) => {
			return dispatch(fetch_event(event_id));
        },
        fetch_market: (market_id) => {
			return dispatch(fetch_market(market_id));
        },
        fetch_outcome: (outcome_id) => {
			return dispatch(fetch_outcome(outcome_id));
        },
        update_outcome: (outcome) => {
            return dispatch(update_outcome(outcome));
        }
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(FootballEvent);
