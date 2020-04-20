require "spec_helper"

describe Api::PackagesController do
  let(:package) { packages(:short_package) }
  let(:client) { clients(:company) }
  let(:user) { users(:john) }
  let(:token) { access_tokens(:clients_token) }

  before do
    sign_in(user)
  end

  describe "#index" do
    before do
      Package.stub_chain(:by_organization, :for_client).and_return([package])

      get :index
    end

    it { expect(response).to be_success }

    it { response.body.should eq(ActiveModel::ArraySerializer.new([package], :each_serializer => PackageSerializer).to_json) }

  end

  describe "#create" do
    context "when valid" do
      before do
        Package.stub(:new => package)
        package.stub(:save => package.valid?)

        post :create,
             :params => {
               :name => "Other",
               :client_id => client.id
             }
      end

      it { response.body.should eq(PackageSerializer.new(package).to_json) }
    end

    context "when invalid" do
      before do
        package.name = ""
        package.valid?

        post :create,
             :params => {
               :name => "",
               :client_id => client.id
             }
      end

      it { response.body.should eq(package.errors.full_messages.to_json) }
    end
  end

  describe "#update" do
    context "when valid" do
      before do
        Package.stub(:find => package)
        package.stub(:save => package.valid?)

        put :update,
            :params => {
              :id => package.id,
              :name => "Other"
            }
      end

      it { response.body.should eq(PackageSerializer.new(package).to_json) }
    end

    context "when invalid" do
      before do
        Package.stub(:find => package)
        package.name = ""
        package.valid?

        put :update,
            :params => {
              :id => package.id,
              :name => ""
            }
      end

      it { response.body.should eq(package.errors.full_messages.to_json) }
    end
  end

  describe "#uuid" do
    before do
      sign_out(user)
      AccessToken.stub(:find_by_uuid).with("valid").and_return(token)
      AccessToken.stub(:find_by_uuid).with("invalid").and_return(nil)
      Package.stub_chain(:with_posts, :by_organization, :for_client).and_return([package])
    end

    context "with valid access token" do
      before do

        get :uuid,
            :params => {
              :uuid => "valid"
            }
      end

      it { expect(response).to be_success }

      it { expect(response.status).to be 200 }

      it { response.body.should eq(PackageSerializer.new(package).to_json) }
    end

    context "with invalid access token" do
      before do
        get :uuid,
            :params => {
              :uuid => "invalid"
            }
      end

      it { expect(response).to be_forbidden }

      it { expect(response.status).to be 403 }

      it { response.body.should match(/not authorized/) }
    end
  end

  describe "#delete" do
    before do
      delete :destroy,
             :params => {
               :id => package.id
             }
    end

    it { response.body.should eq("") }
  end

end
