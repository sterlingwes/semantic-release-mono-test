const semanticReleaseNpm = require('@semantic-release/npm')
const monorepoConfig = require('semantic-release-monorepo')

const addNoPublish = (context) => ({
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
    await semanticReleaseNpm.verifyConditions(pluginConfig, addNoPublish(context))
  },

  prepare: async (pluginConfig, context) => {
    await semanticReleaseNpm.prepare(pluginConfig, addNoPublish(context))
  },

  publish: async (pluginConfig, context) => {
    await semanticReleaseNpm.publish(pluginConfig, addNoPublish(context))
  },

  addChannel: async (pluginConfig, context) => {
    await semanticReleaseNpm.addChannel(pluginConfig, addNoPublish(context))
  },
}