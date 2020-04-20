class RemoveDatesToken < ActiveRecord::Migration[4.2]
  def up
    remove_column :access_tokens, :start_date, :datetime
    remove_column :access_tokens, :end_date, :datetime
  end

  def down
    add_column :access_tokens, :start_date, :datetime
    add_column :access_tokens, :end_date, :datetime
  end
end
