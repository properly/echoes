# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180716145104) do

  create_table "access_tokens", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.string "uuid", null: false
    t.integer "package_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "reviewer_id"
    t.index ["package_id"], name: "index_access_tokens_on_package_id"
    t.index ["uuid"], name: "index_access_tokens_on_uuid", unique: true
  end

  create_table "activities", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.integer "owner_id", null: false
    t.string "owner_type", null: false
    t.integer "subject_id", null: false
    t.string "subject_type", null: false
    t.datetime "sent_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["owner_id"], name: "index_activities_on_owner_id"
    t.index ["owner_type"], name: "index_activities_on_owner_type"
    t.index ["sent_at"], name: "index_activities_on_sent_at"
    t.index ["subject_id"], name: "index_activities_on_subject_id"
    t.index ["subject_type"], name: "index_activities_on_subject_type"
  end

  create_table "clients", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.string "name", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "organization_id"
    t.integer "clients_users_count", default: 0
    t.index ["organization_id"], name: "index_clients_on_organization_id"
  end

  create_table "clients_reviewers", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.integer "client_id"
    t.integer "reviewer_id"
    t.index ["client_id"], name: "index_clients_reviewers_on_client_id"
    t.index ["reviewer_id"], name: "index_clients_reviewers_on_reviewer_id"
  end

  create_table "clients_users", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.integer "client_id"
    t.integer "user_id"
    t.index ["client_id"], name: "index_clients_users_on_client_id"
    t.index ["user_id"], name: "index_clients_users_on_user_id"
  end

  create_table "comments", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.text "body", null: false
    t.integer "revision_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "comment_author_type"
    t.integer "comment_author_id"
    t.index ["comment_author_id", "comment_author_type"], name: "index_comments_on_comment_author_id_and_comment_author_type"
    t.index ["revision_id"], name: "index_comments_on_revision_id"
  end

  create_table "contents", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.string "target"
    t.text "body"
    t.integer "revision_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "image"
    t.boolean "image_processing"
    t.string "video"
    t.index ["revision_id"], name: "index_contents_on_revision_id"
  end

  create_table "organizations", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.string "name", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "packages", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.string "name", null: false
    t.string "contact_email"
    t.integer "client_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "user_id"
    t.integer "posts_count", default: 0
    t.integer "access_tokens_count", default: 0
    t.index ["client_id"], name: "index_packages_on_client_id"
    t.index ["user_id"], name: "index_packages_on_user_id"
  end

  create_table "posts", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.datetime "scheduled_at", null: false
    t.string "name", null: false
    t.string "status"
    t.integer "package_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "status_changer_type"
    t.integer "status_changer_id"
    t.datetime "status_changed_at"
    t.index ["package_id"], name: "index_posts_on_package_id"
    t.index ["scheduled_at"], name: "index_posts_on_scheduled_at"
    t.index ["status_changer_id", "status_changer_type"], name: "index_posts_on_status_changer_id_and_status_changer_type"
  end

  create_table "reviewers", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.string "email", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["email"], name: "index_reviewers_on_email", unique: true
  end

  create_table "revisions", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.integer "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "user_id"
    t.index ["post_id"], name: "index_revisions_on_post_id"
    t.index ["user_id"], name: "index_revisions_on_user_id"
  end

  create_table "users", id: :integer, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4" do |t|
    t.string "email", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "encrypted_password", default: ""
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.integer "organization_id"
    t.boolean "owner", default: false
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.integer "invited_by_id"
    t.string "invited_by_type"
    t.string "avatar"
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["organization_id"], name: "index_users_on_organization_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
