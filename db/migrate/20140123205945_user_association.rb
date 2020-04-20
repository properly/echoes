class UserAssociation < ActiveRecord::Migration[4.2]
  def change
    add_reference :revisions, :user, :index => true
    add_reference :packages, :user, :index => true
  end
end
