// Pill.js

import React from 'react';

const Pill = ({ text, color }) => {
  return (
    <span
      className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${color}`}
    >
      {text}
    </span>
  );
};

export default Pill;
