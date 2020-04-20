FactoryGirl.define do
  factory :content do |c|
    c.target "facebook"
    c.image { fixture_file_upload(Rails.root.join("spec", "fixtures","attachment.jpg"), "image/png") }
    c.body "This is my image"
  end
end
