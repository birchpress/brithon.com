## How to build
# Usage

```shell
$ gulp clean
$ gulp {action} [--env {environments}]
```

* {action}:  `[build | deploy]`.
  + `build`: builds release package in `app`.
  + `deploy`: deploy to GAE.
* {environments}: `[local | development | production]`. Default: `local`
  + `local`: local development version.
  + `development`: developement version deployed on GAE.
  + `production`: production version on GAE.

**NOTE**: the release packages of `local` and `production` are the same, while the `application` in `app.yaml` is updated automatically for `development` and all other files remain the same.

## How to run locally
1. make sure the password of `root` for mysql on `localhost` is empty.
2. create a database named `brithon`.
3. download [Google App Engine SDK for PHP](https://cloud.google.com/appengine/downloads?hl=en) and install it.
4. `cd` the repo dir and run 'npm install'.
5. run `gulp bundle` and the `app` dir will be created.
6. run `dev_appserver.py app`.
7. visit `http://localhost:8080` to go through the wp installation. 
