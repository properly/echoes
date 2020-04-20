class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    result = value =~ /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\Z/i

    record.errors.add(attribute, (options[:message] or :invalid)) unless result
  end

end
