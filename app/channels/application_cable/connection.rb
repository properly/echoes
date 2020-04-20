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

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_organization

    def connect
      self.current_organization = find_verified_user
    end

    protected
    def find_verified_user
      if cookies.signed['user.id'] && current_user = User.find_by(id: cookies.signed['user.id'])
        current_user.organization
      elsif access_token = AccessToken.find_by(:uuid => request.params[:token])
        access_token.package.client.organization
      else
        reject_unauthorized_connection
      end
    end
  end
end
