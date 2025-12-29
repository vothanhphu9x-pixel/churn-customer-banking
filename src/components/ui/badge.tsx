import React from "react";

export function Badge(props: any) {
  const { children } = props;
  return (
    <span
      className={"inline-block px-2 py-0.5 rounded " + (props.className || "")}
    >
      {children}
    </span>
  );
}

export default Badge;
