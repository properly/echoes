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

class Post < ApplicationRecord
  include Liveable

  # Associations
  belongs_to :package, :counter_cache => :posts_count
  has_many :revisions, :dependent => :destroy
  belongs_to :status_changer, :polymorphic => true

  # Validations
  validates :scheduled_at, :datetime => true, :on => :create
  validates :status_changed_at, :datetime => true, :if => :"status_changed?"
  validates :name, :presence => true, length: { maximum: 190 }
  validates :package, :presence => true
  # refused: red
  # adjustment_pending: yellow
  # adjusted: white
  # approved: green
  # scheduled: dark blue
  # schedule_canceled: light red outline
  # published: light blue
  # publication_error: intense red outline
  validates :status,
    :inclusion => { :in => %w(refused adjustment_pending adjusted approved scheduled schedule_canceled published publication_error) },
    :allow_blank => true

  before_validation :change_status, :if => :"status_changed?"
  after_commit :enqueue_status_email

  # Scopes
  # Always bring posts by date
  default_scope { order("posts.scheduled_at ASC, posts.created_at ASC") }

  scope :by_organization, -> (organization) {
    joins(:package => :client).where("clients.organization_id = ?", organization)
  }

  scope :for_client, -> (client_id) {
    where("packages.client_id = ?", client_id).references(:clients) if client_id
  }

  scope :for_package, -> (package_id) {
    where(:package_id => package_id) if package_id
  }

  scope :with_package, -> { includes(:package) }

  scope :with_client_and_package, -> { includes(:package => :client) }

  scope :with_contents, -> { includes(:revisions => :contents) }

  scope :with_comments, -> { includes(:revisions => :comments) }

  scope :scheduled_after, -> (start_date) {
    where(
      "scheduled_at >= ?",
      start_date
    ) if start_date

  }
  scope :scheduled_before, ->(end_date) {
    where(
      "scheduled_at <= ?",
      end_date
    ) if end_date
  }

  # Gets organization id for package
  #
  # @return [Integer]
  def organization_id
    self.package.client.organization_id
  end

  # Navigation between posts, get previous according to schedule date and package
  def previous
    return(nil) unless siblings.present? && siblings.find_index(self)

    prev_index = siblings.find_index(self) - 1
    (prev_index < 0) ? nil : siblings[prev_index]
  end

  # Navigation between posts, get next according to schedule date and package
  def next
    siblings[siblings.find_index(self) + 1] if siblings.present? && siblings.find_index(self)
  end

  # Get siblings for post
  #
  # @return [ActiveRecord::Associations::CollectionProxy]
  def siblings
    self.package.posts
  end

  def link(recipient = nil)
    if recipient && recipient.respond_to?(:access_tokens)
      access_token = recipient.access_tokens.where(
        :package_id => self.package_id
      ).last
    end

    if access_token
      return access_token.link(self.id)
    else
      return "http://#{
        Settings.default_host
      }/clients/#{
        self.package.client_id
      }/packages/#{
        self.package.id
      }/posts/#{
        self.id
      }"
    end
  end

  def all_subscribers
    @all_subscribers ||= PackageSubscribers.new(self.package_id).exclude(
      self.status_changer
    ).all
  end


  # Update post, using attribute hash, if status comes in as blank and
  # current status is approved
  #
  # @param [Hash]
  # @return [Void]
  def set_attributes(new_attributes)
    new_attributes = new_attributes.with_indifferent_access

    new_attributes[:status] = non_approved_state if new_attributes[:status].blank?

    self.attributes = new_attributes
  end

  private

  def change_status
    self.status_changed_at = DateTime.now
  end

  def enqueue_status_email
    return unless status_changer

    if from_approved_to_any or from_any_to_approved
      PostStatusWorker.perform_async(self.id)
    end
  end

  # Does the last revision have reviewer comments?
  #
  # @return [Boolean]
  def has_reviewer_comments_on_last_revision
    return(false) if revisions.blank?

    revisions
      .order("created_at")
      .includes(:comments)
      .last
      .comments
      .where(:comment_author_type=> "Reviewer")
      .count > 0
  end

  # State to fallback to when removing approval, if status gets refactored
  # into a has_many, we could just grab the last one.
  #
  # @return [String] Status string
  def non_approved_state
    return("adjusted") if revisions.count > 1 && !has_reviewer_comments_on_last_revision

    return("adjustment_pending") if has_reviewer_comments_on_last_revision

    return("")
  end

  # check if status changed to approved
  def from_any_to_approved
    status == "approved" and previous_changes.include?(:status)
  end

  # Check if status changed from approved to anything else
  # FIXME: will return true if status changes to scheduled
  def from_approved_to_any
    previous_changes.include?(:status) && previous_changes[:status].first == "approved"
  end
end
