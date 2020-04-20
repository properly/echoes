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
  class PostsController < ApiController

    # FIXME: use roles instead of just skipping filters
    before_action :require_project, :only => [:index]
    skip_before_action :authenticate_user!, :only => [:show, :update, :index]
    skip_before_action :require_organization, :only => [:show, :update, :index]
    load_and_authorize_resource

    # GET /api/posts
    def index
      posts = @posts.scheduled_after(start_date)
      .scheduled_before(end_date)
      .with_client_and_package
      .with_contents
      .for_client(params[:client_id])
      .for_package(params[:package_id])

      render :json => posts, :each_serializer => PostNameSerializer
    end

    # PUT /api/posts/:id
    def update
      @post.status_changer = current_user # Keeps track of approvals
      @post.set_attributes(post_params.to_h)

      if @post.save
        render :json => @post
      else
        render :json => @post.errors.full_messages, :status => :unprocessable_entity
      end
    end

    # Get /api/posts/:id
    # Hit's an extra time on clients but
    # still way more effective than before
    def show
      render :json => @post
    end


    # POST /api/posts
    def create
      # This should be possible with cancan
      @post.package_id = post_params[:package_id]

      if @post.save
        render :json => @post
      else
        render :json => @post.errors.full_messages, :status => :unprocessable_entity
      end

    end

    # DELETE /api/posts/:id
    def destroy
      if @post.destroy
        head :ok
      end

    end


    private

    # Do not show posts unless you have a filter - client or package.
    def require_project
      unless  params[:client_id].present? || params[:package_id].present?
        render :json => I18n.t("errors.messages.unauthorized"), :status => :forbidden
      end
    end

    def post_params
      params.permit(:scheduled_at, :target, :name, :status, :package_id)
    end

    def start_date
      DateTime.strptime(params[:start_date], "%s") if params[:start_date]
    end

    def end_date
      DateTime.strptime(params[:end_date], "%s") if params[:end_date]
    end

  end
end
