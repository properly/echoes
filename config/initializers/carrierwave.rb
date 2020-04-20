default_asset_host = Echoes::Application.config.action_controller.asset_host

CarrierWave.configure do |config|
  config.storage = Settings.carrierwave.storage.to_sym

  config.fog_credentials = {
    :provider               => Settings.fog.provider,
    :aws_access_key_id      => Settings.fog.uploads_access_key_id,
    :aws_secret_access_key  => Settings.fog.uploads_secret_access_key,
    :region                 => Settings.fog.aws_region
  } unless Settings.carrierwave.storage == "file"

  config.fog_attributes = { "Cache-Control" => "max-age=315576000" }

  config.fog_directory  = Settings.fog.directory_uploads

  config.asset_host = Rails.env.development? ? default_asset_host : Settings.uploads_cdn

  config.remove_previously_stored_files_after_update = false

  config.cache_dir = "#{Rails.root}/tmp/uploads"
end

