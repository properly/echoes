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

class Comment < ApplicationRecord
  include Liveable
  include ActivitySubjectable

  # Associations
  belongs_to :revision

  # Polymorphic association
  belongs_to :comment_author, :polymorphic => true

  has_many :activities

  # Validations
  validates :body, :presence => true
  validates :comment_author_id, :presence => true

  # Scopes
  scope :with_author, -> { includes(:comment_author) }

  after_commit :create_notifications, :on => :create

  # Gets organization id for comment
  #
  # @return [Integer]
  def organization_id
    self.revision.organization_id
  end


  # Add creator of revision to people receiving emails
  #
  # @returns [Array] User or Reviewers
  def all_subscribers
    @all_subscribers ||= PackageSubscribers.new(self.revision.post.package_id).exclude(
      self.comment_author
    ).all
  end

  # create Events in events table:
  # each event goes into queue
  #
  # TODO: add status change in activity feed
  def create_notifications
    CreateActivityWorker.perform_async(self.id)
  end

  # Set post.status to adjustment_pending if current status is blank or
  # adjusted
  #
  # @return [Void]
  def update_post_status
    post = self.revision.post
    return unless post.status.to_s.in?(["", "adjusted"])

    post.update_attributes(:status => "adjustment_pending")
  end

end
