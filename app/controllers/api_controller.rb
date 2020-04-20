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

class ApiController < ApplicationController
  respond_to :json
  before_action :authenticate_user!, :require_organization, :except => [:settings]
  alias_method :devise_current_user, :current_user


  # Responsible for returning settings as js file
  def settings; end

  private

  # Current Organization based on logged user
  #
  # @return [Organization]
  def current_organization
    if current_user.respond_to? :organization
      current_user.organization
    else
      token = AccessToken.includes(
        :package => {
          :client => :organization
        }
      ).find_by_uuid(params[:uuid])
      token.package.client.organization if token
    end
  end

  # Check if organization is present
  def require_organization
    render(
      :json => {
        :success => false,
        :message => I18n.t("organization.error.empty")
      },
      :status => :unauthorized
    ) if current_organization.nil?
  end

  def current_user
    if params[:uuid].blank?
      devise_current_user
    else
      sign_out(devise_current_user) if devise_current_user
      @access_token ||= AccessToken.find_by_uuid(params[:uuid])
      return nil unless @access_token

      @access_token.reviewer.organization_id = @access_token.package.client.organization_id
      @access_token.reviewer.current_token = @access_token
      @access_token.reviewer
    end
  end
end
