
import React from 'react';

const ChannelActivity = ({ volumes, keys }) => (
  <div>
    <ul> Available dates:
      {keys.map(date => <li> {date} </li>)}
    </ul>
    Hello world.
  </div>
);

export default ChannelActivity;
