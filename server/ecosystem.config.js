module.exports = {

    apps: [{
        name: "PACS",
        script: "app.js",
        append_env_to_name: false,
        env: {
            COMMON_VARIABLE: "true",
        },
        env_development: {
            NODE_ENV: "development"
        },
        env_testing: {
            NODE_ENV: "testing"
        },
        env_production: {
            NODE_ENV: "production"
        },
        watch: true,
        ignore_watch: ["node_modules", "public", "uploads", "views", "log", ".git", ".gitignore", "README.md"],
        merge_logs: true,
        error_file: "log/err.log",
        out_file: "log/out.log"
    }],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        production: {
            user: "ubuntu",
            host: "13.59.156.24",
            key: "/home/toobler/Documents/keys/DCM4CHEE.pem",
            ref: "origin/master",
            repo: "https://github.com/weklica/PACS_RIS.git",
            path: '/home/ubuntu/PACS_RIS',
            "post-deploy": "sudo yarn && sudo pm2 startOrRestart /home/ubuntu/PACS_RIS/ecosystem.config.js --log --env production",
            env: {
                NODE_ENV: "production"
            }
        },
        testing: {
            user: "ubuntu",
            host: "13.59.156.24",
            key: "/home/toobler/Documents/keys/DCM4CHEE.pem",
            ref: "origin/development",
            repo: "https://github.com/weklica/PACS_RIS.git",
            path: '/home/ubuntu/PACS_RIS',
            "post-deploy": "sudo yarn && sudo pm2 startOrRestart /home/ubuntu/PACS_RIS/ecosystem.config.js --log --env testing",
            env: {
                NODE_ENV: "testing"
            }
        },
        development: {
            user: "toobler",
            host: "127.0.0.1",
            key: "/home/toobler/Documents/keys/DCM4CHEE.pem",
            ref: "origin/development",
            repo: "https://github.com/weklica/PACS_RIS.git",
            path: "/home/toobler/sites/PACS_RIS",
            "post-deploy": "sudo yarn && sudo pm2 startOrRestart /home/toobler/sites/dcm4chee/ecosystem.config.js --env development",
            env: {
                NODE_ENV: "development"
            }
        }
    }
};