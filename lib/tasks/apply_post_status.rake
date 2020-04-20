# Updates post status where needed
desc "Update post status to adjusted or adjustment pending on old posts"

namespace :db do
  task :apply_post_status => :environment do
    Post.where(:status => [nil, ""]).find_each do |post|
      post.set_attributes({})
      post.save
    end
  end
end
