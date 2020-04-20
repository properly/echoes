class AddClientsReviewers < ActiveRecord::Migration[4.2]
  def change
    create_table :clients_reviewers do |cr|
      cr.belongs_to :client
      cr.belongs_to :reviewer
    end
  end
end
