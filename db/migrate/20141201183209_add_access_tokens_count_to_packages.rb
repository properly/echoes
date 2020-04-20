class AddAccessTokensCountToPackages < ActiveRecord::Migration[4.2]
  def change
    add_column :packages, :access_tokens_count, :integer, :default => 0
  end
end
