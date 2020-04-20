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

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception, :only => [:update, :delete, :create]
  after_action :set_csrf_cookie_for_ng

  def health_check
    render plain: "ok"
  end

  protected

  def set_csrf_cookie_for_ng
    cookies["XSRF-TOKEN"] = form_authenticity_token if protect_against_forgery?
  end

  def verified_request?
    super || valid_authenticity_token?(session, request.headers["X-XSRF-TOKEN"])
  end

  rescue_from CanCan::AccessDenied do |exception|
    Rails.logger.debug "Access denied on #{exception.action} #{exception.subject.inspect}, using: #{current_user}"
    render :json => { :message => exception.message }, :status => 403
  end

  rescue_from ActionController::InvalidAuthenticityToken do |exception|
    Rails.logger.debug "Invalid Authenticity Token #{exception}"
    cookies["XSRF-TOKEN"] = form_authenticity_token if protect_against_forgery?
    render :json => { :message => I18n.t("errors.messages.csrf_invalid") }, :status => :unprocessable_entity
  end

end
