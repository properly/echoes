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
  class ClientsUsersController < ApiController
    before_action :load_for_destroy, :only => :destroy
    load_resource :client, :only => [:available, :destroy]
    load_resource :user, :only => [:destroy]
    load_and_authorize_resource :except => [:destroy]

    # GET /api/clients/:client_id/users/available
    def available
      authorize! :read, @client
      users = User.includes(:clients).where(:organization_id => current_organization.id)

      render :json => users,
        :each_serializer => ClientUserSerializer,
        :client_id => params[:client_id]
    end

    # POST /api/clients/:client_id/users/
    def create
      if @clients_user.save
        @clients_user.client.send_notification(@clients_user.user)

        render :json => ClientUserSerializer.new(@clients_user.user, :client_id => @clients_user.client_id),
          :status => :ok
      else
        render :json => @clients_user.client.errors.full_messages,
          :status => :unprocessable_entity
      end
    end

    # DELETE /api/clients/:client_id/clients_users/remove
    def destroy
      authorize! :read, @client
      authorize! :read, @user

      if @clients_users.destroy_all
        render :json => ClientUserSerializer.new(@user, :client_id => @client.id),
          :status => :ok
      else
        render :json => @clients_users.errors.full_messages,
          :status => :unprocessable_entity
      end
    end

    private
    def clients_user_params
      params.permit(:client_id, :user_id)
    end

    # NOTE: since we're dealing with an array, authorize here
    def load_for_destroy
      @clients_users = ClientsUser.accessible_by(current_ability, :destroy).where(clients_user_params)
    end
  end
end
