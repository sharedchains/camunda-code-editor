import React, { Component, Fragment } from 'camunda-modeler-plugin-helpers/react';

import EditorModal from '../UI/EditorModal';

import { OPEN_CODE_EDITOR, SAVE_CODE_EDITOR } from '../../utils/EventHelper';

const defaultState = {
  modalOpen: false,
  element: null,
  node: null,
  type: 'javascript',
  codeContext: '{ \n' +
    '  "context": {\n' +
    '  }\n' +
    '}',
  contextCursor: null,
  data: null,
  cursor: null
};

export default class CodeFragment extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.closeModal = this.closeModal.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onContextStateChange = this.onContextStateChange.bind(this);
  }

  componentDidMount() {
    const {
      subscribe,
      displayNotification,
      triggerAction
    } = this.props;

    const saveTab = ({ activeTab }) => {
      if (activeTab.file && activeTab.file.path) {

        // trigger a tab save operation
        triggerAction('save')
          .then(tab => {
            if (!tab) {
              return displayNotification({ title: 'Failed to save' });
            }
          });
      }
    };

    subscribe('bpmn.modeler.created', ({ modeler }) => {
      this._eventBus = modeler.get('eventBus');
      this._eventBus.on(OPEN_CODE_EDITOR, (event) => {

        // Received command to open the editorModal for documentation
        this.setState({
          modalOpen: true,
          element: event.element,
          node: event.node,
          mode: event.mode,
          data: event.data
        });
      });
    });

    subscribe('app.activeTabChanged', saveTab);
    subscribe('close-all-tabs', saveTab);
  }

  onContextStateChange(editor, data, value) {
    this.setState({ codeContext: value, contextCursor: editor.getDoc().getCursor() });
  }

  onEditorStateChange(editor, data, value) {
    this.setState({
      data: value,
      cursor: editor.getDoc().getCursor()
    });
  }

  closeModal() {
    let currentState = { ...this.state };
    const { element, node, data } = currentState;
    this.setState({
      ...defaultState
    });
    this._eventBus.fire(SAVE_CODE_EDITOR, {
      element, node, data
    });
  }

  render() {
    const { modalOpen, mode, data, cursor, codeContext, contextCursor } = this.state;

    return <Fragment>
      {modalOpen && (
        <EditorModal onContextChange={this.onContextStateChange} onEditorChange={this.onEditorStateChange}
          close={this.closeModal} mode={mode} value={data} cursor={cursor}
          context={codeContext} contextCursor={contextCursor}
          title='Script Editor'/>
      )}
    </Fragment>;
  }
}