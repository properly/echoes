class RenameProjectPackage < ActiveRecord::Migration[4.2]
  def change
     rename_table :projects, :packages
     rename_column :posts, :project_id, :package_id
     rename_column :access_tokens, :project_id, :package_id
  end
end
