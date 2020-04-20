class UniqueReviewerEmail < ActiveRecord::Migration[4.2]
  def change
    add_index :reviewers, :email, :unique => true
  end
end
