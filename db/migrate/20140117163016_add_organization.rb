class AddOrganization < ActiveRecord::Migration[4.2]
  def change
    create_table :organizations do |t|
      t.string :name, :null => false, :unique => true
      t.string :slug, :null => false

      t.timestamps
    end
  end
end
