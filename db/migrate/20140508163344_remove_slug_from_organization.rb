class RemoveSlugFromOrganization < ActiveRecord::Migration[4.2]
  def up
    remove_column :organizations, :slug
  end

  def down
    add_column :organizations, :slug, :string, :null => false
  end

end
