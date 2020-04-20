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
  class ContentsController < ApiController
    skip_before_action :authenticate_user!, :only => [:index]
    load_and_authorize_resource

    # GET /api/contents
    def index
      @contents = @contents.where(
        :revision_id => content_params[:revision_id]
      )

      render :json => @contents
    end

    # POST /api/contents
    def create
      if @content.save
        render :json => @content
      else
        render :json => @content.errors.full_messages, :status => :unprocessable_entity
      end

    end

    # PUT /api/contents/:id
    def update
      params = content_params

      @content.update_column :video, nil if params[:image]

      if params[:video]
        @content.update_column :image, nil
        @content.update_column :image_processing, false
        @content.reload
      end

      @content.update_attributes params

      if @content.save
        # At the moment this is only called when creating content, therefore no event.
        render :json => @content
      else
        render :json => @content.errors.full_messages, :status => :unprocessable_entity
      end

    end

    # DELETE /api/contents/:id
    def destroy
      if @content.destroy
        head :ok
      end
    end

    private

    def content_params
      params.permit(:target, :revision_id, :image, :body, :video)
    end

  end
end
