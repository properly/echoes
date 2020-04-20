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
  class RevisionsController < ApiController
    skip_before_action :authenticate_user!, :only => [:index]
    skip_before_action :require_organization, :only => [:index]
    load_and_authorize_resource

    # GET /api/revisions
    def index
      @revisions = @revisions.includes(
        :comments
      ).where(
        :post_id => params[:post_id]
      )

      render :json => @revisions
    end

    def show
      render :json => @revision
    end

    # POST /api/revisions
    def create
      if @revision.save
        @revision.update_post_status

        render :json => @revision
      else
        render :json => @revision.errors.full_messages, :status => :unprocessable_entity
      end

    end

    # PUT /api/revisions/:id
    def update
      @revision.update_attributes revision_params

      if @revision.save
        render :json => @revision
      else
        render :json => @revision.errors.full_messages, :status => :unprocessable_entity
      end

    end

    # DELETE /api/revisions/:id
    def destroy
      if @revision.destroy
        head :ok
      else
        render :json => @revision.errors.full_messages, :status => :unprocessable_entity
      end
    end

    private

    def revision_params
      params.permit(:post_id).merge(:user => current_user)
    end

  end
end
