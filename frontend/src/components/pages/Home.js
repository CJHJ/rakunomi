import React from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";

class Home extends React.Component {
  render() {
    return (
      <Container>
        <h1>Home</h1>
        <Card>
          <Row>
            <Col>
              <h1>Share the realistic nomikai experience!</h1>
              <h3>About Us</h3>
              <p>
                Have you ever wondered about sharing a set food and drink items
                sold in Rakuten with your friends during the quarantine? You’ve
                come to the right place! RakuNomi allows you to easily set up a
                meeting, together with the food items recommendation directly
                curated by yours truly from Rakuten Ichiba.
              </p>
            </Col>
          </Row>
        </Card>
        <Card>
          <Row>
            <Col>
              <Row>
                <Col>
                  <h2>See feedbacks from other users </h2>
                  <p>
                    Having a history system allows the users to share their food
                    choices, share whether the items were compatible with the
                    accassions
                  </p>
                </Col>
                <Col>
                  <h2>Same time delivery </h2>
                  <p>
                    Same time delivery ensures that the food you get are still
                    fresh when you enjoy it during your scheduled Nomikai!
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Container>
    );
  }
}

export default Home;
