import React from 'react';
import { connect } from 'react-redux';

const Home = React.createClass({
  componentWillMount() {
  },

  render() {
    return (
      <div>
        Home
      </div>
    );
  }
});

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(Home);
