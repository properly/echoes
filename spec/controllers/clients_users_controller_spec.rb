require "spec_helper"

describe Api::ClientsUsersController do
  let(:client) { clients(:company) }
  let(:client_2) { clients(:company_2) }
  let(:user) { users(:john) }
  let(:member) { users(:member) }
  let(:organization) { organizations(:org) }

  before do
    User.any_instance.stub(:owner => false)
    sign_in(user)
  end

  describe "#available" do
    before do
      @new_user = User.new

      Client.stub(:find => client)

      User.stub(:includes) do |where|
        double('members', :first => user).tap do |proxy|
          proxy.stub(:where) do |includes|
            [user, @new_user]
          end
        end
      end

      get :available,
          :params => {
            :client_id => client.id
          }
    end

    it { expect(response).to be_success }

    it { response.body.should eq(ActiveModel::ArraySerializer.new([user, @new_user], :each_serializer => ClientUserSerializer, :client_id => client.id).to_json) }
  end

  describe "#create" do
    context "when valid" do
      before do
        post :create,
             :params => {
               :client_id => client_2.id,
               :user_id => user.id
             }
      end

      it { JSON.parse(response.body)["has_permission"].should be true }

      it { expect(response).to be_success }

      it { client.users.count.should eql(2) }
    end

    context "when invalid" do
      before do
        post :create,
             :params => {
               :client_id => client.id,
               :user_id => 122
             }
      end
      it { expect(response.status).to be 403 }
    end
  end

  describe "#remove" do
    before do
      Client.stub(:find => client)
      User.stub(:find => member)

      delete :destroy,
             :params => {
               :client_id => client.id,
               :user_id => member.id
             }
    end

    it { expect(response).to be_success }

    it { JSON.parse(response.body)["has_permission"].should be false }
  end
end
