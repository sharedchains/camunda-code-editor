import React from 'camunda-modeler-plugin-helpers/react';
import { Modal } from 'camunda-modeler-plugin-helpers/components';

import CodeEditor from '../Code/CodeEditor';

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

const editorModal = (props) => {

  return <Modal onClose={props.close} className="editorModal">
    <Title>{props.title}</Title>
    <Body>
      <form id="editorForm" onSubmit={props.close}>
        <CodeEditor {...props}/>
      </form>
    </Body>
    <Footer>
      <div id="editorModalButtons">
        <button type="submit" className="btn btn-secondary" form="editorForm">Close</button>
      </div>
    </Footer>
  </Modal>;
};

export default editorModal;