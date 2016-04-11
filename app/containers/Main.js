import React from 'react';
import GlobalNotifications from './GlobalNotifications';

const Main = React.createClass({
  render() {
    const NotificationsStyleMap = {
      error: 'is-danger',
      warning: 'is-warning',
      info: 'is-info',
      success: 'is-success',
      primary: 'is-primary'
    };

    return (
      <div>
        <GlobalNotifications styleMap={NotificationsStyleMap} />
        {this.props.children}
      </div>
    );
  }
});

export default Main;
