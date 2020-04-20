class CreateActivities < ActiveRecord::Migration[4.2]
  def change

    create_table :activities do |t|
      t.integer :owner_id, null: false
      t.string :owner_type, null: false

      t.integer :subject_id, null: false
      t.string :subject_type, null: false

      t.datetime :sent_at, null: true
      t.timestamps
    end

    add_index :activities, :owner_id
    add_index :activities, :owner_type

    add_index :activities, :subject_id
    add_index :activities, :subject_type

    add_index :activities, :sent_at
  end
end
