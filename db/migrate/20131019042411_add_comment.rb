class AddComment < ActiveRecord::Migration[4.2]
  def change
    create_table :comments do |t|
      t.string :email, :null => false
      t.text :body, :null => false

      t.references :revision

      t.timestamps
    end
  end
end
