// Conso' application generator
const fs = require('fs');
const {resolve} = require('path');
const program = require('commander');

program
    .version(require('../package.json').version)
    .usage('init [options]')
    .option('-v, --view <view>', 'set a view dir', './view')
    .option('-e, --engine <engine>', 'set a view engine', 'hbs')
    .option('-C, --controller <controller>', 'set a controller dir', './controller')
    .option('-c, --config <file>', 'set a config file', 'webConfig.js')
    .option('-f --force', 'set a config file');

program
    .command('init <projectName>')
    .description('Create a new conso project')
    .action(createApplication);

program.parse(process.argv);

if (!program.args.length) {
    program.help()
}

async function createApplication(projectName) {
    let {view, engine, controller, config, force} = program;
    let project_path = resolve(projectName);
    if (fs.existsSync(project_path)) {
        let prompt = await prompt('destination is not empty, continue? [y/N]?');
        if(prompt){

        }
    }
}

function prompt(msg) {
    return new Promise(function (resolve, reject) {
        process.stdout.write(msg);
        process.stdin.setEncoding('utf8');
        process.stdin.once('data', function (val) {
            resolve(val.trim());
        }).resume();
    })
}