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

class AccessToken < ApplicationRecord
  include Liveable

  # Associations
  belongs_to :package, :counter_cache => :access_tokens_count
  belongs_to :reviewer

  # Validations
  validates :uuid, :presence => true

  # generate a uuid automaticly
  before_validation :generate_uuid

  def link post = nil
    "http://#{Settings.default_host}/reviews/#{self.uuid}/posts/#{post}"
  end

  def organization_id
    @organization_id ||= self.package.client.organization_id
  end

  protected

  def generate_uuid
    return if self.uuid.present?

    self.uuid = loop do
      random_uuid = SecureRandom.urlsafe_base64(nil, false)
      break random_uuid unless self.class.exists?(uuid: random_uuid)
    end
  end

end
