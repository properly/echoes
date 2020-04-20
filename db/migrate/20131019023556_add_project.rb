class AddProject < ActiveRecord::Migration[4.2]
  def change
    create_table :projects do |t|
      t.string :name, :null => false, :unique => true
      t.string :contact_email

      t.references :client

      t.timestamps
    end
  end
end
