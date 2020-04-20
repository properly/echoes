# coding: utf-8
require "spec_helper"

describe Api::SessionsController do
  let(:user) { users(:john) }
  let(:reviewer) { reviewers(:joe) }

  describe "#create" do

    context "with valid password" do
      before do
        User.any_instance.stub(:to_json => user.to_json)
        post :create,
             :params => {
               :email => user.email,
               :password => "password",
             },
             :format => :json
      end

      it { expect( response.body).to eq(UserSerializer.new(user).to_json) }

      it { expect(response.status).to be(201) }

    end

    context "with invalid password" do
      before do
        post :create,
             :params => {
               :email => user.email,
               :password => "invalidpassword",
             },
        :format => :json
      end

      it { expect(response.status).to be(401) }
      it { expect(response.body).to match(/inválido/) }

    end
  end

  describe "#destroy" do
    context "signed out" do
      before do
        delete :destroy,
               :format => :json

      end

      it { expect(response.body).to match(/error/)}
      it { expect(response.status).to be 401 }
    end

    context "signed in" do
      before do
        sign_in user
        delete :destroy,
               :format => :json
      end

      it { expect(response.body).to eq("")}
      it { expect(response.status).to be 200 }
    end
  end

  describe "#current" do
    context "signed in, admin" do
      before do
        sign_in user
        get :current
      end

      it { expect(JSON.parse(response.body)["role"]).to eq "admin" }
    end

    context "signed in, superadmin" do
      before do
        User.any_instance.stub(:email => "admin@email.test")
        sign_in user
        get :current
      end

      it { expect(JSON.parse(response.body)["role"]).to eq "superadmin" }
    end

    context "signed out" do
      before do
        sign_out user
        get :current
      end

      it { expect(JSON.parse(response.body)["role"]).to eq "guest" }
    end

    context "signed in, member" do
      before do
        User.any_instance.stub(:owner => false)
        sign_in user
        get :current
      end

      it { expect(JSON.parse(response.body)["role"]).to eq "member" }
    end

    context "reviewer" do
      before do
        sign_out user
      end

      context "valid token" do
        before do
          get :current,
              :params => {
                :uuid => reviewer.access_tokens.last.uuid
              }
        end

        it { expect( JSON.parse(response.body)["role"]).to eq "reviewer" }
      end

      context "valid token" do
        before do
          get :current,
              :params => {
                :uuid => "invalid token"
              }
        end

        it { expect( JSON.parse(response.body)["role"]).to eq "guest" }
      end

    end

  end

end
