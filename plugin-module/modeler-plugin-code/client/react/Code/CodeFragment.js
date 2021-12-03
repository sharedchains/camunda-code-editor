import React, { Component, Fragment } from 'camunda-modeler-plugin-helpers/react';

import EditorModal from '../UI/EditorModal';

import { OPEN_CODE_EDITOR, SAVE_CODE_EDITOR } from '../../utils/EventHelper';
import { find } from 'lodash';

const defaultState = {
  modalOpen: false,
  element: null,
  node: null,
  type: 'javascript',
  data: null,
  inputParameters: null,
  cursor: null,
  modeler: null,
  tabModeler: []
};

/**
 * A React modal window for writing scripts inside Camunda Modeler
 */
export default class CodeFragment extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.closeModal = this.closeModal.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }

  /**
   * Lifecycle react component method for side-effect calls (async)
   */
  componentDidMount() {
    const {
      subscribe,
      displayNotification,
      triggerAction,
      config,
      log
    } = this.props;

    subscribe('codeEditor.config', async payload => {
      const { modeler } = this.state;
      if (modeler) {
        let editorActions = modeler.get('editorActions');

        let action = {};

        payload.java.forEach((path, index) => {
          let key = 'toggleJDK_' + (index + 1);
          action[key] = function() {
            config.setForPlugin('codeEditor', 'java', path).catch(log.error);
          };
        });

        editorActions.register(action);

      }
    });

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

    subscribe('bpmn.modeler.created', ({ modeler, tab }) => {
      this._eventBus = modeler.get('eventBus');

      const { tabModeler }
        = this.state;
      this.setState({
        modeler: modeler,
        tabModeler: [...tabModeler, { tabId: tab.id, modeler: modeler }]
      });


      this._eventBus.on(OPEN_CODE_EDITOR, (event) => {

        let inputParams = event['inputParameters'].map(item => {
          return { name: item.name,type:'',value:'' };
        });

        // Received command to open the editorModal for documentation
        this.setState({
          modalOpen: true,
          element: event.element,
          node: event.node,
          mode: event.mode,
          data: event.data,
          inputParameters: inputParams
        });
      });
    });

    subscribe('app.activeTabChanged', tab => {
      const {
        tabModeler
      } = this.state;
      let activeTabId = tab.activeTab.id;

      const activeModeler = find(tabModeler, { tabId: activeTabId });
      if (activeModeler) {
        this._eventBus = activeModeler.modeler.get('eventBus');
        this.setState({ modeler: activeModeler.modeler });
      }

      saveTab(tab);
    });

    subscribe('close-all-tabs', saveTab);
  }

  onEditorStateChange(editor, data, value) {
    this.setState({
      data: value,
      cursor: editor.getDoc().getCursor()
    });
  }

  closeModal() {
    let currentState = { ...this.state };
    const { element, node, data, modeler, tabModeler, inputParameters } = currentState;
    this._eventBus.fire(SAVE_CODE_EDITOR, {
      element, node, data, inputParameters
    });
    this.setState({
      ...defaultState, modeler, tabModeler
    });
  }

  /**
   * Rendering EditorModal fragment
   * @returns {JSX.Element}
   */
  render() {
    const { modalOpen, mode, data, cursor, inputParameters } = this.state;

    return <Fragment>
      {modalOpen && (
        <EditorModal onEditorChange={this.onEditorStateChange}
          close={this.closeModal} mode={mode} value={data} cursor={cursor}
          eventBus={this._eventBus} inputParameters={inputParameters}
          title='Script Editor'/>
      )}
    </Fragment>;
  }
}
