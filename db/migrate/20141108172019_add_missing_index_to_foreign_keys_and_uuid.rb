class AddMissingIndexToForeignKeysAndUuid < ActiveRecord::Migration[4.2]
  def change
    add_index :access_tokens, :uuid, :unique => true

    add_index :clients_reviewers, :reviewer_id
    add_index :clients_reviewers, :client_id

    add_index :clients_users, :client_id
    add_index :clients_users, :user_id

    add_index :comments, :revision_id
    add_index :comments, [:comment_author_id, :comment_author_type]

    add_index :contents, :revision_id

    add_index :packages, :client_id

    add_index :posts, :scheduled_at
    add_index :posts, :package_id
    add_index :posts, [:status_changer_id, :status_changer_type]

    add_index :revisions, :post_id
  end
end
