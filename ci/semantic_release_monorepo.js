const semanticReleaseNpm = require('@semantic-release/npm')
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

module.exports = {
  ...monorepoConfig,

  verifyConditions: async (pluginConfig, context) => {
    await semanticReleaseNpm.verifyConditions(noPublishNpmConfig(pluginConfig), noPublishContext(context))
  },

  prepare: async (pluginConfig, context) => {
    await semanticReleaseNpm.prepare(noPublishNpmConfig(pluginConfig), noPublishContext(context))
  },

  publish: async (pluginConfig, context) => {
    await semanticReleaseNpm.publish(noPublishNpmConfig(pluginConfig), noPublishContext(context))
  },

  addChannel: async (pluginConfig, context) => {
    await semanticReleaseNpm.addChannel(noPublishNpmConfig(pluginConfig), noPublishContext(context))
  },
}