class OrganizationAssociation < ActiveRecord::Migration[4.2]
  def change
    add_reference :users, :organization, :index => true
    add_reference :clients, :organization, :index => true

    add_column :users, :owner, :boolean, :default => false
    remove_column :clients, :user_id, :integer
  end
end
