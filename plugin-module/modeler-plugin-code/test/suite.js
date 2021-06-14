/**
 * @license
 * Copyright 2014-present Camunda Services GmbH
 * SPDX-License-Identifier: MIT
 */
var allTests = require.context('.', true, /Spec\.js$/);

allTests.keys().forEach(allTests);