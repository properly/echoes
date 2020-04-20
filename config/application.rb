require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

module Echoes
  class Application < Rails::Application
    config.redis = { :url => ENV["REDIS_URL"]}
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    config.time_zone = 'Brasilia'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    config.i18n.default_locale = :"pt-BR"
    I18n.config.enforce_available_locales = false
    config.i18n.locale = :"pt-BR"

    # Autoload validators in the lib directory
    config.autoload_paths += %W(#{config.root}/lib/validators)
    config.autoload_paths += %W(#{config.root}/app/workers)

    config.autoload_paths += %W(#{config.root}/app/channels)
    config.to_prepare do
      DeviseController.respond_to :json
    end

    # opt into rails 5 callback behaviour
    # ActiveSupport.halt_callback_chains_on_return_false = false
  end
end
