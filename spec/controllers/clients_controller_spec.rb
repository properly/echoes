# coding: utf-8
require "spec_helper"

describe Api::ClientsController do
  let(:client) { clients(:company) }
  let(:client_2) { clients(:company_2) }
  let(:user) { users(:john) }
  let(:user_2) { users(:member) }
  let(:organization) { organizations(:org) }

  before do
    sign_in(user)
  end

  describe "#index" do
    before do
      Client.stub_chain(:with_packages, :for_organization).and_return([client])

      get :index
    end

    it { expect(response).to be_success }

    it { response.body.should eq(ActiveModel::ArraySerializer.new([client], :each_serializer => ClientSerializer).to_json) }
  end

  describe "#create" do
    context "when not logged" do
      before do
        sign_out(user)

        post :create,
             :params => {
               :client => {
                 :name => "Other",
                 :organization_id => organization.id,
               }
             },
             :format => :json
      end

      it { response.status.should be(401) }
    end

    context "when valid" do
      before do
        Client.stub(:new => client_2)
        client.stub(:save => client_2.valid?)

        post :create,
             :params => {
               :client => {
                 :name => "Other"
               }
             }
      end

      it { response.body.should eq(ClientSerializer.new(client_2).to_json) }

      it { client_2.users.should include(user) }

    end

    describe "with two owners" do
      before do
        User.stub(:owners => [user, user_2])
        user_2.stub(:owner => true)

        Client.stub(:new => client_2)
        client.stub(:save => client_2.valid?)

        post :create,
             :params => {
               :client => {
                 :name => "Other"
               }
             }
      end

      it { client_2.users.count.should eql(2) }
    end

    context "when invalid" do
      before do
        client.name = ""
        client.valid?

        post :create,
             :params => {
               :client => {
                 :name => ""
               }
             }
      end

      it { response.body.should match(/Nome não/) }
    end
  end

  describe "#update" do
    context "when valid" do
      before do
        Client.stub(:find => client)
        client.stub(:save => client.valid?)

        put :update,
            :params => {
              :id => client.id,
              :name => "Other"
            }
      end

      it { response.body.should eq(ClientSerializer.new(client).to_json) }
    end

    context "when invalid" do
      before do
        Client.stub(:find => client)
        client.name = ""
        client.valid?

        put :update,
            :params => {
              :id => client.id,
              :name => ""
            }
      end

      it { response.body.should eq(client.errors.full_messages.to_json) }
    end
  end

  describe "#delete" do
    before do
      Client.stub(:find => client)
      client.stub(:save => client.valid?)

      delete :destroy,
             :params => {
               :id => client.id
             }
    end

    it { response.body.should eq("") }
  end
end
