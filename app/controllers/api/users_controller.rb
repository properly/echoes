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
  class UsersController < ApiController
    skip_before_action :authenticate_user!, :except => [:update, :destroy, :invite]
    skip_before_action :require_organization, :except => [:update, :destroy, :invite]

    before_action :require_matching_user, :only => [:update]
    before_action :require_password, :only => [:accept_invitation]

    load_and_authorize_resource

    def index
      @users = @users.page(params[:page]).per(params[:per_page])

      response.header['X-PAGINATION-CURRENT-PAGE'] = @users.current_page
      response.header['X-PAGINATION-TOTAL-PAGES'] = @users.total_pages
      render :json => @users
    end

    def create
      if @user.save
        sign_in(@user)
        render(:json => @user, :status => :created) and return
      end

      warden.custom_failure!
      render :json => @user.errors.full_messages, :status => :unprocessable_entity
    end

    def update
      @user.attributes = user_params

      authorize! :update, @user

      if @user.save
        render :json => @user, :status => :accepted
      else
        warden.custom_failure!
        render :json => @user.errors.full_messages, :status => :unprocessable_entity
      end
    end

    def destroy
      user_id = @user.id

      if @user.destroy
        sign_out if user_id == current_user.id

        head(:ok) and return
      else
        render(:json => @user.errors.full_messages, :status => :unprocessable_entity) and return
      end
    end

    def invite
      return unless invitation_valid?

      authorize! :invite, User.new(user_params)

      user = User.invite!(user_params.to_h, current_user) do |u|
        # Validation for user
        u.valid?
      end

      if user.errors.empty?
        render :json => user, :status => :ok
      else
        render :json => user.errors.full_messages, :status => :unprocessable_entity
      end
    end

    def accept_invitation
      # no authorization needed
      user = User.find_by(:invitation_token => digested_token_param)

      raise ActionController::RoutingError.new("Not Found") unless user.present?

      ability = Ability.new(user)
      user.attributes = user_params

      raise CanCan::AccessDenied unless ability.can?(:update, user)

      if user.valid?
        user.accept_invitation!

        sign_in(user)

        render :json => user, :status => :ok
      else
        return render :json => user.errors.full_messages, :status => :unprocessable_entity
      end

    end

    def send_reset_password_instructions
      user = User.find_by_email(user_params[:email])

      unless user.present?
        return render :json => I18n.t("errors.messages.no_user_found"), :status => :unprocessable_entity
      end

      user.send_reset_password_instructions

      if user.errors.empty?
        render :json => user, :status => :ok
      else
        head :unprocessable_entity
      end
    end

    def reset_password
      user = User.reset_password_by_token(user_params)

      unless user_params[:reset_password_token].present? && user.present?
        return render :json => I18n.t("errors.messages.no_user_found"), :status => :unprocessable_entity
      end

      if user.errors.empty?
        render :json => user, :status => :ok
      else
        return render :json => user.errors.full_messages, :status => :unprocessable_entity
      end
    end

    private
    def user_params
      params.permit(:email, :name, :password, :avatar, :organization_id, :invitation_token, :terms_of_use, :reset_password_token)
    end

    def require_matching_user
      unless current_user.id.to_s == params[:id]
        warden.custom_failure!
        render :json => { :errors => "not your user" }, :status => :forbidden
        return
      end
    end

    def require_password
      unless params[:password].present?
        render :json => I18n.t("errors.messages.password_missing"), :status => :unprocessable_entity
        return
      end
    end

    # Validates if user not registered already
    def invitation_valid?
      user = User.find_by_email(user_params[:email])

      return(true) unless user.present?

      # In other organization
      if user.organization_id != current_organization.id
        render :json => I18n.t("user.invitation.already_registered"),
          :status => :unprocessable_entity

        return false
      end

      # Already a member
      if user.owner || user.invitation_accepted_at.present?
        render :json => I18n.t("user.invitation.already_member"),
          :status => :unprocessable_entity

        return false
      end

      return true
    end

    def digested_token_param
      Devise.token_generator.digest(User, :invitation_token, user_params[:invitation_token])
    end

  end
end
