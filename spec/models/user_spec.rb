require "spec_helper"

describe User do
  let(:user) { users(:john) }

  describe "validations" do
    context "when email is not valid" do
      before do
        user.email = "invalid"
      end

      it { user.should have(1).error_on(:email) }
    end

    context "when email is not unique" do
      subject { User.new(
          :email => user.email,
          :password => "valid_password",
          :password_confirmation => "valid_password"
      )}
      it { should have(1).error_on(:email) }

    end

    context "when terms_of_use is false" do
      subject { User.new(
          :email => "valid@email.com",
          :password => "valid_password",
          :terms_of_use => false,
          :password_confirmation => "valid_password"
      )}

      it { should have(1).error_on(:terms_of_use) }
    end
  end

  describe "#accept_invite_link" do
    subject { user.accept_invite_link("abc") }

    it { should eql("http://localhost/organizations/invitations/accept?token=abc") }
  end

  describe "#reset_password_link" do
    subject { user.reset_password_link("abc") }

    it { should eql("http://localhost/password?resetPasswordToken=abc") }
  end

  describe "#invited_by" do
    before do
      User.stub(:find => user)
    end

    it { user.invited_by.should eql(user)  }
  end

  describe "suberadmin?" do
    context "when not superadmin" do
      before do
        user.stub(:email => "qualquercoisa@email.test")
      end

      it { user.superadmin?.should be_falsey}
    end

    context "when superadmin" do
      before do
        user.stub(:email => "admin@email.test")
      end

      it { user.superadmin?.should be_truthy}
    end
  end

  describe "admin?" do
    context "when not admin" do
      before do
        user.stub(:owner => false)
      end

      it { user.admin?.should be_falsey}
    end

    context "when admin" do
      before do
        user.stub(:owner => true)
      end

      it { user.admin?.should be_truthy}
    end
  end

  describe "member?" do
    context "when not admin" do
      before do
        user.stub(:owner => false)
      end

      it { user.member?.should be_truthy}
      it { User.new.member?.should be_falsey}
    end

    context "when admin" do
      before do
        user.stub(:owner => true)
      end

      it { user.member?.should be_falsey}
    end
  end

  describe "#role" do
    context "superadmin" do
      before do
        user.stub(:email => "admin@email.test")
      end

      it {user.role.should eq "superadmin" }
    end

    context "admin" do
      before do
        user.stub(:owner => true)
      end

      it {user.role.should eq "admin" }
    end

    context "member" do
      before do
        user.stub(:owner => false)
      end

      it {user.role.should eq "member" }
    end

    context "guest" do
      it {User.new.role.should eq "guest" }
    end

  end

end
