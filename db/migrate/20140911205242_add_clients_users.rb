class AddClientsUsers < ActiveRecord::Migration[4.2]
  def change
    create_table :clients_users do |cu|
      cu.belongs_to :client
      cu.belongs_to :user
    end

    Rake::Task['db:create_permissions'].invoke
  end
end
