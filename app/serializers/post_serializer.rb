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

class PostSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :scheduled_at,
    :name,
    :status,
    :package_id,
    :package_name,
    :client_id,
    :client_name,
    :previous_id,
    :next_id
  )

  # This should be remvoed eventually, one post should not know about it's siblings
  # use an array of post.ids in front-end navigation
  def previous_id
    object.previous.id if object.previous
  end

  def next_id
    object.next.id if object.next
  end

  def package_name
    object.package.name
  end

  def client_id
    object.package.client.id
  end

  def client_name
    object.package.client.name
  end
end
