# Pro Web Core #

Repo containing all back-end logic and data access for my professional website. All unit tests can be found in [this repository](add link). 

### Requirements
1. MySQL Server
2. MySQL Workbench (for the model)
3. node.js
4. yarn
5. npx

### Contents
`src`
Contains all the typescript source code.
`data-model`
Contains the MySQL Workbench data model. This could be in another repository.

### Setup

Assuming all of the above requirements are met, the following commands are needed to create a working build. After a working build is established, the core can be referenced in other projects. 
1. `yarn install`
2. `yarn run build`

### Referencing in other projects
This project must be built to be referenced by your own hand. At this point there is no package in package management. Right now, I use the [pro-web-watcher repository]() to watch any new builds and copy the new build to yarn workspaces `node_modules` folder because that works better than `yarn link` for typescript projects but doesn't go as far as needing verdaccio or some other package managment solution for development.


There are 2 ways I know of to get a properly-working (with typescript type hinting) reference.
1. Add to some package manager whether it be public (npm, etc) or private (verdaccio, for example)
2. Use the [pro-web-watcher]() repository which will listen for changes to included repos and publish those changes to common yarn workspace `node_modules`


### Chat? ###
1. Open an issue
2. [Session Messenger](https://getsession.org/download/)
address: `0589f966e710b940904b19fea0ccd3cd1342086f15d69aa7adac8ce6d9abcf7b7a`