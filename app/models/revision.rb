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

class Revision < ApplicationRecord
  include Liveable

  # Associations
  belongs_to :post, :touch => true
  belongs_to :user
  has_many :comments, :dependent => :destroy
  has_many :contents, :dependent => :destroy

  # Validations
  validates :user, :presence => true
  validates :post, :presence => true
  validate :post_accepts_revision

  # Gets organization id for package
  #
  # @return [Integer]
  def organization_id
    if user.present?
      user.organization_id
    else
      post.package.client.organization_id
    end
  end

  # Update status of post to adjusted if allowed (post_accepts_revision takes care of validation)
  #
  # @return [Boolean]
  def update_post_status
    return self.post.update_attributes(:status => "adjusted") if self.valid? && revisions_count > 1

    false
  end

  private

  # Validate that the post can acccept a new revision
  #
  # @return [Void]
  def post_accepts_revision
    return if (self.post.status.to_s).in?(
      [ "", "refused", "adjusted", "adjustment_pending", "schedule_canceled", "publication_error" ]
    )

    translated_status = I18n.t("post.status.#{self.post.status}").downcase
    self.errors.add(:revision, I18n.t("errors.messages.revision.post_cannot_accept_revision", :status => translated_status))
  end

  def revisions_count
    Revision.where(:post_id => self.post_id).count
  end
end
