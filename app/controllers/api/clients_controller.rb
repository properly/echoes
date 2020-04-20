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
  class ClientsController < ApiController
    load_and_authorize_resource

    # GET /api/clients
    def index
      # don't wan't to list all clients for admins here
      render :json => @clients.with_packages.for_organization(current_organization.id)
    end

    # GET /api/clients/:id
    def show
      render :json => @client
    end

    # POST /api/clients
    def create
      # Add permission for user that created the client and owner of the organization
      @client.users << (current_organization.owners.to_a.push(current_user)).uniq - @client.users

      if @client.save
        render :json => @client, :status => :created
      else
        render :json => @client.errors.full_messages, :status => :unprocessable_entity
      end
    end

    # PUT /api/clients/:id
    def update
      @client.attributes = client_params

      if @client.save
        render :json => @client, :status => :ok
      else
        render :json => @client.errors.full_messages, :status => :unprocessable_entity
      end
    end

    # DELETE /api/clients/:id
    def destroy
      if @client.destroy
        head :ok
      else
        render :json => @client.errors.full_messages, :status => :unprocessable_entity
      end
    end

    private

    def client_params
      params.permit(:name).merge(:organization_id => current_organization.id)
    end

  end
end
