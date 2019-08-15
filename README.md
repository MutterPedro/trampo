# Trampo

Configurable job scheduler through well know file formats

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Build Status](https://travis-ci.org/MutterPedro/trampo.svg?branch=master)](https://travis-ci.org/MutterPedro/trampo)
[![Coverage Status](https://coveralls.io/repos/github/MutterPedro/trampo/badge.svg?branch=master)](https://coveralls.io/github/MutterPedro/trampo?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/7e7db5faf7981792b581/maintainability)](https://codeclimate.com/github/MutterPedro/trampo/maintainability)

### Prerequisities

To run Trampo you will just need to have Nodejs (at least version 8) and NPM installed on your local machine.

### Installing

You can install Trampo on your global scope:

```shell script
npm i -g trampo
```

Or you can run it directly using npx:

```shell script
npx trampo -F /path/to/config.json
```

### Config files

Trampo uses **JSON** files to run the jobs. For now, it has support for 2 kinds of jobs: **OneTimeJob** and **CronJob**.
They have very similar config files, the only thing that differentiates them, is that one-time job uses the **when** parameter
and the cron job uses the **period** parameter.

#### Command Execution

There are 2 things that Trampo can run on the jobs scheduled. It can make an **HTTP request** or execute a **command** on your
system.

HTTP Request:

```
{
  url: string;
  method: HttpMethod;
  headers?: object;
  body?: unknown;
  params?: object;
}
```

Exec:

```
{
  exec: string;
}
```

#### OneTimeJob Example

```json
{
  "when": 10000,
  "exec": "echo \"Hello World\"  >> test.txt ",
  "name": "One time job"
}
```

#### CronJobExample

```json
{
  "name": "Cron job",
  "httpRequest": {
    "url": "http://localhost:3000/home",
    "method": "get",
    "params": {
      "hello": "world"
    }
  },
  "period": "* * * * *"
}
```

#### Final config file

The final JSON config file that Trampo uses should have a **CronJob** or a **OneTimeJOb** or **both**,
wrapped in an array:

```json
[
  {
    "when": 10000,
    "exec": "echo \"Hello World\"  >> test.txt ",
    "name": "One time job"
  },
  {
    "name": "Cron job",
    "httpRequest": {
      "url": "http://localhost:3000/home",
      "method": "get",
      "params": {
        "hello": "world"
      }
    },
    "period": "* * * * *"
  }
]
```

### Running the jobs

To run the jobs using Trampo is easy like that, you build your JSON config file like explained above, they run passing
it as the argument:

```shell script
trampo -F /path/to/config.json

or

trampo --file /path/to/config.json
```

## Running the tests

Normal tests:

```shell script
npm run test
```

Tests with file watch:

```shell script
npm run test:tdd
```

Coverage test

```shell script
npm run test:coverage
```

## Building

```shell script
npm run build
```

## Built With

- Typescript
- Webpack

## Contributing

Please read [CONTRIBUTING.md](https://github.com/MutterPedro/trampo/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

- **Pedro Mutter** - _Initial work_ - [MutterPedro](https://github.com/MutterPedro)

See also the list of [contributors](https://github.com/mutterpedro/trampo/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
