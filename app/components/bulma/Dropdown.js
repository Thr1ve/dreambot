import React, { PropTypes } from 'react';

const Dropdown = ({ children, onChange, label }) => (
  <span>
    <label className="label"> {label} </label>
    <p className="control">
      <span className="select">
        <select onChange={onChange}>
          {children}
        </select>
      </span>
    </p>
  </span>
);

Dropdown.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
};

export default Dropdown;
