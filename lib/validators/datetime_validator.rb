class DatetimeValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    # convert the value you want to validate
    @record = record
    @options = options
    @attribute = attribute
    @value = convert(value)

    add_error(:blank) if value.nil?

    # check if value is a valid date
    return add_error(:invalid) unless @value.is_a?(DateTime)

    # convert values you want to test against. Possible: :after, :before, :between
    validate_option("after") if options.has_key? :after

    validate_option("before") if options.has_key? :before
  end

  def validate_option(param)
    date = convert get_option_value(@options[param.to_sym])

    self.send("validate_#{param}".to_sym, date) if date.is_a?(DateTime)
  end

  def validate_after(date)
    #check if date after another
    add_error(:after_option_date) unless @value > date
  end

  def validate_before(date)
    #check if date before another
    add_error(:before_option_date) unless @value < date
  end

  def convert(value)
    return value if value.is_a?(DateTime)

    value.to_datetime if value.is_a?(ActiveSupport::TimeWithZone) || value.is_a?(Date)
  end

  def get_option_value(value)
    value.is_a?(Symbol) ? convert(@record[value]) : convert(value)
  end

  def add_error(message)
    @record.errors.add(@attribute, (@options[:message] or message))
  end

end
