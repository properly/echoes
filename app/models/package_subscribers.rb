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

class PackageSubscribers

  # Subscriber class can get arrays of people that should receive notifications
  #
  # @param [Integer] package id
  def initialize(package_id)
    @package_id = package_id
    @exclude = []
  end

  #
  # @param [Array|Object] array or single model to be excluded from the result
  def exclude(exclude)
    @exclude.concat(Array(exclude)).uniq

    self
  end

  # Add creator of revision to people receiving emails
  #
  # @returns [Array] User or Reviewers
  def all
    exclude(blacklisted_emails)
    exclude(revoked_access_tokens)
    subscribers = (reviewers_for_package + revision_creators + comment_authors).uniq - @exclude

    # avoid returning nil values if any orphan objects
    subscribers.compact
  end

  private

  # Check if there are any revoked (/missing) access tokens
  #
  # @return ActiveRecord::Relation
  def revoked_access_tokens
    comment_authors.select do |author|
      author.is_a?(Reviewer) and author.access_tokens.where(:package_id => @package_id).empty?
    end
  end

  # Get all reviewers
  #
  # @param [Integer] id of package
  # @returns [ActiveRecord::Relation]
  def reviewers_for_package
    Reviewer
      .joins(:access_tokens)
      .where("access_tokens.package_id" => @package_id)
  end

  # Get all subscribing authors
  #
  # @param [Integer] id of post
  # @returns [ActiveRecord::Relation]
  def comment_authors
    post_ids = Post.where(:package_id => @package_id).pluck(:id)

    Comment
      .includes(:comment_author)
      .where(
        "revision_id IN (?)",
        Revision.where(:post_id => post_ids).pluck(:id)
      ).map(&:comment_author)
      .uniq
  end

  # Get everyone that created a revision in package
  #
  # @param [Integer] id of package
  # @returns [ActiveRecord::Relation]
  def revision_creators
    Post
      .includes(:revisions => :user)
      .for_package(@package_id)
      .map(&:revisions)
      .flatten
      .map(&:user)
      .uniq
  end

  def blacklisted_emails
    Reviewer.where(
      'email IN (?)',
      [
        'bbader@starbucks.com.br',
        'lbertao@starbucks.com.br',
        'joizumi@starbucks.com.br',
        'ricardo.montanheiro@ache.com.br',
        'graciane.kerbej@yum.com'
      ]
    )
  end
end
