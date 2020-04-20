require "spec_helper"

describe Api::UsersController do
  let(:user) { users(:john) }

  describe "#index" do
    before do
      sign_in user

      get :index
    end

    it { response.status.should be(200) }
    it { JSON.parse(response.body).length.should be(2) }
  end


  describe "#create" do

    context "when valid" do
      before do
        post :create,
             :params => {
               :email => "john_2@example.org",
               :name => "John",
               :password => "valid_password"
             }
      end

      it "skip authorize and be success" do
        response.status.should be(201)
      end

    end

    context "when trying to assign organization" do
      before do
        post :create,
             :params => {
               :email => "john_2@example.org",
               :name => "John",
               :organization_id => 22,
               :password => "valid_password"
             }
      end

      it { response.status.should be(403) }
    end

    context "when invalid" do

      before do
        post :create,
             :params => {
               :email => "invalid"
             }
      end

      it "skip authorize and be invalid" do
        response.status.should be(422)
      end

    end
  end


  describe "#destroy" do
    before do
      User.stub(:find => user)
      sign_in user
    end

    context "when not owner" do
      before do
        user.stub(:owner => false)
        delete :destroy,
               :params => {
                 :id => user.id
               }
      end

      it { response.status.should be(200) }
      it { response.body.should eq("") }
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
  describe "#update" do
    before do
      sign_in user
    end

    context "when trying to change email" do
      before do
        post :update,
             :params => {
               :id => user.id,
               :email => "user.email@teset.se"
             }
      end

      it { response.status.should be(202) }
    end

    context "when trying to change organization" do
      before do
        User.stub(:find => user)

        post :update,
             :params => {
               :id => user.id,
               :organization_id => 22,
               :email => user.email
             }
      end

      it { response.status.should be(403) }
    end
  end

  describe "#invite" do
    before do
      sign_in user
    end

    context "when user already a member" do
      before do
        User.stub(:find_by_email => user)

        post :invite,
             :params => {
               :organization_id => user.organization_id,
               :email => user.email
             }
      end

      it { response.status.should be(422) }
    end

    context "when user already in other organization" do
      before do
        @u = User.new({
                        :name => "Second User",
                        :email => "second@user.com",
                        :organization_id => user.organization_id + 1
                      })

        User.stub(:find_by_email => @u)

        post :invite,
             :params => {
               :organization_id => user.organization_id,
               :email => user.email
             }
      end

      it { response.status.should be(422) }
    end

    context "when malicious" do
      before do
        post :invite,
             :params => {
               :organization_id => "22",
               :name => "name",
               :email => "third@user.com"
             }
      end

      it { response.status.should be 403 }
      it { response.body.should match(/authorized/) }
    end

    context "when valid" do
      before do
        User.stub(:save => user)
        User.stub(:find_by_email => nil)

        post :invite,
             :params => {
               :organization_id => user.organization_id,
               :email => "john_2@example.org"
             }
      end

      it { response.status.should be(200) }
    end

    context "when invalid" do
      before do
        user.email = ""
        user.valid?
        User.stub(:find_by_email => nil)

        User.stub(:invite! => user)

        post :invite,
             :params => {
               :organization_id => user.organization_id,
               :email => "john_2@example.org"
             }
      end

      it { response.status.should be(422) }
    end
  end

  describe "#accept_invitation" do
    context "when invalid" do
      before do
        User.stub(:find_by => user)

        post :accept_invitation,
             :params => {
               :name => "Name",
               :invitation_token => "token",
               :password => "yui"
             }
      end

      it { response.status.should be(422) }

      it { response.body.should eq(user.errors.full_messages.to_json) }
    end

    context "when malicious" do
      before do
        User.stub(:find_by => user)

        post :accept_invitation,
             :params => {
               :organization_id => "22",
               :name => "name",
               :invitation_token => "token",
               :password => "qwertyui"
             }
      end

      it { response.status.should be 403 }
      it { response.body.should match(/authorized/) }
    end

    context "when valid" do
      before do
        User.stub(:find_by => user)

        post :accept_invitation,
             :params => {
               :name => "name",
               :invitation_token => "token",
               :password => "qwertyui"
             }

        @new_user = user
        @new_user.name = "name"
      end

      it { response.status.should be(200) }

      it { response.body.should eq(UserSerializer.new(@new_user).to_json) }
    end
  end

  describe "#send_reset_password_instructions" do
    context "when no user was found" do
      before do
        User.stub(:find_by_email => nil)

        put :send_reset_password_instructions,
            :params => {
              :email => user.email
            }
      end

      it { response.status.should be(422) }
    end

    context "when email was sent" do
      before do
        User.stub(:find_by_email => user)
        user.stub(:send_reset_password_instructions => user.valid?)

        put :send_reset_password_instructions,
            :params => {
              :email => user.email
            }
      end

      it { response.status.should be(200) }

      it { response.body.should eq(UserSerializer.new(user).to_json) }
    end

    context "when email was not sent" do
      before do
        User.stub(:find_by_email => user)
        user.email = ""
        user.stub(:send_reset_password_instructions => user.valid?)

        put :send_reset_password_instructions,
            :params => {
              :email => user.email
            }
      end

      it { response.status.should be(422) }
    end
  end

  describe "#reset_password" do
    context "when reset is successfull" do
      before do
        User.stub(:reset_password_by_token => user)

        put :reset_password,
            :params => {
              :email => user.email,
              :password => "abc",
              :reset_password_token => "abc"
            }
      end

      it { response.status.should be(200) }

      it { response.body.should eq(UserSerializer.new(user).to_json) }
    end

    context "when token is invalid" do
      before do
        User.stub(:reset_password_by_token => nil)

        put :reset_password,
            :params => {
              :email => user.email,
              :password => "abc"
            }
      end

      it { response.status.should be(422) }
    end
  end
end
