require "spec_helper"

describe Api::CommentsController do
  let(:comment) { comments(:johns_comment) }
  let(:user) { users(:john) }
  let(:reviewer) { reviewers(:joe) }
  let(:one_post){ posts(:fb_post) }
  let(:revision) { revisions(:fb_revision) }

  before do
    sign_in(user)
    Comment.stub(:new => comment)
  end

  describe "#create" do
    context "when valid" do
      before do
        comment.stub(:all_subscribers => [])
        comment.stub(:save => comment.valid?)

        post :create,
             :params => {
               :body => comment.body,
               :revision_id => comment.revision_id
             }
      end

      it { response.body.should eq(CommentSerializer.new(comment).to_json) }

      [nil, :adjusted].each do |status|
        context "when post status is #{status}" do
          before do
            comment.stub(:all_subscribers => [])
            comment.stub(:save => comment.valid?)
            one_post.status = "adjusted"

            post :create,
                 :params => {
                   :body => comment.body
                 }
          end

          it { response.body.should eq(CommentSerializer.new(comment).to_json) }
          it { expect(one_post.status).to eq "adjusted" }
        end
      end
    end

    context "when uuid present" do
      before do
        sign_out(user)

        comment.comment_author = reviewer
        comment.revision.stub(:post => one_post)
        AccessToken.stub_chain(:find_by_uuid).and_return(reviewer.access_tokens.first)
        AccessToken.any_instance.stub_chain(:package, :client, :organization_id).and_return(1)
        comment.stub(:save => comment.valid?)

        post :create,
             :params => {
               :revision_id => revision.id,
               :body => comment.body,
               :uuid => "valid"
             }
      end

      it { response.body.should eq(CommentSerializer.new(comment).to_json) }


      [nil, :adjusted].each do |status|
        context "when post status is #{status}" do
          before do
            one_post.status = status

            post :create,
                 :params => {
                   :revision_id => revision.id,
                   :uuid => "valid",
                   :body => comment.body
                 }
          end
          it { expect(one_post.status).to eq "adjustment_pending" }
        end
      end
    end

    context "when invalid" do
      before do
        comment.body = ""

        post :create,
             :params => {
               :body => ""
             }
      end

      it { response.body.should eql(comment.errors.full_messages.to_json) }
    end

  end
end
