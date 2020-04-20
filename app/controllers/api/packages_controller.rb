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
  class PackagesController < ApiController

    # FIXME: use roles instead of just skipping filters
    skip_before_action :authenticate_user!, :only => :uuid
    skip_before_action :require_organization, :only => [:uuid]
    load_and_authorize_resource

    def index
      @packages = @packages
      .by_organization(current_organization)
      .for_client(package_params[:client_id])

      render :json => @packages
    end

    def show
      render :json => @package
    end

    def create
      package = Package.includes(:client).new(package_params)
      package.user = current_user

      if package.save
        render :json => package
      else
        render :json => package.errors.full_messages, :status => :unprocessable_entity
      end
    end

    # PUT /api/packages/:id
    def update
      @package.attributes = package_params
      @package.user ||= current_user

      if @package.save
        render :json => @package, :status => :ok
      else
        render :json => @package.errors.full_messages, :status => :unprocessable_entity
      end
    end

    def uuid
      raise ActionController::RoutingError.new("Not Found") unless current_user.respond_to? :current_token

      render :json => current_user.current_token.package
    end

    # DELETE /api/packages/:id
    def destroy
      if @package.destroy
        head :ok
      else
        render :json => @package.errors.full_messages, :status => :unprocessable_entity
      end
    end

    private

    def package_params
      params.permit(:id, :client_id, :name, :contact_email)
    end

    def uuid_params
      params.permit(:uuid)
    end

  end
end
