import React from "react";
import { Dropdown } from "react-bootstrap";

export default function ItemSelector(props) {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {props.value}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {props.itemList.map((item) => {
          return (
            <Dropdown.Item
              onSelect={props.handleChange}
              eventKey={item}
              key={item}
            >
              {item}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
