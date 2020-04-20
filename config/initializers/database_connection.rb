#config/initializers/database_connection.rb
Rails.application.config.after_initialize do
  ActiveRecord::Base.connection_pool.disconnect!

  ActiveSupport.on_load(:active_record) do
    config = ActiveRecord::Base.configurations[Rails.env] ||
                Rails.application.config.database_configuration[Rails.env]
    config["reaping_frequency"] = ENV["DB_REAP_FREQ"] || 50 # seconds
    config["pool"]              = ENV["DB_POOL"]      || ENV["MAX_THREADS"] || 32
    ActiveRecord::Base.establish_connection(config)
  end
end
