import React, { PropTypes } from 'react';

const Dropdown = ({ children, onChange, label, value }) => (
  <span className="control">
    <label className="control label"> {label} </label>
    <p className="control">
      <span className="select">
        <select value={value} onChange={onChange}>
          {children}
        </select>
      </span>
    </p>
  </span>
);

Dropdown.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string
};

export default Dropdown;
