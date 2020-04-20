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

class Package < ApplicationRecord
  include Liveable

  # Associations
  belongs_to :client
  belongs_to :user

  has_many :posts,
    :dependent => :destroy

  has_many :access_tokens,
    :dependent => :destroy

  # Validations
  validates :name, :presence => true
  validates :contact_email, :email => true, :allow_blank => true
  validates :user, :presence => true
  validates :client, :presence => true

  # Scopes
  scope :with_posts, -> { includes(:posts) }

  scope :for_client, -> (client_id) {
    where(:client_id => client_id) if client_id
  }

  scope :by_organization, ->(organization) {
    joins(:client => :organization)
    .where("clients.organization_id = ?", organization)
  }

  # Gets organization id for package
  #
  # @return [Integer]
  def organization_id
    self.client.organization_id
  end

  # True if package has been sent for review
  #
  # @return [Boolean]
  def sent_for_review
    self.access_tokens_count > 0
  end

end
