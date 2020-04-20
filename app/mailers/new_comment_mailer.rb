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

class NewCommentMailer < ActionMailer::Base
  default from:  "\"Echoes\" <#{Settings.mailer.from}>"

  def comment_notification recipient, comment, revision, post, package, organization
    @comment = comment
    @revision = revision
    @post = post
    @package = package
    @organization = organization
    @link = post.link(recipient)

    mail(
      to: recipient.email,
      subject: I18n.t(
        "comment.mailer.notification.subject",
        :client => @package.client.name,
        :package => @package.name
      )
    )

  end
end
