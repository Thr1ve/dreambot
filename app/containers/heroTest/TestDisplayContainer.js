import React from 'react';
import { connect } from 'react-redux';

const TestDisplayContainer = React.createClass({
  render() {
    const { displayedVolumes, delimiter, currentCollection } = this.props;
    return (
      <div>
        <pre>
          {`// Delimiter: ${delimiter}  `}
          <br />
          {`// # of Displayed Chunks: ${displayedVolumes.length}  `}
          <br />
          {
            displayedVolumes.map((v, i) => (
              <span key={i}>
                {
                  v && v.loading ?
                    <span> Loading... </span> :
                    `${currentCollection[i]}: ${v === undefined ? '' : JSON.stringify(v.val)}`
                }
                <br />
              </span>
            ))
          }
        </pre>
      </div>
    );
  }
});

function mapStateToProps(state) {
  const { delimiter, currentCollection, volumes } = state.channelActivity;
  return {
    delimiter: delimiter,
    currentCollection: currentCollection,
    displayedVolumes: Array.from({ length: currentCollection.length }, (v, i) => {
      const dateKey = currentCollection[i];
      return volumes[delimiter][dateKey];
    })
  };
}

export default connect(mapStateToProps)(TestDisplayContainer);
