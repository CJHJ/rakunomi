import React from "react";

export default function Emoji(props) {
  return <span>{String.fromCodePoint(props.symbol)}</span>;
}
