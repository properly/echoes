class AddUser < ActiveRecord::Migration[4.2]
  def change
    create_table :users do |t|
      t.string   :email, :null => false, :unique => true

      t.timestamps
    end
  end
end
