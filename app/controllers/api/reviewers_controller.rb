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
  class ReviewersController < ApiController
    # FIXME: use roles instead of just skipping filters
    skip_before_action :authenticate_user!, :only => :uuid
    skip_before_action :require_organization, :only => :uuid
    load_and_authorize_resource

    def index
      reviewers = AccessToken
      .includes(:reviewer)
      .where(:package_id => params[:package_id])
      .map(&:reviewer)

      render :json => reviewers
    end

    def create
      # Create reviewer and associate client with it.
      reviewer = Reviewer
                  .where(:email => reviewer_params[:email])
                  .first_or_initialize(reviewer_params)

      unless reviewer.client_ids.include?(params[:client_id].to_i)
        reviewer.clients << reviewer_params[:clients].first
      end

      if reviewer.save
        render :json => reviewer, :status => :created
      else
        render :json => reviewer.errors.full_messages, :status => :unprocessable_entity
      end
    end

    private
    def reviewer_params
      params.permit(:email).merge(:clients => [Client.find(params[:client_id])] )
    end

  end
end
