class SlugValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    result = value =~ /\A([a-z0-9\-\+]+)\Z/i

    record.errors.add(attribute, (options[:message] or :invalid)) unless result
  end

end
