class AddAttachment < ActiveRecord::Migration[4.2]
  def change
    create_table :attachments do |t|
      t.string :image, :null => false
      t.text :legend

      t.references :revision

      t.timestamps
    end
  end
end
