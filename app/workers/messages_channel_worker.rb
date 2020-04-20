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

class MessagesChannelWorker
  include Sidekiq::Worker
  sidekiq_options :retry => false

  # Due to passing args via redis, named arguments wont work
  def perform(action, model_type, id, options = OpenStruct.new)
    @klass = model_type.constantize
    @id = id
    @resource = @klass.find_by_id(id)
    @action = action
    @only = OpenStruct.new(options).only
    instance_variable_set :"@#{model_type.to_s.downcase}", @resource
    @organization_id = OpenStruct.new(options).organization_id || @resource.organization_id
    payload

    # don't push empty objects
    return(true) unless (@action.to_sym == :destroy || payload.present?)

    begin
      MessagesChannel.broadcast_to private_channel_name,
                                   type: event_name,
                                   payload: payload

      Rails.logger.debug "Pushing: #{private_channel_name}, #{event_name}, #{payload.to_s[0...20]}..."
    rescue NoMethodError => e
      Rails.logger.error "No method error when trying to push: #{e}"
      raise "No method error when trying to push: #{e}"
    end

  end

  private

  # return the name of the event, new--resource or update--resources/1
  #
  # @return [String]
  def event_name
    case @action.to_sym
    when :new
      "#{@action}--#{@klass.to_s.downcase}"
    when :update
      "#{@action}--#{@klass.to_s.pluralize.downcase}/#{@id}"
    when :destroy
      "#{@action}--#{@klass.to_s.pluralize.downcase}/#{@id}"
    else
      raise "Invalid action passed to MessagesChannelWorker #{@action}"
    end
  end

  # Constantize the serializer for the resource
  #
  # @return [ActiveModel::Serializer]
  def model_serializer
    "#{@klass.to_s}Serializer".constantize
  end

  # If there's a specified list of changes, pluck the values, else return the complete serializer
  #
  # @return [Hash|ActiveModel::Serializer] needs to respond to to_json
  def payload
    return if @resource.nil?
    @payload ||= @only ? pluck(model_serializer.new(@resource), @only) : model_serializer.new(@resource)
  end

  # Get attributes present in keys from serializer
  #
  # @param [ActiveModel::Serializer]
  # @param [Array] Array of keys, string or symbol
  # @param [Hash] optional hash to add changed attributes to
  # @return [Hash] Hash with requested attributes and values
  def pluck serializer, keys, changes = Hash.new
    keys.each do |k|
      changes[k]= serializer.attributes[k.to_sym] if !serializer.attributes[k.to_sym].nil? # false is valid
    end

    return changes
  end

  # @return [String] - channel name
  def private_channel_name
    "organization-#{@organization_id}"
  end
end
