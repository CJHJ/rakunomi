import React from "react";
import { Container, Row, Col, Form, Figure } from "react-bootstrap";
import { Panda20, Panda40, Panda60, Panda80, Panda100 } from "./PandaImages";

export default function Pandas(props) {
  const { rating } = props;
  if (rating <= 20) {
    return (
      <div>
        <img src={Panda20} />
      </div>
    );
  } else if (rating <= 40) {
    return (
      <div>
        <img src={Panda40} />
      </div>
    );
  } else if (rating <= 60) {
    return (
      <div>
        <img src={Panda60} />
      </div>
    );
  } else if (rating <= 80) {
    return (
      <div>
        <img src={Panda80} />
      </div>
    );
  }

  return (
    <div>
      <img src={Panda100} />
    </div>
  );
}
