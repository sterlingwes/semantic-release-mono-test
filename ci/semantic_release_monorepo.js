const semanticReleaseNpm = require('@semantic-release/npm')
const semanticReleaseGit = require('@semantic-release/git')
const {analyzeCommits, generateNotes, tagFormat} = require('semantic-release-monorepo')

const noPublishNpmConfig = (pluginConfig) => ({
  ...pluginConfig,
  npmPublish: false
})

const configure = (context) => ({
  ...context,
  options: {
    ...context.options || {},
    publish: [
      {
        path: '@semantic-release/npm',
        npmPublish: false
      }
    ]
  }
})

/**
 * default semantic-release plugins:
 * 
 * @semantic-release/commit-analyzer
 * @semantic-release/release-notes-generator
 * @semantic-release/npm
 * @semantic-release/github
 */

module.exports = {
  analyzeCommits,
  generateNotes,
  tagFormat,

  verifyConditions: async (pluginConfig, context) => {
    semanticReleaseGit.verifyConditions(pluginConfig, context);
    await semanticReleaseNpm.verifyConditions(noPublishNpmConfig(pluginConfig), configure(context))
  },

  prepare: async (pluginConfig, context) => {
    await semanticReleaseNpm.prepare(noPublishNpmConfig(pluginConfig), configure(context))
    await semanticReleaseGit.prepare(pluginConfig, context);
  },

  publish: async (pluginConfig, context) => {
    await semanticReleaseNpm.publish(noPublishNpmConfig(pluginConfig), configure(context))
  },

  addChannel: async (pluginConfig, context) => {
    await semanticReleaseNpm.addChannel(noPublishNpmConfig(pluginConfig), configure(context))
  },
}
