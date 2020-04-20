# Updates all counter caches
desc "update all counter caches"

namespace :db do
  task :update_counter_cache => :environment do
    ActiveRecord::Base.connection.execute <<-SQL.squish
      UPDATE clients
            SET clients_users_count = (
                SELECT count(1)
                FROM clients_users
                WHERE clients_users.client_id = clients.id
            )
SQL
    ActiveRecord::Base.connection.execute <<-SQL.squish
      UPDATE packages
            SET posts_count = (
                SELECT count(1)
                FROM posts
                WHERE posts.package_id = packages.id
            )
SQL

    ActiveRecord::Base.connection.execute <<-SQL.squish
      UPDATE packages
            SET access_tokens_count = (
                SELECT count(1)
                FROM access_tokens
                WHERE access_tokens.package_id = packages.id
            )
SQL
  end
end
