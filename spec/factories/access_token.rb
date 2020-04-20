FactoryGirl.define do
  factory :access_token do |a|
    sequence(:uuid) { |i| "uuid_#{i}" }
  end
end
