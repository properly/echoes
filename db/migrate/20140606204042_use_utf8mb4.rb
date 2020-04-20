class UseUtf8mb4 < ActiveRecord::Migration[4.2]

  # All columns that are text or blob
  # that needs to change
  # Table => Column
  UTF8_PAIRS = {
    "comments" => {
      :name => "body",
      :null => "NOT NULL"
    },
    "contents" => {
      :name => "body",
      :null => "NULL"
    },
  }

  def self.up
    execute "ALTER DATABASE `#{ActiveRecord::Base.connection.current_database}` CHARACTER SET utf8mb4;"

    ActiveRecord::Base.connection.tables.each do |table|
      execute "ALTER TABLE `#{table}` CHARACTER SET = utf8mb4;"
    end

    UTF8_PAIRS.each do |table, col|
      execute "ALTER TABLE `#{table}` CHANGE `#{col[:name]}` `#{col[:name]}` TEXT  CHARACTER SET utf8mb4 #{col[:null]};"
    end

  end

  def self.down
    execute "ALTER DATABASE `#{ActiveRecord::Base.connection.current_database}` CHARACTER SET utf8;"

    ActiveRecord::Base.connection.tables.each do |table|
      execute "ALTER TABLE `#{table}` CHARACTER SET = utf8;"
    end

    UTF8_PAIRS.each do |table, col|
      execute "ALTER TABLE `#{table}` CHANGE `#{col[:name]}` `#{col[:name]}` TEXT  CHARACTER SET utf8 #{col[:null]};"
    end
  end
end
