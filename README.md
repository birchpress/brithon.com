# Usage

## How to build
```shell
$ gulp clean
$ gulp {action} [--environment {environments}]
```

* {action}:  `[build | deploy]`.
  + `build`: builds release package in `app`.
  + `deploy`: deploy to GAE.
* {environments}: `[local | dev | prod]`. Default: `local`
  + `local`: local development version.
  + `dev`: developement version deployed on GAE.
  + `prod`: production version on GAE.

**NOTE**: the release packages of `local` and `production` are the same, while the `application` in `app.yaml` is updated automatically for `development` and all other files remain the same.

## How to run locally
1. Add the following line to your `/etc/hosts` (for Windows, it's `%systemroot%\system32\drivers\etc\hosts`)

  > 127.0.0.1 www-local.brithon.com
1. Install MySQL 5.5+ and make sure the password of `root` on `localhost` is empty.
1. Create a database named `brithon_www`.

  ```shell
$ echo 'CREATE DATABASE brithon_www;' | mysql -u root
  ```
1. Download and install [Google App Engine SDK for PHP](https://cloud.google.com/appengine/downloads).
1. Clone this repo and `cd` into the working dir.
1. Run `npm install`.
1. Run `gulp build` and the `app` dir will be created.
1. Start the service with `npm start`.
1. Visit `http://www-local.brithon.com:8080` to go through the wp installation.
