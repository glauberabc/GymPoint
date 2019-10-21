<h1 align="center">
  <img alt="Gympoint" title="Gympoint" src="https://github.com/matheusleandroo/gympoint/blob/master/src/img/gympoint_logo.png" width="200px" />
</h1>

<h3 align="center">
  A simple project to gym manager.
</h3>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes.

<h3>Prerequisites</h3>

<h4>NodeJS</h4>

You need to install NodeJS on your computer before you can use "**Gympoint**". You can install NodeJS by following <a href="https://nodejs.org/en/download/package-manager/" target="_blank">these instructions</a>.

Once you have completed the installation process, try typing **```npm -v```** into your command line. You should get a response with the version of NodeJS.

<h4>Yarn</h4>

Once you have NodeJs instaled, you need to install Yarn. You can install Yarn by following <a href="https://yarnpkg.com/en/docs/getting-started" target="_blank">these instructions</a>.

After instalition, try typing **```yarn -v```** into your command line. You should get a response with the version of Yarn.

<h4>Docker</h4>

You need to install Docker on your computer before you can use "**Gympoint**". You can install Docker by following <a href="https://www.docker.com/get-started" target="_blank">these instructions</a>.

Once you have completed the installation process, try typing **```docker -v```** into your command line. You should get a response with the version of Docker.

If you are using Linux distributions, is recommended following <a href="https://docs.docker.com/install/linux/linux-postinstall/" target="_blank">these instructions</a> to manage Docker as a non-root use.

<h4>PostgreSQL</h4>

You need to configure PostgreSQL on your computer before you can use "**Gympoint**". You can configure PostgreSQL by following <a href="https://hub.docker.com/_/postgres" target="_blank">these instructions</a>.

Some params:

<ul>
  <li>POSTGRES_DB=gympoint</li>
  <li>POSTGRES_USER=postgres</li>
  <li>POSTGRES_PASSWORD=c3e3e6298c626272b9f5210ffced152ab724ff9d</li>
</ul>

The final code:

```
docker run --name gympoint -e POSTGRES_DB=gympoint -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=c3e3e6298c626272b9f5210ffced152ab724ff9d -p 5432:5432 -d postgres:11

```

<h4>REST API Client</h4>

Finally, you will need a rest api client to test "**Gympoint**". Examples:

<ul>
  <li><a href="https://insomnia.rest/" target="_blank">Insomnia</a></li>
  <li><a href="https://www.getpostman.com/" target="_blank">Postman</a></li>
  <li><a href="https://install.advancedrestclient.com/install" target="_blank">Advanced REST Client</a></li>
</ul>

It is recommended to install the extension ESLint and edit the REST Api Client' settings:
```
  "files.eol": "\n",
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    {
      "language": "javascript",
      "autoFix": true
    },
    {
      "language": "javascriptreact",
      "autoFix": true
    },
    {
      "language": "typescript",
      "autoFix": true
    },
    {
      "language": "typescriptreact",
      "autoFix": true
    }
  ]
```

## Deploy

After clone repository:

- Run **`yarn`** to install dependencies;
- Run **`yarn sequelize db:migrate`** to creat the migrations;
- Run **`yarn sequelize db:seed:all`** to creat the seed;
- Run **`yarn dev`** to start de aplication.

Now you can use your REST API Client to test "**Gympoint**".

## Built With

<ul>
  <li>NodeJS</li>
  <li>Docker</li>
  <li>PostgreSQL</li>
</ul>

## Tools

<ul>
  <li>Sucrase + Nodemon;</li>
  <li>ESLint + Prettier + EditorConfig;</li>
  <li>Sequelize (PostgreSQL)</li>
</ul>

## Authors

<ul>
  <li>Glauber Alexandre</li>
</ul>

## License

This project is licensed under the MIT License - see the <a href="https://github.com/matheusleandroo/gympoint/blob/master/LICENSE" target="_blank">LICENSE.md</a> file for details.

Based on <a href="https://rocketseat.com.br/bootcamp" target="_blank">Rocketseat Bootcamp</a> :rocket:
