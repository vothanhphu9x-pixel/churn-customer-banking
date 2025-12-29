import React from "react";

export function Input(props: any) {
  const { className = "", ...rest } = props;
  return <input className={"border px-2 py-1 " + className} {...rest} />;
}

export default Input;
