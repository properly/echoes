class RemoveEmailComment < ActiveRecord::Migration[4.2]
  def up
    remove_column :comments, :email, :string
  end

  def down
    add_column :comments, :email, :string
  end
end
