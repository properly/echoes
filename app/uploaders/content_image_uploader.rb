# Echoes - A feedback platform for social marketing.
# Copyright (C) 2020 Properly - dani (at) properly.com.br/ola (at) properly.com.br
#
#     This program is free software: you can redistribute it and/or modify
#     it under the terms of the GNU Affero General Public License as published
#     by the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     This program is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU Affero General Public License for more details.
#
#     You should have received a copy of the GNU Affero General Public License
#     along with this program.  If not, see <https://www.gnu.org/licenses/>.

# encoding: utf-8

class ContentImageUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  include CarrierWave::RMagick

  # Background process
  include ::CarrierWave::Backgrounder::Delay

  # Choose what kind of storage to use for this uploader:
  storage Settings.carrierwave.storage.to_sym

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Process files as they are uploaded:
  # process :fill => [200, 300]
  #
  def fill(width, height)
    resize_to_fill(width, height)
  end

  # Process files as they are uploaded:
  # process :limit => [200, 300]
  #
  def limit(width, height)
    resize_to_limit(width, height)
  end

  version :large do
    process :limit => [1440, 1440]
  end

  # Create different versions of your uploaded files:
  version :generic, :from_version => :large do
    process :limit => [500, 500]
  end

  version :fb_feed_small, :from_version => :generic do
    process :remove_animation, :if => :is_gif?
    process :limit => [403, 403]
  end

  version :instagram, :from_version => :generic do
    process :remove_animation, :if => :is_gif?
    process :limit => [500, 500]
  end

  version :twitter_feed, :from_version => :large do
    process :limit => [506, 375]
  end

  # The thumb is animated since some specific formats are
  version :thumb, :from_version => :generic do
    process :limit => [390, 237]
  end

  version :square, :from_version => :generic do
    process :remove_animation, :if => :is_gif?
    process :fill => [50, 50]
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpg jpeg gif png)
  end

  protected

  # Squash animation to first frame only
  def remove_animation
    manipulate! do |img, index|
      index == 0 ? img : nil
    end
  end

  def is_gif?(picture)
    picture.extension.to_s.downcase == 'gif'
  end

end
