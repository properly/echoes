class AddPost < ActiveRecord::Migration[4.2]
  def change
    create_table :posts do |t|
      t.datetime :scheduled_at, :null => false
      t.string :target
      t.string :name, :null => false
      t.string :status

      t.references :project

      t.timestamps
    end
  end
end
