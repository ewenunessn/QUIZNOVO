const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Resolver problemas com TurboModules
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;