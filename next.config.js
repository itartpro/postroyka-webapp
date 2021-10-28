module.exports = {
    swcMinify: true,
    images: {deviceSizes: [414, 1366, 1920]},
    webpackDevMiddleware: config => {
        config.watchOptions = {poll: 1000, aggregateTimeout: 300};
        return config
    }
}