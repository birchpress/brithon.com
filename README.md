## How to run locally
1. make sure the password of `root` for mysql on localhost is empty
2. create a database named `brithon`
3. download [Google App Engine SDK for PHP](https://cloud.google.com/appengine/downloads?hl=en) and install it
4. `cd` the repo dir and run 'npm install'
5. run `gulp bundle` and the `app` dir will be created.
6. run `dev_appserver.py app`
7. visit `http://localhost:8080` to go through the wp installation. 
