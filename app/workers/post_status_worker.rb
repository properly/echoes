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

class PostStatusWorker
  include Sidekiq::Worker

  def perform(post_id)
    @post = Post.includes(
      :status_changer,
      :package => [
        :client
      ]
    ).find(post_id)

    @package = @post.package

    @post.all_subscribers.each do |recipient|
      Sidekiq.logger.info "Sending post status notification for post ##{@post.id} to #{recipient.email}, triggered by #{@post.status_changer.email}"
      PostStatusMailer.post_status(recipient, @post, @package).deliver_now
    end
  end

end
