require "spec_helper"

describe Api::OrganizationsController do
  let(:organization) { organizations(:org) }
  let(:user) { users(:john) }

  before do
    sign_in(user)
  end

  describe "#show" do
    before do
      Organization.stub(:find => organization)

      get :show,
          :params => {
            :id => organization.id
          }
    end

    it { response.body.should eq(OrganizationSerializer.new(organization).to_json) }
  end

  describe "#create" do
    context "when valid" do
      before do
        Organization.stub(:new => organization)
        organization.stub(:save => organization.valid?)

        post :create,
             :params => {
               :name => "My Organization",
             }

      end

      it { response.body.should eq(OrganizationSerializer.new(organization).to_json) }
    end

    context "when invalid" do
      before do
        organization.name = ""
        organization.valid?

        Organization.stub(:new => organization)

        post :create
      end

      it { response.body.should eq(organization.errors.full_messages.to_json) }
    end
  end

  describe "#update" do
    context "when valid" do
      before do
        Organization.stub(:find => organization)
        organization.stub(:save => organization.valid?)

        put :update,
            :params => {
              :id => organization.id,
              :name => "My Organization",
            }
      end

      it { response.body.should eq(OrganizationSerializer.new(organization).to_json) }
    end

    context "when invalid" do
      before do
        organization.name = ""
        organization.valid?

        Organization.stub(:find => organization)

        put :update,
            :params => {
              :id => organization.id,
            }
      end

      it { response.body.should eq(organization.errors.full_messages.to_json) }
    end

    context "users are left untouched" do
      before do
        Organization.stub(:find => organization)
        organization.stub(:save => organization.valid?)

        put :update,
            :params => {
              :id => organization.id,
              :name => "My Organization",
              :users => []
            }
      end

      it { organization.users.count.should eq(2)}
    end
  end

  describe "#current" do
    before do
      get :current
    end

    it { response.body.should eq(OrganizationSerializer.new(organization).to_json) }
  end

  describe "#destroy" do
    before do
      User.stub(:find => user)
      Organization.stub(:find => organization)
    end

    context "when not owner" do
      before do
        User.any_instance.stub(:admin? => false)
        delete :destroy,
               :params => {
                 :id => user.id
               }
      end

      it { response.status.should be(403) }
      it { response.body.should match(/authorized/) }
    end

    context "when owner" do
      before do
        user.stub(:owner => true)
      end

      before do
        delete :destroy,
               :params => {
                   :id => user.id
               }
      end

      it { response.status.should be(200) }
      it { response.body.should eq("") }
    end

  end
end
