class AddDeviseInvitable < ActiveRecord::Migration[4.2]
  def change
    change_table :users do |t|
      ## Invitable
      t.string   :invitation_token
      t.datetime :invitation_created_at
      t.datetime :invitation_sent_at
      t.datetime :invitation_accepted_at
      t.integer  :invitation_limit
      t.integer  :invited_by_id
      t.string   :invited_by_type
    end

    add_index :users, :invitation_token, :unique => true

    reversible do |dir|
      change_table :users do |t|
        dir.up   { t.change :encrypted_password, :string, :null => true }
        dir.down { t.change :encrypted_password, :string, :null => false }
      end
    end
  end
end
