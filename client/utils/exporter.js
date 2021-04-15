import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { query } from 'min-dom';

import { DIAGRAM_FLOW } from './exportUtils';

/*
* Expecting a hierarchy array already sorted in the order we want the documentation to be exported.
* Each element of the array is an object node from bpmn-js
* */
const exporter = (hierarchy, flowType, canvas, svgImage) => {
  let docIndexes = '<div class="documentationIndexes"><h1>INDEXES</h1>';
  let docHierarchy = '<div class="documentationContainer"><h1>ELEMENTS</h1>';
  let canvasImage = `<div class="canvasContainer">${svgImage}</div>`;

  function getElementDocumentation(businessObject) {
    return businessObject.get('documentation').length > 0 ? businessObject.get('documentation')[0].get('text') : '';
  }

  function getElementExtendedDocumentation(businessObject) {
    return businessObject && businessObject.extendedDocumentation ? businessObject.extendedDocumentation : '';
  }

  function getElementIcon(element) {
    let width = Math.ceil(element.width / 10) * 10;
    let height = Math.ceil(element.height / 10) * 10;
    let canvasElement = query(`g[data-element-id="${element.id}"] > .djs-visual`, canvas.getContainer());
    canvasElement = canvasElement.cloneNode(true);
    let icon = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${canvasElement.outerHTML}</svg>`;
    return icon;
  }

  hierarchy.forEach(element => {
    const bo = getBusinessObject(element);
    const elementId = element.id;
    const elementName = bo.get('name');
    const elementType = bo.$type;

    if (flowType === DIAGRAM_FLOW && elementType === 'bpmn:StartEvent') {
      let parentBo = getBusinessObject(element.parent);
      const parentId = parentBo.get('id');
      const parentName = parentBo.get('name');

      // Check if it's a collaboration or something else, to add other markup
      if (is(parentBo, 'bpmn:Participant')) {
        docIndexes += `<h2 class="participant"><a href="#${parentId}">${parentName || parentId}</a></h2>`;
        let docParentText = getElementDocumentation(parentBo) + '<br />' + getElementExtendedDocumentation(parentBo);

        // Getting other documentation from process
        const processDocumentation = getElementDocumentation(bo.$parent) + '<br />' + getElementExtendedDocumentation(bo.$parent);
        docParentText += processDocumentation.trim() ? `<br>${processDocumentation}` : '';
        docHierarchy += `<div class="documentationElement participant" id="container-${parentId}"><h2><a name="${parentId}"></a><span class="bpmn-icon-participant"></span>&nbsp;${parentName || parentId}</h2>${docParentText}</div>`;
      } else {
        docIndexes += `<h2 class="process"><a href="#${parentId}">${parentName || parentId}</a></h2>`;
        let docProcessText = getElementDocumentation(parentBo) + '<br />' + getElementExtendedDocumentation(parentBo);
        docHierarchy += `<div class="documentationElement process" id="container-${parentId}"><h2><a name="${parentId}"></a>&nbsp;${parentName || parentId}</h2>${docProcessText}</div>`;
      }
    }
    const icon = getElementIcon(element);
    const anchorLink = `<a href="#${elementId}">${elementName || elementId}</a><br/>`;
    docIndexes += anchorLink;
    const docText = getElementDocumentation(bo) + '<br />' + getElementExtendedDocumentation(bo);
    const anchoredText = `<div class="documentationElement" id="container-${elementId}"><h2><a name="${elementId}"></a>${icon}&nbsp;${elementName || elementId}</h2>${docText}</div>`;
    docHierarchy += anchoredText;
  });

  let getDocumentation = function() {
    return canvasImage + docIndexes + '</div>' + docHierarchy + '</div>';
  };

  let exportDocumentation = function() {
    return `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Documentation</title>
    
    <link rel="stylesheet" type="text/css" href="https://rawcdn.githack.com/bpmn-io/bpmn-font/master/dist/css/bpmn.css" />
    <style>
        h1, h2 {
            text-align: center;
        }
        
        .documentationIndexes {
            margin: 10px 10% auto;
        }
        
        .documentationElement {
            width: 80%;
            border: 1px solid #eee;
            box-shadow: 0 2px 3px #ccc;
            padding: 10px;
            margin: 10px auto;
            box-sizing: border-box;
        }
        
    </style>
</head>
<body>
    ${getDocumentation()}
</body>`;
  };

  return {
    'export': exportDocumentation
  };
};

export default exporter;