class AddStatusChangerToPost < ActiveRecord::Migration[4.2]
  def change
    add_reference :posts, :status_changer, polymorphic: true
    add_column :posts, :status_changed_at, :datetime
  end
end
