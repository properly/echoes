class AddClientsUsersCounterCache < ActiveRecord::Migration[4.2]
  def change
    add_column :clients, :clients_users_count, :integer, :default => 0
  end
end
