class AddClient < ActiveRecord::Migration[4.2]
  def change
    create_table :clients do |t|
      t.string   :name, :null => false, :unique => true

      t.references :user

      t.timestamps
    end
  end
end
