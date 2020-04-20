class AddAccessToken < ActiveRecord::Migration[4.2]
  def change
    create_table :access_tokens do |t|
      t.string :uuid, :null => false
      t.datetime :start_date
      t.datetime :end_date

      t.references :project

      t.timestamps
    end
  end
end
