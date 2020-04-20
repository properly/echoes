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
  class AccessTokensController < ApiController
    load_and_authorize_resource

    def index
      access_tokens = @access_tokens
      .includes(:reviewer)
      .where(:package_id => params[:package_id])

      render :json => access_tokens
    end

    def create
      if @access_token.save
        logger.info("Sending access token ##{@access_token.id} for package ##{@access_token.package_id} to #{@access_token.reviewer.email}, triggered by #{current_user.email}")
        AccessTokenMailer.send_link(@access_token.id, current_user.id).deliver_now # TODO: move to worker

        render :json => @access_token, :status => :created
      else
        render :json => @access_token.errors.full_messages, :status => :unprocessable_entity
      end
    end


    private

    def access_token_params
      params.permit(:package_id, :reviewer_id)
    end
  end
end
