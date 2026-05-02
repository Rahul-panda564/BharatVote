/**
 * Mock for next/link used in Jest tests.
 * Renders a standard anchor tag with all passed props.
 */
import React from 'react';

const Link = ({ children, href, ...rest }) => (
  <a href={href} {...rest}>
    {children}
  </a>
);

export default Link;
