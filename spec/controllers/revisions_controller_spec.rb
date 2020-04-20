require "spec_helper"

describe Api::RevisionsController do
  let(:revision) { revisions(:fb_revision) }
  let(:user) { users(:john) }

  before do
    sign_in(user)
  end

  describe "#index" do
    before do
      Revision.stub_chain(:accessible_by, :includes, :where).and_return([revision])

      get :index,
          :params => {
            :post_id => 1
          }
    end

    it { expect(response).to be_success }

    it { response.body.should eq(ActiveModel::ArraySerializer.new([revision]).to_json) }

  end

  describe "#create" do
    context "when valid" do
      before do
        Revision.stub(:new => revision)
        revision.stub(:save => revision.valid?)
        revision.stub(:update_post_status)

        post :create,
             :params => {
               :post_text => "Other text"
             }
      end

      it { expect(revision).to have_received(:update_post_status) }

      it { response.body.should eq(RevisionSerializer.new(revision).to_json) }
    end
  end

  describe "#update" do
    context "when valid" do
      before do
        Revision.stub(:find => revision)
        revision.stub(:save => revision.valid?)

        put :update,
            :params => {
              :id => revision.id,
              :post_text => "Other text"
            }
      end

      it { response.body.should eq(RevisionSerializer.new(revision).to_json) }
    end
  end

  describe "#destroy" do
    before do
      Revision.stub(:find => revision)
      revision.stub(:destroy => revision.valid?)

      delete :destroy,
             :params => {
               :id => revision.id
             }
    end

    it { response.body.should eq("") }
  end
end
