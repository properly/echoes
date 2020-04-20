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

class ActivityDigestWorker
  include Sidekiq::Worker
  sidekiq_options :retry => 1

  sidekiq_retries_exhausted do |msg|
    Sidekiq.logger.warn "Failed #{msg['class']} with #{msg['args']}: #{msg['error_message']}"
  end



  def perform(activity_id)
    @activity = Activity.pending.includes(:owner).find_by_id(activity_id)

    # if activity was already sent it's nil, a later job takes care of the next ones
    return unless @activity

    # Load the owner and pending activities
    @owner = @activity.owner

    # Send digest and mark activities as sent if sucessfull
    if digest_pending and create_digest.deliver_now
      # update_all on the relation is subject to a race condition (runs an update_all where sent_at IS NULL)
      # therefore forcing the IDs
      Activity.where(:id => @owner.pending_activities.ids).update_all( :sent_at => Time.now )
      return
    end

    # create a job in 50.minutes (1 hour total) if a digest was sent in the last hour
    ActivityDigestWorker.perform_in(50.minutes, activity_id)
  end

  private
  def create_digest
    ActivityDigestMailer.digest_for(
      @owner
    )
  end

  # None has ever been sent or none has been sent last hour
  def digest_pending
    !@owner.latest_delivered_notification or @owner.latest_delivered_notification.sent_at < Time.now - 1.hour
  end

end
