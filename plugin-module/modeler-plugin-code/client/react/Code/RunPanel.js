import React from 'camunda-modeler-plugin-helpers/react';

/**
 * Functional component for the run/stop buttons section
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const RunPanel = props => {

  return (<div id="runPanel">
    <button type="button" className="run-button" onClick={props.runClicked}>Run</button>
    <button type="button" className="stop-button" onClick={props.stopClicked}>Stop</button>
  </div>);
};
export default RunPanel;