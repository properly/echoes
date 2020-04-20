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
  class SessionsController < ApiController
    skip_before_action :authenticate_user!, :only => [:create, :current]
    skip_before_action :require_organization
    authorize_resource :class => false

    def current
      if current_user
        render :json => current_user
      else
        render :json => { :role => "guest" }
      end
    end

    def create
      resource = User.find_for_database_authentication(:email => user_params[:email])
      return invalid_login_attempt unless resource

      if resource.valid_password?(user_params[:password])
        sign_in(resource)

        render :json=> resource, :status => :created
        return
      end
      invalid_login_attempt
    end

    def destroy
      sign_out(current_user)
      head :ok
    end

    private
    def user_params
      params.permit(:email, :password, :password_confirmation)
    end

    def invalid_login_attempt
      render :json => I18n.t("errors.messages.session_failed"), :status => :unauthorized
    end

  end
end
