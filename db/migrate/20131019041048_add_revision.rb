class AddRevision < ActiveRecord::Migration[4.2]
  def change
    create_table :revisions do |t|
      t.text :post_text

      t.references :post

      t.timestamps
    end
  end
end
