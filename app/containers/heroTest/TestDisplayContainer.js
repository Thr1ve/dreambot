import React from 'react';
import { connect } from 'react-redux';

const TestDisplayContainer = React.createClass({
  render() {
    const { volumes, delimiter, currentCollection, dateRange } = this.props;
    return (
      <div>
        <pre>
          {`// Delimiter: ${delimiter}  `}
          <br />
          {
            volumes.map((arr, i) => (
              <span key={i}>
                {
                  arr.loading ?
                    <span> Loading... </span> :
                    `${currentCollection[i]}: ${JSON.stringify(arr.data)}`
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
  const { delimiter, currentCollection, currentDateRange, volumes } = state.channelActivity;

  console.log(currentCollection);
  return {
    delimiter: delimiter,
    currentCollection: currentCollection,
    dateRange: currentDateRange,
    volumes: Array.from({ length: currentCollection.length }, (v, i) => {
      const dateKey = currentCollection[i];
      return volumes[delimiter][dateKey];
    })
  };
}

export default connect(mapStateToProps)(TestDisplayContainer);
