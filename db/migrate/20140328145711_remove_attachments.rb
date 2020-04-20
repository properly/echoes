class RemoveAttachments < ActiveRecord::Migration[4.2]
  def up
    add_column :contents, :image, :string

    drop_table :attachments
  end

  def down
    remove_column :contents, :image, :string

    create_table :attachments do |t|
      t.string :image, :null => false
      t.text :legend

      t.references :revision

      t.timestamps
    end
  end

end
