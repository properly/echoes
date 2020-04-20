FactoryGirl.define do
  factory :post do |p|
    p.name "My post"
    p.scheduled_at DateTime.now + 3.days
    p.status ""
    p.status_changed_at DateTime.now
  end
end
