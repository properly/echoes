# README

Echoes is a platform for gathering feedback from clients on content destined for social networks.

## Technical Summary

Echoes is a ruby on rails app which utilizes sidekiq for processing of images emails etc. asynchronously.
The front-end is an angular 1 app which has been updated to use npm and webpack rather than bower+grunt.

It consists of
- mysql database
- redis
- ruby on rails app
- ruby sidekiq worker

We ran this on aws elastic beanstalk this but would pick a docker based solution today.

### Development setup
The provided docker-compose file installs gems automatically but does not create/migrate the database, nor
installs the dependencies for compiling the frontend.

    # Install frontend dependencies (only needed on initial setup)
    docker-compose run --rm frontend npm i

    # Migrate the database (only needed on initial setup)
    $ docker-compose run --rm web bin/rails db:migrate RAILS_ENV=development

    # Start docker containers
    $ docker-compose up

It'll take a few moments for the containers to start, install the dependencies, compile the frontend and the 
application to boot. Once all is ready the app should be accessible at `localhost:3000`

### Tests
Backend tests can be executed with 

    docker-compose run web bundle exec rake spec
    
Frontend tests can be executed with, dependencies for pupeteer are not included in the node Dockerfile. (PR welcome)

    npm run test

## Setting up

- Set url of uploads folder (configured for carrierwave) in `ng/app/scripts/app.js`

- Set allowed origins in `config/environments/production.rb`:

      Rails.application.config.action_cable.allowed_request_origins = ['https://your.url.com']

- Use `bundle exec rake secret` to generate a suitable string and add it to `config/initializers/secret_token.rb`

## Production setup
As part of the deployment the frontend must be compiled by webpack which is handled by 
`docker/frontend/Dockerfile` for development. Remember that for production these artifacts must be included
and served either by the rails app or from a web server such as nginx.

Set the required environment variables:

    RAILS_ENV=production
    RACK_ENV=production
    
    BUNDLE_WITHOUT="test,development"
    
    # example: mysql2://user:pwd@host:3306
    DATABASE_URL=""
    REDIS_URL=""

    # Keys for upload bucket
    AWS_ACCESS_KEY_ID=""
    AWS_SECRET_ACCESS_KEY=""
    S3_UPLOADS_DIR="uploads-directory-name"
    
    # SMTP for actionmailer
    SMTP_ADDRESS=""
    SMTP_USERNAME=""
    SMTP_PASSWORD=""
    SMTP_PORT="587"
    SMTP_AUTHENTICATION="plain"
    SMTP_DOMAIN=""
    
