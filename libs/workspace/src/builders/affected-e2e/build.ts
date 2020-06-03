/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  BuilderContext,
  BuilderOutput,
  targetFromTargetString,
} from '@angular-devkit/architect';
import { AffectedE2EOptions } from './schema';
import { Observable, from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { green } from 'chalk';
import { readNxJson } from '@nrwl/workspace';
import { affectedArgs } from '../../scripts/affected-args';
import { getAffectedProjects } from '../../scripts/util';
import { findE2eModulesUsingAffectedComponents } from './utils/find-modules-using-affected-components';
import { join } from 'path';
import { transformModulePathToGlob } from './utils/transform-module-path-to-glob';

/**
 * Custom builder for the web-components package builder.
 * This builder will schedule and run all projects that are tagged
 * with a given tag in the nx.json. It is primarily used to run and package
 * the web-components part of the library.
 */
export function affectedE2EBuilder(
  options: AffectedE2EOptions,
  context: BuilderContext,
): Observable<BuilderOutput> {
  context.logger.info(
    green(
      `Running only affected E2E tests for components, to run all use ng run components-e2e:e2e-all`,
    ),
  );
  return from(affectedArgs()).pipe(
    map((baseSha) => {
      // Figure out which projects are affected in this one.
      const projects = getAffectedProjects(baseSha);
      const nxJson = readNxJson();
      // Figure out which of the affected projects are actually components.
      const affectedComponents = projects.filter((component) => {
        return (nxJson.projects[component].tags || []).includes(
          'scope:components',
        );
      });
      return affectedComponents;
    }),
    switchMap((affectedComponents) => {
      return findE2eModulesUsingAffectedComponents(
        affectedComponents,
        join(context.workspaceRoot, options.testAppSourceFolder),
      );
    }),
    switchMap((affectedTestModules) => {
      const globSource = affectedTestModules.map((affectedModule) =>
        join(
          options.testAppSourceFolder,
          transformModulePathToGlob(affectedModule),
        ),
      );
      context.logger.info(`
Running e2e tests matching the following globs
${globSource.map((comp) => `- ${comp}`).join('\n')}
`);
      const e2eTarget = targetFromTargetString(options.e2eTarget);
      return context.scheduleTarget(e2eTarget, { src: globSource });
    }),
    // Wait for the output and result Observable to resolve
    switchMap((build) => forkJoin(build.output, build.result)),
    // Switch over to the result of the e2e target
    map((results) => results[1]),
  );
}
