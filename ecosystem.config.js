module.exports = {
    apps: [
        {
            name: 'triphaat-bo-web',
            script: './server.js',
            instances: 2,
            exec_mode: 'cluster',
            watch: false,
            ignore_watch: ['node_modules'],
        },
    ],
};
