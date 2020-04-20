class AddNullRestrictionToPostPackageClientRelations < ActiveRecord::Migration[4.2]
  def change
    change_column_null :packages, :client_id, false
    change_column_null :posts, :package_id, false
  end
end
