import Measure from "react-measure";
import React, { Component } from "react";

class ItemToMeasure extends Component {
  state = {
    dimensions: {
      width: -1,
      height: -1
    }
  };

  render() {
    const { width, height } = this.state.dimensions;

    return (
      <Measure
        bounds
        onResize={contentRect => {
          console.log("content rect bounds", contentRect.bounds);
          this.dimensions = contentRect.bounds;
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef} className="container">
            I can do cool things with my dimensions now :D
            {height > 250 && (
              <div>Render responsive content based on the component size!</div>
            )}
          </div>
        )}
      </Measure>
    );
  }
}

export default ItemToMeasure;
