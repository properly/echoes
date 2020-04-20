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

module Liveable
  extend ActiveSupport::Concern
  included do
    after_commit(:new_to_pusher, :on => :create)
    after_commit(:update_to_pusher, :on => :update)
    before_destroy(:store_id_before_destroy)
    after_destroy(:destroy_to_pusher)
  end

  private

  def store_id_before_destroy
    @destroy_id = self.id
    @organization_id = self.organization_id
  end

  def destroy_to_pusher
    Rails.logger.debug "Queued :destroy pusher event: #{self.class.to_s}, #{@destroy_id}"
    MessagesChannelWorker.perform_async(:destroy, self.class.to_s, self.id, :organization_id => @organization_id)
  end

  def new_to_pusher
    Rails.logger.debug "Queued :new pusher event: #{self.class.to_s}, #{self.id}"
    MessagesChannelWorker.perform_async(:new, self.class.to_s, self.id)
  end

  def update_to_pusher
    return if previous_changes.empty? || self[:removed] # avoid triggering on touches and soft_deletes

    Rails.logger.debug "Queued :update pusher event: #{self.class.to_s}, #{self.id}, #{previous_changes.keys}"
    MessagesChannelWorker.perform_async(:update, self.class.to_s, self.id, :only => previous_changes.keys)
  end

end
