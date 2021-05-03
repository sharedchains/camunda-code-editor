import React, { useState, useEffect, useRef } from 'camunda-modeler-plugin-helpers/react';

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

import executeCode from '../../utils/executor';
import logger from '../../utils/console';
import { STOP_CODE_EDITOR } from '../../utils/EventHelper';

window.JSHINT = JSHINT;
window.jsonlint = jsonlint;

const CodeEditor = props => {

  const [editor, setEditor] = useState(null);
  const consoleResultRef = useRef(null);

  let clearConsoleRef = null;
  let addToConsoleRef = null;

  useEffect(() => {
    const { clearConsole, addToConsole } = logger(consoleResultRef.current);
    clearConsoleRef = clearConsole;
    addToConsoleRef = addToConsole;
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
    let contextObject = JSON.parse(props.context);
    let contextOption;
    if (contextObject.context) {
      contextOption = contextObject.context;
    } else if (contextObject instanceof Array) {
      throw new Error('Context must be a JSON object which contains variable names');
    } else {
      contextOption = contextObject;
    }
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
    if (editor) {
      editor.openNotification(error.message, { duration: 2000 });
    }
  }

  return (<div className='ScriptEditor-container'>
    <h4 className='contextTitle'>Context variables</h4>
    <CodeMirror
      className='contextEditor'
      editorDidMount={ed => {
        setEditor(ed);
      }}
      onBeforeChange={props.onContextChange}
      cursor={props.contextCursor}
      value={props.context}
      options={{
        mode: {
          name: 'javascript',
          json: true,
          context: {}
        },
        theme: 'material',
        lineNumbers: true,
        keyMap: 'sublime',
        autoCloseTags: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        autoCursor: false,
        autoScroll: false,
        highlightSelectionMatches: { minChars: 2, showToken: true },
        lineWrapping: true,
        lint: true,
        gutters: ['CodeMirror-lint-markers'],
        extraKeys: {
          'Space': function(cm) {
            cm.replaceSelection(' ');
          }
        },
      }}
    />
    <h4 className='codeTitle'>Script</h4>
    <div className='CodeEditor-container'>
      <CodeMirror
        className='CodeEditor'
        value={props.value}
        options={scriptOptions}
        onBeforeChange={props.onEditorChange}
        cursor={props.cursor}
        editorDidMount={ed => {

          let runPanel = document.createElement('div');
          runPanel.id = 'runPanel';
          runPanel.className = 'panel top';

          let run = runPanel.appendChild(document.createElement('a'));
          run.setAttribute('id', 'run');
          run.setAttribute('title', 'Run!');
          run.setAttribute('class', 'run-button');
          run.textContent = 'Run';

          run.onclick = function(event) {
            event.preventDefault();

            clearConsoleRef('');
            if (props.mode === 'javascript') {
              executeCode(ed.getValue(), { log: addToConsoleRef, clear: clearConsoleRef }, props.eventBus);
            }
          };

          let stop = runPanel.appendChild(document.createElement('a'));
          stop.setAttribute('id', 'stop');
          stop.setAttribute('title', 'Stop!');
          stop.setAttribute('class', 'stop-button');
          stop.textContent = 'Stop';

          stop.onclick = function(event) {
            props.eventBus.fire(STOP_CODE_EDITOR);
          };

          ed.addPanel(runPanel, { position: 'top', stable: true });
        }}
      />
      <div className='RunningResult'>
        <div id='ResultBox' className='Result-box' ref={consoleResultRef}/>
      </div>
    </div>
  </div>);

};

export default CodeEditor;