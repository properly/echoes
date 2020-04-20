class AddIndexToAccessTokenOnPackageId < ActiveRecord::Migration[4.2]
  def change

    add_index :access_tokens, :package_id
  end
end
