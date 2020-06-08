Echoes::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false


  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations
  config.active_record.migration_error = :page_load

  # allow concurrency, if not streaming requests will lockup the
  # server.
  config.preload_frameworks = true
  config.allow_concurrency = true

  config.action_mailer.default_url_options = { :host => "localhost:3000" }
  config.action_mailer.preview_path = "#{Rails.root}/lib/mailer_previews"


  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    :address   => Settings.smtp.address,
    :port      => 587,
    :enable_starttls_auto => true,
    :user_name => Settings.smtp.username,
    :password => Settings.smtp.password,
    :authentication => "login",
    :domain => "echoes.properly.com.br",
  }

  config.public_file_server.enabled = true

  Rails.application.config.action_cable.allowed_request_origins = ['http://localhost:3000']

end
