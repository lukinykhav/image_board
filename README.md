ImageBoard
==========

How to start with development
-----------------------------

###Installation

1. install [nodejs]
2. install [express.js]
3. install [mongoDB]
4. install [git]
5. clone repo:
```sh
$ git clone git://github.com/lukinykhav/image_board
$ cd image_board
```

###Development

Execute command npm install for installing dependencies:
```sh
$ npm install
```
Install gulp globally with command:
```sh
$ npm install gulp -g
```
Open the gulpfile.js and take a look the available tasks and run one of them, for example
```sh
$ gulp watch
```

###Running project

```sh
$ npm start
```

```sh
$ DEBUG=imageBoard:* npm start
```

Contacts
--------

Author: Anna Lukinykh, Crystalnix

<alukinykh@crystalnix.com>


[nodejs]: <https://nodejs.org/en/download/>
[express.js]: <http://expressjs.com/en/starter/installing.html>
[mongoDB]: <https://docs.mongodb.org/manual/installation/>
[git]: <https://git-scm.com/book/en/v2/Getting-Started-Installing-Git>