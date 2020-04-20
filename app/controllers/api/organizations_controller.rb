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
  class OrganizationsController < ApiController
    skip_before_action :authenticate_user!, :only => [:current]
    skip_before_action :require_organization, :only => [:create, :current]
    load_and_authorize_resource :except => [:current], :param_method => Proc.new { |c|
      c.params.permit(:name).merge(:users => [c.send(:current_user)])
    }

    def current
      if current_organization
        render :json => current_organization
      else
        head :not_found
      end
    end

    # GET /api/organizations/:id
    def show
     render :json => Organization.includes(:users).find(params[:id]), :status => :ok
    end

    # POST /api/organizations
    def create
      organization = Organization.new(
        organization_params.merge(:users => [current_user])
      )
      current_user.owner = true

      if organization.save
        render :json => organization, :status => :created
      else
        render :json => organization.errors.full_messages, :status => :unprocessable_entity
      end
    end

    # PUT /api/orgnizations/:id
    def update
      organization = Organization.find(params[:id])
      organization.attributes = organization_params

      if organization.save
        render :json => organization, :status => :accepted
      else
        render :json => organization.errors.full_messages, :status => :unprocessable_entity
      end
    end

    def destroy
      user_was_member = @organization == current_user.organization
      current_user_id = current_user.id

      if !@errors and @organization.destroy
        sign_out if user_was_member

        head(:ok) and return
      else
        render(:json => (@errors || @organization.errors.full_messages), :status => :unprocessable_entity) and return
      end

    end

    private

    def organization_params
      params.permit(:name)
    end
  end
end
