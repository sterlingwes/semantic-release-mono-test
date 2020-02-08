const semanticReleaseNpm = require('@semantic-release/npm')
const semanticReleaseGit = require('@semantic-release/git')
const monorepoConfig = require('semantic-release-monorepo')

const noPublishNpmConfig = (pluginConfig) => ({
  ...pluginConfig,
  npmPublish: false
})

const noPublishContext = (context) => ({
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
  ...monorepoConfig,

  verifyConditions: async (pluginConfig, context) => {
    semanticReleaseGit.verifyConditions(pluginConfig, context);
    await semanticReleaseNpm.verifyConditions(noPublishNpmConfig(pluginConfig), noPublishContext(context))
  },

  prepare: async (pluginConfig, context) => {
    await semanticReleaseGit.prepare(pluginConfig, context);
    await semanticReleaseNpm.prepare(noPublishNpmConfig(pluginConfig), noPublishContext(context))
  },

  publish: async (pluginConfig, context) => {
    await semanticReleaseNpm.publish(noPublishNpmConfig(pluginConfig), noPublishContext(context))
  },

  addChannel: async (pluginConfig, context) => {
    await semanticReleaseNpm.addChannel(noPublishNpmConfig(pluginConfig), noPublishContext(context))
  },
}