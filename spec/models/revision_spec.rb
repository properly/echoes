require "spec_helper"

describe Revision do
  let(:revision) { revisions(:fb_revision) }

  describe "validations" do
    context "when user is not present" do
      before do
        revision.stub(:user => nil)
      end

      it { revision.should have(1).error_on(:user) }
    end

    describe "adding revision to new post" do
      subject { Revision.new(revision.dup.attributes) }

      it { expect(subject.valid?).to be_truthy }
    end

    describe "adding revision to approved post" do
      before { Post.any_instance.stub :status => "approved" }

      subject { Revision.new(revision.dup.attributes) }

      it { expect(subject.valid?).to be_falsey }
    end
  end

  describe "#update_post_status" do
    context "update_post_status doesn't change status when" do
      ["approved", "scheduled", "published"].each do |status|
        context "old status is #{status}" do
          before do
            revision.post.stub(:status => status.to_s)
            revision.post.stub(:update_attributes => revision.post.valid?)
            revision.update_post_status
          end

          it { expect(revision.update_post_status).to be_falsey }

          it { expect(revision.errors.full_messages.any? { |msg| msg["com status"]}).to be_truthy }
        end
      end
    end

    context "changes status when" do
      ["", nil, "refused", "adjustment_pending", "schedule_canceled", "publication_error"].each do |status|
        context "old status is #{status}" do
          before do
            revision.stub(:revisions_count => 2)
            revision.post.stub(:status => status.to_s)
            revision.post.stub(:update_attributes => revision.valid?)
          end

          it { expect(revision.update_post_status).to be_truthy }
        end
      end
    end

    context "doesn't change status when when only one revision" do
      before do
        revision.stub(:revisions_count => 1)
        revision.post.stub(:status => "refused")
        revision.post.stub(:update_attributes => revision.valid?)
      end

      it { expect(revision.update_post_status).to be_falsey }

    end

  end
end
