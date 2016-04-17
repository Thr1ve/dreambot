import React from 'react';
import { connect } from 'react-redux';

// These will need to be adjusted depending on the kind of volume the graph is dealing with
// i.e. It's how high the "line" will be and will need to be lowered when dealing with more messages
const ranges = {
  HOURS: 25,
  DAYS: 5,
  MONTHS: 0.3,
  YEARS: 0.1,
};

const TestGraphContainer = React.createClass({
  doAThing() {
    console.log('Hai thur');
  },

  // each data point should have two states: one for when it's loading, the second for when it's done.
  render() {
    const { currentCollection, delimiter, displayedVolumes } = this.props;
    const { length } = currentCollection;
    const lineData = Array
      .from({ length }, (val, i) =>
        ({
          x: (100 / length) * i,
          y: !displayedVolumes[i].val ? false : 100 - displayedVolumes[i].val * ranges[delimiter],
        }))
      .filter(({ y }) => y)
      .map(({ x, y }, i) => `${x}, ${y}`);
    return (
      <div>
        <svg viewBox="0 0 100 100" height="400" width="400">
          <g strokeWidth="0.4" onClick={this.doAThing}>
            {
              Array.from({ length }, (val, i) =>
                ({
                  x1: (100 / length) * i,
                  y1: 100,
                  x2: (100 / length) * i,
                  y2: !displayedVolumes[i].val ?
                    99.5 :
                    100 - displayedVolumes[i].val * ranges[delimiter],
                }))
              .map(({ x1, y1, x2, y2 }, i) =>
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#69707a" />)
            }
            <polyline points={lineData} fill="none" stroke="#f68b39" />
          </g>
        </svg>
      </div>
    );
  }
});

function mapStateToProps(state) {
  const { currentCollection, delimiter, volumes } = state.channelActivity;
  return {
    displayedVolumes: Array.from({ length: currentCollection.length }, (v, i) => {
      const dateKey = currentCollection[i];
      return volumes[delimiter][dateKey];
    }),
    currentCollection,
    delimiter
  };
}

export default connect(mapStateToProps)(TestGraphContainer);


