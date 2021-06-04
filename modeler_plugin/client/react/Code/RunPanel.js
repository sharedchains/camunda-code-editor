import React from 'camunda-modeler-plugin-helpers/react';

const RunPanel = props => {

  return (<div id="runPanel">
    <button className="run-button" onClick={props.runClicked}>Run</button>
    <button className="stop-button" onClick={props.stopClicked}>Stop</button>
  </div>);
};
export default RunPanel;