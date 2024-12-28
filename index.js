#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
    .version('1.0.0')
    .description('My CLI Tool');

// Greet Command
program
    .command('greet <name>')
    .description('Greet a user')
    .action((name) => {
        console.log(`Hello, ${name}! Welcome to the CLI world.`);
    });

// Organize Command
program
    .command('organize <targetDir>')
    .description('Organize files in a directory by their extensions')
    .action((targetDir) => {
        const absoluteTargetDir = path.resolve(targetDir);

        if (!fs.existsSync(absoluteTargetDir)) {
            console.error(`Error: Directory "${absoluteTargetDir}" does not exist.`);
            process.exit(1);
        }

        fs.readdir(absoluteTargetDir, (err, files) => {
            if (err) {
                console.error(`Error reading the directory: ${err.message}`);
                process.exit(1);
            }

            files.forEach((file) => {
                const ext = path.extname(file).slice(1);
                if (!ext) return;

                const folder = path.join(absoluteTargetDir, ext);
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder);
                }

                const oldPath = path.join(absoluteTargetDir, file);
                const newPath = path.join(folder, file);
                fs.renameSync(oldPath, newPath);
            });

            console.log(`Organized files in "${absoluteTargetDir}"`);
        });
    });

program.parse(process.argv);
