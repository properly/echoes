class RemoveRemovedColumn < ActiveRecord::Migration[4.2]
  def change
    remove_column :clients, :removed, :boolean
    remove_column :packages, :removed, :boolean
  end
end
