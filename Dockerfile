FROM ruby:2.2.10

# Install essential Linux packages
RUN apt-get update -qq
RUN apt-get install --yes mysql-client nodejs build-essential libpq-dev curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" >> /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn nodejs -y
