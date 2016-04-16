import React from 'react';

import { Input } from '../../components/bulma';

const DateInputGroup = React.createClass({
  render() {
    const { data: { year, month, day, hour }, onChange } = this.props;
    const type = 'number';
    return (
      <div className="control is-grouped">
        <Input
          type={type}
          value={year}
          placeholder="year"
          name="year"
          onChange={onChange}
        />
        <Input
          type={type}
          value={month}
          placeholder="month"
          name="month"
          onChange={onChange}
        />
        <Input
          type={type}
          value={day}
          placeholder="day"
          name="day"
          onChange={onChange}
        />
        <Input
          type={type}
          value={hour}
          placeholder="hour"
          name="hour"
          onChange={onChange}
        />
      </div>
    );
  }
});

export default DateInputGroup;
