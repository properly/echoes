class AddProcessingToContent < ActiveRecord::Migration[4.2]
  def change
    add_column :contents, :image_processing, :boolean
  end
end
