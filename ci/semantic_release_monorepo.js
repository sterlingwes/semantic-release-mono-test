const semanticReleaseNpm = require('@semantic-release/npm');
const semanticReleaseGit = require('@semantic-release/git');
const semanticReleaseGithub = require('@semantic-release/github');
const semanticReleasePrNotes = require('semantic-release-github-pr');
const semanticReleaseChanelog = require('@semantic-release/changelog');
const { analyzeCommits, generateNotes, tagFormat } = require('semantic-release-monorepo');

const noPublishNpmConfig = pluginConfig => ({
  ...pluginConfig,
  npmPublish: false,
});

const configure = context => ({
  ...context,
  options: {
    ...(context.options || {}),
    publish: [
      {
        path: '@semantic-release/npm',
        npmPublish: false,
      },
    ],
  },
});

const branchBuild = !!process.env.SEMANTIC_RELEASE_PR;

/**
 * default semantic-release plugins:
 *
 * @semantic-release/commit-analyzer
 * @semantic-release/release-notes-generator
 * @semantic-release/npm
 * @semantic-release/github
 */

console.log('branch build config:', branchBuild);

const executeSteps = (asyncSteps, pluginConfig, context) =>
  asyncSteps.reduce(
    (chain, step) =>
      chain.then(results => {
        const result = step(pluginConfig, context);
        return [...results, result];
      }),
    Promise.resolve([]),
  );

module.exports = {
  analyzeCommits: async (pluginConfig, context) => {
    const results = await executeSteps(analyzeCommits, pluginConfig, context);
    if (branchBuild) {
      const resolvedResults = await Promise.all(result);
      console.log('>> resolved results', resolvedResults);
      await semanticReleasePrNotes.impl.analyzeCommits(pluginConfig, context, resolvedResults);
    }
  },

  generateNotes: async (pluginConfig, context) => {
    const results = await executeSteps(generateNotes, pluginConfig, context);
    if (branchBuild) {
      await semanticReleasePrNotes.impl.generateNotes(pluginConfig, context, results);
    }
  },

  tagFormat,

  verifyConditions: async (pluginConfig, context) => {
    semanticReleaseGit.verifyConditions(pluginConfig, context);
    await semanticReleaseChanelog.verifyConditions(pluginConfig, context);
    await semanticReleaseNpm.verifyConditions(noPublishNpmConfig(pluginConfig), configure(context));
    await semanticReleaseGithub.verifyConditions(pluginConfig, context);
  },

  prepare: async (pluginConfig, context) => {
    await semanticReleaseChanelog.prepare(pluginConfig, context);
    await semanticReleaseNpm.prepare(noPublishNpmConfig(pluginConfig), configure(context));
    await semanticReleaseGit.prepare(pluginConfig, context);
  },

  publish: async (pluginConfig, context) => {
    await semanticReleaseNpm.publish(noPublishNpmConfig(pluginConfig), configure(context));
    await semanticReleaseGithub.publish(pluginConfig, context);
  },

  addChannel: async (pluginConfig, context) => {
    await semanticReleaseNpm.addChannel(noPublishNpmConfig(pluginConfig), configure(context));
  },
};
