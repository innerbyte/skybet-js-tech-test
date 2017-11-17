import React, { Component } from 'react';
import {
  Row,
  Col
} from 'reactstrap';


class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <div className="text-center">
              <h3>
                Please select an event type from the side bar.
              </h3>
            </div>
          </Col>

          
        </Row>
      </div>
    )
  }
}

export default Dashboard;
