module.exports = {
    apps: [
        {
            script: "index.js",
            watch: ".",
            name: "cluster_app",
            ignore_watch: ["text_million.txt"],
            instances: 2,
            exec_mode: "cluster",
        },
    ],

    deploy: {
        production: {
            user: "SSH_USERNAME",
            host: "SSH_HOSTMACHINE",
            ref: "origin/master",
            repo: "GIT_REPOSITORY",
            path: "DESTINATION_PATH",
            "pre-deploy-local": "",
            "post-deploy":
                "npm install && pm2 reload ecosystem.config.js --env production",
            "pre-setup": "",
        },
    },
};
