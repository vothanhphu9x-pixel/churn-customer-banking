import React from "react";

export function Button(props: any) {
  const { children, className = "", ...rest } = props;
  return (
    <button className={"inline-flex items-center gap-2 " + className} {...rest}>
      {children}
    </button>
  );
}

export default Button;
