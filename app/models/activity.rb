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

class Activity < ApplicationRecord
  belongs_to :subject, polymorphic: true
  belongs_to :owner, polymorphic: true

  after_create :enqueue_email_digest

  scope :pending, -> { where(sent_at: nil) }

  # For polymorphic views
  def type
    subject.class.to_s.downcase
  end

  private
  # Enqueue job that sends notifications and takes care of re-enqueing
  def enqueue_email_digest
    ActivityDigestWorker.perform_in(10.minutes, self.id)
  end
end
