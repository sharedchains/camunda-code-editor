(function(mod) {
  if (typeof exports == 'object' && typeof module == 'object') // CommonJS
    mod(require('codemirror/lib/codemirror'), require('codemirror/mode/groovy/groovy'));
  // eslint-disable-next-line no-undef
  else if (typeof define == 'function' && define.amd) // AMD
    // eslint-disable-next-line no-undef
    define(['codemirror/lib/codemirror', 'codemirror/mode/groovy/groovy'], mod);
  else // Plain browser env
    // eslint-disable-next-line no-undef
    mod(CodeMirror);
})(function(CodeMirror) {
  'use strict';

  const Pos = CodeMirror.Pos;

  function forEach(arr, f) {
    let i = 0, e = arr.length;
    for (; i < e; ++i) f(arr[i]);
  }

  function arrayContains(arr, item) {
    if (!Array.prototype.indexOf) {
      let i = arr.length;
      while (i--) {
        if (arr[i] === item) {
          return true;
        }
      }
      return false;
    }
    return arr.indexOf(item) !== -1;
  }

  var stringProps = ('asType capitalize center contains count decodeBase64 denormalize eachLine eachMatch execute expand ' +
    'expandLine find findAll getAt getChars isAllWhitespace isBigDecimal isBigInteger isCase isDouble isFloat isInteger ' +
    'isLong isNumber leftShift matches minus multiply next normalize padLeft padRight plus previous readLines replaceAll ' +
    'replaceFirst reverse size split splitEachLine stripIndent stripMargin toBigDecimal toBigInteger toBoolean toFloat ' +
    'toInteger toList toLong toShort toURI toURL tokenize tr unexpand unexpandLine').split(' ');
  var listProps = ('add addAll any asBoolean asCollection asImmutable asList asSynchronized asType asUnmodifiable average ' +
    'bufferedIterator chop clear collate collect collectEntries collectMany collectNested combinations contains containsAll count countBy ' +
    'disjoint drop dropRight dropWhile each eachCombination eachPermutation eachWithIndex equals execute every find findAll ' +
    'findIndexOf findIndexValues findLastIndexOf findResult findResults first flatten get getAt getIndices grep groupBy ' +
    'hashCode head indexed indexOf inject init inits intersect isCase isEmpty iterator join last lastIndexOf leftShift listIterator max min minus multiply permutations plus ' +
    'pop push putAt remove removeAll removeAt removeElement removeLast retainAll reverse reverseEach set shuffle shuffled size ' +
    'sort split stream subList subsequences sum swap tail tails take takeRight takeWhile toArray toList toListString toSet toSorted toSpreadMap ' +
    'toUnique transpose unique withDefault withEagerDefault withIndex withLazyDefault').split(' ');
  var spinJsonNodeProps = ('append boolValue deleteProp elements fieldNames hasProp indexOf insertAfter insertAt insertBefore ' +
    'isArray isBoolean isNull isNumber isObject isString isValue jsonPath lastIndexOf numberValue prop remove removeAt ' +
    'removeLast stringValue value').split(' ');
  var spinXmlProps = ('append appendAfter appendBefore attr attrNames attrNs attrs childElement childElements hasAttr hasAttrNs ' +
    'hasNamespace hasPrefix mapTo name namespace prefix remove removeAttr removeAttrNs replace replaceChild textContent toString ' +
    'writeToWriter xPath').split(' ');
  var spinProps = ('JSON S XML getDataFormatName mapTo toString unwrap writeToWriter').split(' ');
  var groovyKeywords = ('def var class if else switch case default break throw for in while do try catch ' +
    'finally this super new void return interface enum public private abstract println import static as equals false true').split(' ');

  function getCompletions(token, context, keywords, options) {
    let found = [], start = token.string;

    function maybeAdd(str) {
      if (str.lastIndexOf(start, 0) === 0 && !arrayContains(found, str)) found.push(str);
    }
    function gatherCompletions(obj) {
      if (typeof obj == 'string') forEach(stringProps, maybeAdd);
      else if (obj instanceof Array) forEach(listProps, maybeAdd);
      else if (obj === 'SpinJsonNode') forEach(spinJsonNodeProps, maybeAdd);
      else if (obj === 'SpinXmlElement') forEach(spinXmlProps, maybeAdd);
    }

    if (context && context.length) {

      // If this is a property, see if it belongs to some object we can
      // find in the current environment.
      let obj = context.pop(), base;
      if (obj.type && obj.type.indexOf('variable') === 0) {
        if (options && options.additionalContext)
          base = options.additionalContext[obj.string];
        if (options && options.globalVars)
          base = base || options.globalVars[obj.string];
      } else if (obj.type === 'string') {
        base = '';
      } else if (obj.type === 'atom') {
        base = 1;
      }
      while (base != null && context.length)
        base = base[context.pop().string];
      if (base != null) gatherCompletions(base);
    } else {

      for (var v = token.state.localVars; v; v = v.next) maybeAdd(v.name);

      // If not, just look in the global object, any local scope, and optional additional-context
      if (options && options.additionalContext != null) {
        for (const key in options.additionalContext) {
          maybeAdd(key);
        }
      }
      forEach(spinProps, maybeAdd);
      forEach(keywords, maybeAdd);
    }
    return found;
  }

  function groovyHint(editor, options) {
    let cur = editor.getCursor(), token = editor.getTokenAt(cur);
    if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }
    const innerMode = CodeMirror.innerMode(editor.getMode(), token.state);
    token.state = innerMode.state;

    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      token = {
        start: cur.ch, end: cur.ch, string: '', state: token.state,
        type: token.string === '.' ? 'property' : null
      };
    } else if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }

    let tprop = token;

    // If it is a property, find out what it is a property of.
    let context = [];
    while (tprop.type === 'property') {
      tprop = editor.getTokenAt(Pos(cur.line, tprop.start));
      if (tprop.string !== '.') return;
      tprop = editor.getTokenAt(Pos(cur.line, tprop.start));
      context.push(tprop);
    }
    return {
      list: getCompletions(token, context, groovyKeywords, options),
      from: Pos(cur.line, token.start),
      to: Pos(cur.line, token.end)
    };
  }

  CodeMirror.registerHelper('hint', 'groovy', groovyHint);
});