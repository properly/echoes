ruby "2.2.10"

source "https://rubygems.org"

gem "rails", "~> 5.1.0"
gem "nokogiri"

# Use mysql as the database for Active Record
gem "mysql2"

# Serializers
gem "active_model_serializers", "~>0.8.1"

# Pagination
gem "kaminari"

# Configuration from config/settings.yml
gem "config"

# Redis provides pub/sub
gem "redis"

# Carrierwave
gem "carrierwave"
gem "carrierwave_backgrounder"
gem "fog-aws"
gem "unf"
gem "rmagick", :require => false
gem "sidekiq"
gem "sinatra", :require => nil
gem "premailer-rails"

# Auth
gem "devise"
gem "devise_invitable"
gem "cancancan"

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem "sdoc", require: false
end

# app server
gem "puma"

group :development, :test do
  gem "rspec-rails"
  gem "rspec-collection_matchers"
  gem "spring-commands-rspec"
  gem "factory_girl_rails"
  # see https://github.com/fnando/factory_girl-preload/pull/22
  gem "factory_girl-preload", :github => "properly/factory_girl-preload"
  gem "pry-rails"
end

group :test do
  gem "codeclimate-test-reporter", :require => false
  gem "simplecov", :require => false
  gem "guard-rspec", :require => false
  gem "guard"
end

group :production do
  gem "therubyracer"
end

gem "byebug", "~> 9.0", :groups => [:development, :test]
