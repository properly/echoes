require "spec_helper"

describe Api::ContentsController do
  let(:content) { contents(:fb_content) }
  let(:revision) { revisions(:fb_revision) }
  let(:user) { users(:john) }
  let(:other_organization) {
    create(
      :organization,
    )
  }

  before do
    sign_in(user)
  end


  describe "#create" do
    context "when valid" do
      before do
        Content.stub(:new => content)
        content.stub(:save => content.valid?)

        post :create,
             :params => {
               :target => "twitter",
               :revision_id => revision.id,
               :image => "xx.jpg",
               :body => "abc"
             }
      end

      it { response.body.should eq(ContentSerializer.new(content).to_json) }
    end

    context "when invalid" do
      before do
        content.target = ""
        content.valid?

        post :create,
             :params => {
               :target => "",
               :revision_id => revision.id,
               :body => "abc"
             }
      end

      it { response.body.should eq(content.errors.full_messages.to_json) }
    end
  end

  describe "#delete" do
    context "own content" do
      before do
        Content.stub(:find => content)
        content.stub(:destroy => content.valid?)

        delete :destroy,
               :params => {
                 :id => content.id
               }
      end

      it { response.status.should eq(200) }
    end

    context "other content" do
      before do
        revision.post.package.client.stub(:organization_id => other_organization.id)
        Content.stub(:find => content)
        content.stub(:revision => revision)
        content.stub(:destroy => content.valid?)

        delete :destroy,
               :params => {
                 :id => content.id
               }
      end

      it { response.body.should match(/message\":/) }

      it { response.status.should eq(403) }
    end
  end
end
