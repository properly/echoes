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

class Reviewer < ApplicationRecord
  include ActivityOwnerable

  # Associations
  has_many :access_tokens
  has_many :comments, :as => :comment_author
  has_and_belongs_to_many :clients

  # Validations
  validates :email, :email => true
  validates :email, :uniqueness => true
  validates :clients, :presence => true

  attr_accessor :organization_id

  # for assigning current access token
  attr_accessor :current_token

  # Add unique client
  #
  # @params [Client] Client to be added
  def push_client(client)
    self.clients << client unless self.clients.include?(client)
  end

  # Stubs for role models on current_user
  #
  # @return [False]
  def superadmin?; false; end
  def admin?; false; end
  def member?; false; end

  # Define as reviewer
  #
  # @return [True]
  def reviewer?; true; end

  # Return role of reviewer
  #
  # @return [String]
  def role
    "reviewer"
  end

  def name
    email
  end

end
