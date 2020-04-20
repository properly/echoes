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

module ActivityOwnerable
  extend ActiveSupport::Concern

  included do
    has_many :activities, :as => :owner
    has_many :pending_activities,  -> { where("activities.sent_at" =>  nil) }, :as => :owner,  :class_name => 'Activity'
    has_many :pending_activity_subjects, :source => :subject, :through => :pending_activities, :source_type => 'Comment'
  end

  def posts_with_pending_activities
    pending_activity_subjects_ordered.group_by { |activity| activity.revision.post }
  end

  def pending_activity_subjects_ordered
    pending_activity_subjects.includes(
      :revision => {
        :post  => {:package  => :client }
      }).order(
        'clients.id',
        'packages.id',
        'posts.id',
        'revisions.id',
        'activities.created_at'
      )
  end

  def latest_delivered_notification
    activities.where.not(sent_at: nil).order('sent_at DESC').limit(1).last
  end

end
