class PolymorphicComment < ActiveRecord::Migration[4.2]
  def change
    add_reference :comments, :comment_author, polymorphic: true
  end
end
