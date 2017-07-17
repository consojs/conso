// Conso' application generator
const {resolve} = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const program = require('commander');

class Generator {
    constructor() {
        this.program = program;
        this.templateDir = resolve(__dirname, '..', 'templates');

        this.program
            .version(require('../package.json').version)
            .usage('init [option]')
            .option('-v, --view <view>', 'set view dir', './view')
            .option('-e, --engine <engine>', 'set view engine', 'hbs')
            .option('-p, --public <engine>', 'set public dir', './public')
            .option('-d, --database <database>', 'set database engine', 'mongodb')
            .option('-dn, --dbname <dbname>', 'set database name', 'db_conso')
            .option('-r, --routes <routes>', 'set routes dir', './routes')
            .option('-c, --config <file>', 'set config file', 'webConfig.json')
            .option('-f --force', 'set config file');

        this.program
            .command('init <projectName>')
            .description('Create a new conso project')
            .action(this.createApplication.bind(this));

        this.program.parse(process.argv);

        if (!this.program.args.length) {
            this.program.help()
        }
    }

    prompt(msg) {
        return new Promise((resolve, reject) => {
            process.stdout.write(msg);
            process.stdin.setEncoding('utf8');
            process.stdin.once('data', val => {
                resolve(val.trim());
            }).resume();
        })
    }

    getDefaultDatabasePort(db) {
        db = db.toLowerCase();
        if ('mongodb' === db) {
            return 27017;
        }
        if ('mysql' === db || 'mariadb' === db) {
            return 3306;
        }
        if ('oracle' === db) {
            return 1521;
        }
        if ('sqlserver' === db) {
            return 1433;
        }
        if ('postgresql' === db) {
            return 5432;
        }
        if ('db2' === db) {
            return 5000;
        }
        if ('redis' === db) {
            return 6379;
        }
        return 0;
    }

    launchedFromCmd() {
        return process.platform === 'win32' &&
            process.env._ === undefined
    }

    async createApplication(projectName) {
        this.projectName = projectName;
        this.project_path = resolve(projectName);

        if (fse.pathExistsSync(this.project_path)) {
            let p = await this.prompt('\n  destination is not empty, continue? [y/N]?');
            if (!/^y|yes|ok|true$/i.test(p)) {
                console.log(chalk.red('The wizard has been aborted'));
                return process.exit();
            }

            fse.mkdirsSync(this.project_path);
        }

        this.createTemplate();
    }

    createTemplate() {
        let params = this.program;

        console.log(chalk.green(`\n   √ create : ${this.project_path}`));

        // view
        fse.copySync(resolve(this.templateDir, './view'), resolve(this.project_path, './view'), {
            filter: (src, dest) => {
                if (new RegExp(params.engine + '|view$').test(src)) {
                    console.log(chalk.green(`   √ create : ${dest}`));
                    return true;
                }
                return false;
            }
        });

        // routes
        fse.copySync(resolve(this.templateDir, './routes'), resolve(this.project_path, './routes'), {
            filter: (src, dest) => {
                console.log(chalk.green(`   √ create : ${dest}`));
                return true;
            }
        });

        // module
        fse.copySync(resolve(this.templateDir, './module'), resolve(this.project_path, './module'), {
            filter: (src, dest) => {
                console.log(chalk.green(`   √ create : ${dest}`));
                return true;
            }
        });

        // public
        fse.copySync(resolve(this.templateDir, './public'), resolve(this.project_path, './public'), {
            filter: (src, dest) => {
                console.log(chalk.green(`   √ create : ${dest}`));
                return true;
            }
        });
        //..gitignore
        fse.copySync(resolve(this.templateDir, '.gitignore'), resolve(this.project_path, '.gitignore'), {
            filter: (src, dest) => {
                console.log(chalk.green(`   √ create : ${dest}`));
                return true;
            }
        });
        //app.js
        fse.copySync(resolve(this.templateDir, 'app.js'), resolve(this.project_path, 'app.js'), {
            filter: (src, dest) => {
                console.log(chalk.green(`   √ create : ${dest}`));
                return true;
            }
        });

        // package.json
        let pkg = {
            name: this.projectName,
            version: '0.0.0',
            private: true,
            scripts: {
                start: 'node app.js'
            },
            dependencies: {}
        };
        fse.outputJsonSync(resolve(this.project_path, 'package.json'), JSON.stringify(pkg, null, 2));
        console.log(chalk.green(`   √ create : ${resolve(this.project_path, 'package.json')}`));

        // webConfig.json
        let webConfig = {
            project: this.projectName,
            host: "localhost",
            port: 3000,
            public: params.public,
            encoding: "utf8",
            view: {
                engine: params.engine,
                ext: "." + params.engine,
                dir: params.view,
                cache: false,
                option: {}
            },
            DBConfig: {
                client: params.database,
                config: {
                    host: '127.0.0.1',
                    port: this.getDefaultDatabasePort(params.database),
                    // user: 'user',
                    // password: 'password',
                    database: params.dbname,
                }
            },
            annotations: {
                enable: true,
                basePackage: params.routes
            }
        };
        fse.outputFileSync(resolve(this.project_path, params.config), JSON.stringify(webConfig, null, 2));
        console.log(chalk.green(`   √ create : ${resolve(this.project_path, params.config)}`));

        const dot = this.launchedFromCmd() ? '>' : '$';
        console.log();
        console.log('   install dependencies:');
        console.log('     %s cd %s && npm install', dot, this.projectName);
        console.log();
        console.log('   run the app:');

        if (this.launchedFromCmd()) {
            console.log('     > SET DEBUG=%s:* & npm start', this.projectName)
        } else {
            console.log('     $ DEBUG=%s:* npm start', this.projectName)
        }

        process.exit();
    }
}


new Generator();