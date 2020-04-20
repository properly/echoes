FactoryGirl.define do
  factory :user do |u|
    u.email "john@example.org"
    u.name "John"
    u.password "password"
    u.password_confirmation "password"
    u.owner true
    u.last_sign_in_at Time.now - 2.minutes
  end
end
