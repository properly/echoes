# Give users permissions to all clients in their organization
desc "Creating permissions for existing users"

namespace :db do
  task :create_permissions => :environment do
    Organization.find_each do |org|

      org.users.each do |user|
        org.clients.each do |client|
          user.clients << client
        end

        user.save
      end
    end
  end
end
