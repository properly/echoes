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

class AccessTokenMailer < ActionMailer::Base
  default from:  "\"Echoes\" <#{Settings.mailer.from}>"

  def send_link access_token_id, user_id
    @access_token = AccessToken.find(access_token_id)
    @user = User.find(user_id)
    @link = @access_token.link
    @organization = @access_token.package.client.organization
    @package = @access_token.package
    @client = @package.client
    @posts = @access_token.package.posts

    mail(
      :from =>  "\"#{@user.name}\" <echoes-notifications@echoes.properly.com.br>",
      :reply_to =>  "\"#{@user.name}\" <#{@user.email}>",
      :to => @access_token.reviewer.email,
      :subject => I18n.t(
        "access_token.mailer.share_instructions.subject",
        :client => @client.name,
        :package => @package.name
      )
    )
  end
end
