class AddReviewer < ActiveRecord::Migration[4.2]
  def change
    create_table :reviewers do |t|
      t.string   :email, :null => false, :unique => true

      t.timestamps
    end

    add_column :access_tokens, :reviewer_id, :integer
  end
end
