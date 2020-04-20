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

class User < ApplicationRecord
  include Liveable
  include ActivityOwnerable

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable, :invitable

  # Associations
  belongs_to :organization
  has_many :clients
  has_many :packages
  has_many :revisions
  has_many :comments, :as => :comment_author, :dependent => :destroy
  has_many :clients_users
  has_many :clients, :through => :clients_users

  # Validation
  validates :owner, :inclusion => { :in => [true, false] }
  validates :terms_of_use, :acceptance => { :accept => true }
  validates :name,
    :presence => true,
    :on => [:create],
    :unless => :invited_by_id

  # Avatar
  mount_uploader :avatar, AvatarUploader
  process_in_background :avatar


  scope :owners, -> { where(:owner => true) }

  # Link to be sent with invitation email
  def accept_invite_link(token)
    "http://#{Settings.default_host}/organizations/invitations/accept?token=#{token}"
  end

  # Link to be sent with reset password email
  def reset_password_link(token)
    "http://#{Settings.default_host}/password?resetPasswordToken=#{token}"
  end

  # Inviter user
  def invited_by
    User.find(self.invited_by_id)
  end


  # Organization admin level
  #
  # @return [Boolean]
  def admin?
    owner
  end


  # Superuser level
  #
  # @return [Boolean]
  def superadmin?
    Settings.roles.superadmins.include? email
  end


  # Default user level
  #
  # @return [Boolean]
  def member?
    !owner && !new_record?
  end

  # Stub for reviewer method
  #
  # @return [False]
  def reviewer?; false; end

  def role
    if superadmin?
      "superadmin"
    elsif admin?
      "admin"
    elsif member?
      "member"
    else
      "guest"
    end
  end
end
