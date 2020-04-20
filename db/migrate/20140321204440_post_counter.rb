class PostCounter < ActiveRecord::Migration[4.2]
  def change
    add_column :packages, :posts_count, :integer, :default => 0
  end
end
