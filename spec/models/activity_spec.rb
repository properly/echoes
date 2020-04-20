require 'spec_helper'

describe Activity do
  let(:user) { reviewers(:joe) }
  let(:comment) { comments(:johns_comment) }
  let(:activity) { Activity.new(:subject => comment, :owner => user) }
  it { expect(activity.type).to eq 'comment' }
end
