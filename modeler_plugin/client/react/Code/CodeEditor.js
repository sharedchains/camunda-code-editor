import React, { useEffect, useRef, useState } from 'camunda-modeler-plugin-helpers/react';

import { encode } from 'js-base64';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/groovy/groovy';
import 'codemirror/mode/javascript/javascript';

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/addon/hint/xml-hint';
import './groovy-hint';

import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/json-lint';

import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/display/panel';
import 'codemirror/keymap/sublime';

import { JSHINT } from 'jshint';
import jsonlint from 'jsonlint-mod';

import JSExecutor from '../../utils/executors/JSExecutor';
import logger from '../../utils/console';
import { STOP_CODE_EDITOR } from '../../utils/EventHelper';
import ContextTable from './ContextTable';
import RunPanel from './RunPanel';
import GroovyAPI from '../../utils/executors/GroovyAPI';

window.JSHINT = JSHINT;
window.jsonlint = jsonlint;

const CodeEditor = props => {

  const [context, setContext] = useState([]);
  const [editor, setEditor] = useState(null);
  const [csl, setCsl] = useState(null);

  const consoleResultRef = useRef(null);

  useEffect(() => {
    const consoleRef = logger(consoleResultRef.current);
    setCsl(consoleRef);
  }, []);

  let mode = {
    name: props.mode,
    localVars: {

      // TODO: Variabili locali da definire - necessario per avere un contesto iniziale
      'JSON': 'SpinJsonNode',
      'XML': 'SpinXmlElement'
    },
    globalVars: {

      // TODO: Variabili globali da definire
      'JSON': 'SpinJsonNode',
      'XML': 'SpinXmlElement'
    }
  };
  if (props.mode === 'javascript') {
    mode.json = false;
  }

  let scriptOptions = {
    mode: mode,
    theme: 'material',
    lineNumbers: true,
    keyMap: 'sublime',
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
      'Space': function(cm) {
        cm.replaceSelection(' ');
      }
    },
    autoCloseTags: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    autoCursor: false,
    autoScroll: false,
    highlightSelectionMatches: { minChars: 2, showToken: true },
    lineWrapping: true,
    lint: true,
    gutters: ['CodeMirror-lint-markers']
  };
  try {

    // let contextObject = JSON.parse(props.context);
    // let contextOption;
    // if (contextObject.context) {
    //   contextOption = contextObject.context;
    // } else if (contextObject instanceof Array) {
    //   throw new Error('Context must be a JSON object which contains variable names');
    // } else {
    //   contextOption = contextObject;
    // }

    // TODO: Build the context variables table
    let contextOption = {};

    scriptOptions.hintOptions = {
      additionalContext: {
        ...contextOption
      },
      globalVars: {

        // TODO: Variabili globali da definire
        'JSON': 'SpinJsonNode',
        'XML': 'SpinXmlElement'
      }
    };
  } catch (error) {

    // if (editor) {
    //   editor.openNotification(error.message, { duration: 2000 });
    // }
    // TODO: Notify the user that something is not working on context
  }

  const addRow = () => {
    let newContext = context.concat({ name: '', type: '', value: '' });
    setContext(newContext);
  };

  const removeRow = (index) => {
    let copy = [...context];
    copy.splice(index, 1);
    setContext(copy);
  };

  const updateRow = (column, value, index) => {
    let copy = [...context];
    copy[index][column] = value;
    setContext(copy);
  };

  const runClicked = async (event) => {

    event.preventDefault();
    csl.clearConsole('');
    if (props.mode === 'javascript') {
      let jsExecutor = new JSExecutor(editor.getValue(), context, {
        log: csl.addToConsole,
        clear: csl.clearConsole
      }, props.eventBus);
      jsExecutor.execute();
    } else {

      // groovy
      const groovyExecutor = new GroovyAPI('http://localhost:12421');

      const base64 = encode(editor.getValue());
      const results = await groovyExecutor.executeGroovy({ code: base64, context: context });
      if (results.logs) {
        csl.addToConsole('LOGS:');
        csl.addToConsole(results.logs);
      }
      if (results.output) {
        csl.addToConsole('OUTPUT:');
        csl.addToConsole(results.output);
      } else {
        csl.addToConsole('ERROR:');
        csl.addToConsole(results.error);
      }
    }
  };

  const stopClicked = () => {
    props.eventBus.fire(STOP_CODE_EDITOR);
  };

  return (<div className="ScriptEditor-container">
    <h4 className="contextTitle">Context variables</h4>
    <ContextTable context={context}
      addRowContext={addRow}
      updateRowContext={updateRow}
      removeRowContext={removeRow}
    />

    <h4 className="codeTitle">Script</h4>
    <div className="CodeEditor-container">
      <CodeMirror
        className="CodeEditor"
        value={props.value}
        options={scriptOptions}
        onBeforeChange={props.onEditorChange}
        cursor={props.cursor}
        editorDidMount={ed => {
          setEditor(ed);
        }}
      />
      <RunPanel runClicked={runClicked} stopClicked={stopClicked} />
      <div className="RunningResult">
        <div id="ResultBox" className="Result-box" ref={consoleResultRef}/>
      </div>
    </div>
  </div>);

};

export default CodeEditor;