import React, { Component } from 'react';
import { Badge, Container, Row, Col, Card, CardHeader, CardFooter, CardBody, NavLink } from 'reactstrap';

import { connect } from 'react-redux';
import { fetch_events } from '../redux/actions/events.action';
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
        let event = this.props.events.find((v, i) => {
			return v.eventId == this.props.match.params.event_id;
		});

		this.setState({
			event: event
		});

		if (!this.ws) {
			this.ws = new WebSocket(`ws://${config.ws.url}:${config.ws.port}`);
			// this.ws.send(JSON.stringify({type: "subscribe", keys: ["e.21249934"], clearSubscription: false}));
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

	insert_primary_market(event) {
		if (!this.props.settings.primary_markets)
			return;

		let market = this.props.markets.find(v => v.is_primary && v.eventId === event.eventId);

		if (market == null)
			return;

		let outcomes = this.props.outcomes.filter(v => v.marketId === market.marketId);

		if (outcomes == null || outcomes.length === 0)
			return;

		return (
			<Row style={{marginTop: '10px', marginBottom: '10px'}}>
				<Col xs="12" sm="12" md="12" className="text-center">
					<strong>{ market.name }</strong>
				</Col>
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

	event_item(event, key, is_odd) {
		const home = event.competitors.find(v => v.position === 'home');
		const away = event.competitors.find(v => v.position === 'away');

		return (
			<Col key={key} xs="12" sm="12" md="12" style={{cursor: 'pointer', backgroundColor: is_odd ? '#dddddd' : '#ffffff'}} >
				
				<Row>
					<Col xs="3" sm="3" md="3">
						{ moment(event.startTime).format('DD/MM/YY @ HH:mm') }
					</Col>
					<Col xs="9" sm="9" md="9" className="text-center">
						<h5>
							<strong>
								{ home.name }
								&nbsp;
								<Badge color="primary">{ event.scores.home }</Badge>
								&nbsp;
								-
								&nbsp;
								<Badge color="primary">{ event.scores.away }</Badge>
								&nbsp;
								{ away.name }
							</strong>
						</h5>
					</Col>		
				</Row>
				{ this.insert_primary_market(event) }
				
			</Col>
		);
	}

	events_list() {
		let is_odd = true;

		return this.props.events.map((v, i) => {
			if (this.state.cat_name !== v.type_name)
				return;

			is_odd = !is_odd;
			return this.event_item(v, i, is_odd);
		})
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

    get_markets() {
        if (this.state.event == null)
            return;

        
    }

    render() {
        return (
            <div className="animated fadeIn">
            <Card>
                <CardHeader>
                    { this.get_event_name() }
                </CardHeader>
                <CardBody>
                    <Row>
						{/* { this.events_list() } */}
                    </Row>
                </CardBody>
            </Card>
        </div>

        )
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
		}
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(FootballEvent);
