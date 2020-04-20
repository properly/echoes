require "spec_helper"

describe Api::PostsController do
  let(:fb_post) { posts(:fb_post) }
  let(:package) { packages(:short_package) }
  let(:client) { clients(:company) }
  let(:user) { users(:john) }
  let(:token) { access_tokens(:clients_token) }
  let(:organization) { organizations(:org) }

  before do
    fb_post.stub(:package => package)
    fb_post.stub(:client => client)

    sign_in(user)
  end

  describe "#index" do
    before do
      Post.stub(:by_user => [fb_post])
    end

    context "without filter" do
      before do
        get :index
      end

      it { expect(response.status).to eql(403) }
    end

    context "with filter" do
      before do
        get :index,
            :params => {
              :package_id => fb_post.package_id
            }
      end

      it { expect(response).to be_success }

      it {
        response.body.should
        eq(
          ActiveModel::ArraySerializer.new(
             Post.where(package_id: fb_post.package_id),
             :each_serializer => PostNameSerializer
          ).to_json
        )
      }
    end

    describe "reviewer" do
      before do
        sign_out(user)
      end

      context "with valid token" do
        before do
          get :index,
              :params => {
                :package_id => fb_post.package_id,
                :uuid => token.uuid
              }
        end

        it { expect(response).to be_success }

        it {
          response.body.should
          eq(
            ActiveModel::ArraySerializer.new(
               Post.where(package_id: fb_post.package_id),
               :each_serializer => PostNameSerializer
            ).to_json
          )
        }
      end
    end

    context "with valid token, wrong package" do
      before do
        get :index,
            :params => {
              :package_id => 2,
              :uuid => token.uuid
            }
      end

      it { expect(response).to be_success }

      it { response.body.should eq([].to_json) }
    end

    context "with invalid token" do
      before do
        get :index,
            :params => {
              :package_id => fb_post.package_id,
              :uuid => "invalid token"
            }
      end

      it { expect(response.status).to be 403 }

      it { response.body.should match(/not authorized/) }
    end
  end

  describe "#show" do
    before do
      AccessToken.stub(:find_by_uuid => token)
      Post.stub_chain(:find).and_return(fb_post)

      get :show,
          :params => {
            :id => 1
          }
    end

    it { expect(response).to be_success }

    it { response.body.should eq(PostSerializer.new(fb_post).to_json) }
  end

  describe "#create" do
    context "when valid" do
      before do
        fb_post.stub(:package_id => package.id)
        Post.stub(:new => fb_post)
        fb_post.stub(:save => fb_post.valid?)

        post :create,
             :params => {
               :post => {
                 :name => "Other",
                 :package_id => package.id,
                 :scheduled_at => DateTime.now
               }
             }
      end

      it { response.body.should eq(PostSerializer.new(fb_post).to_json) }
    end

    context "when invalid" do
      before do
        fb_post.name = ""
        fb_post.valid?

        post :create,
             :params => {
               :name => "",
               :package_id => package.id,
               :scheduled_at => (DateTime.now + 1.day).to_s
             }
      end

      it { response.body.should eq(fb_post.errors.full_messages.to_json) }
    end
  end

  describe "#update" do
    before { Post.stub(:find => fb_post) }
    before { fb_post.stub(:save => fb_post.valid?) }

    context "revoking approval" do
      before do
        fb_post.stub(:has_reviewer_comments_on_last_revision => true)
        fb_post.status = "approved"
        put :update,
            :params => {
              :id => fb_post.id,
              :status => ""
            }
      end

      it { expect(response.status).to be(200) }
      it { expect(JSON.parse(response.body)["status"]).to eq("adjustment_pending") }

    end

    context "revoking approval on commented post" do
      before do
        fb_post.stub(:has_reviewer_comments_on_last_revision => false)
        fb_post.revisions.stub(:count => 2)
        fb_post.status = "approved"
        put :update,
            :params => {
              :id => fb_post.id,
              :status => ""
            }
      end

      it { expect(response.status).to be(200) }
      it { expect(JSON.parse(response.body)["status"]).to eq("adjusted") }

    end

    context "approving post" do
      before do
        fb_post.status = ""
        put :update,
            :params => {
              :id => fb_post.id,
              :status => "approved"
            }
      end

      it { expect(response.status).to be(200) }
      it { expect(JSON.parse(response.body)["status"]).to eq("approved") }

    end
  end

  describe "#destroy" do
    before do
      Post.stub(:find => fb_post)
      fb_post.stub(:destroy => fb_post.valid?)

      delete :destroy,
             :params => {
               :id => fb_post.id
             }
    end

    it { expect(response).to be_success }

    it { response.body.should eq("") }
  end
end
