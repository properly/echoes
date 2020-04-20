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

class Client < ApplicationRecord
  include Liveable

  # Associations
  belongs_to :organization
  has_many :packages, :dependent => :destroy
  has_and_belongs_to_many :reviewers
  has_many :clients_users
  has_many :users, :through => :clients_users

  # Validations
  validates :name, :presence => true
  validates :organization, :presence => true

  # Scopes
  scope :for_organization, -> (organization_id) {
    where(:organization_id => organization_id)
  }

  scope :with_packages, -> { includes(:packages) }

  # Get access tokens for all packages
  #
  # @return [Array]
  def access_tokens
    packages.map(&:access_tokens).flatten
  end

  # Send email notifications to user that was added to client
  def send_notification(user)
    ClientAssignmentMailerWorker.perform_async(self.id, user.id)
  end
end
