class AddContent < ActiveRecord::Migration[4.2]
  def change
    create_table :contents do |t|
      t.string :target
      t.text :body
      t.references :revision

      t.timestamps
    end

    # Remove columns - these are now in contents table
    remove_column :revisions, :post_text, :text
    remove_column :posts, :target, :string

    # Refactor associations
    remove_column :attachments, :revision_id, :integer
    add_reference :attachments, :content, :index => true

  end
end
