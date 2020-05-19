const { resolve } = require('path');

module.exports = {
  name: 'button',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/button',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  //setupFilesAfterEnv: ['./test-setup.js'],
  //rootDir: resolve("bazel-out/k8-fastbuild/bin/libs/barista-components/button")
};
