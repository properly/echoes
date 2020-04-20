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

module Api
  class CommentsController < ApiController
    skip_before_action :authenticate_user!, :only => :create
    skip_before_action :require_organization, :only => :create

    load_and_authorize_resource

    # POST /api/comments
    def create
      if @comment.save

        @comment.update_post_status if current_user.reviewer?

        render :json => @comment
      else
        render :json => @comment.errors.full_messages, :status => :unprocessable_entity
      end
    end

    private

    def comment_params
      params.permit(:body, :revision_id).merge(:comment_author => current_user)
    end

    def reviewer_params
      params.permit(:uuid)
    end

  end
end
