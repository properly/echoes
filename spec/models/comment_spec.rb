require "spec_helper"

describe Comment do
  let(:comment) { comments(:johns_comment) }
  let(:second_user) { create(:user, :email => "second@email.com") }
  let(:revision) { revisions(:fb_revision) }
  let(:fb_post) { posts(:fb_post) }
  let(:reviewer) { reviewers(:joe) }
  before do
    @post = fb_post
  end

  describe "validations" do
    context "when body is not present" do
      before do
        comment.body = ""
      end

      it { expect(comment).to have(1).error_on(:body) }
    end

    context "when comment does not have an author" do
      before do
        comment.comment_author = nil
      end

      it { expect(comment).to have(1).error_on(:comment_author_id) }
    end
  end

  describe "#all_subscribers" do
    it { expect(comment.all_subscribers.include?(reviewer)).to be_truthy }
  end

end
