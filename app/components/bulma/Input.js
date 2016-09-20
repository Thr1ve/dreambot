import React, { PropTypes } from 'react';

const Input = ({ placeholder, type, onChange, value, name }) => (
  <input
    onChange={function (e) {
      const { name, value } = e.target;
      onChange({ name, value });
    }}
    className="input"
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
  />
);

Input.defaultProps = {
  type: 'text'
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ])
};

export default Input;
