require "spec_helper"

describe Package do
  let(:package) { packages(:short_package) }
  let(:post) { posts(:fb_post) }
  let(:organization) { organizations(:org) }
  let(:client) { clients(:company) }

  describe "validations" do
    context "when email is not valid" do
      before do
        package.contact_email = "invalid"
      end

      it { package.should have(1).error_on(:contact_email) }
    end

    context "when name is not present" do
      before do
        package.name = ""
      end

      it { package.should have(1).error_on(:name) }
    end

    context "when user is not present" do
      before do
        package.stub(:user => nil)
      end

      it { package.should have(1).error_on(:user) }
    end

    context "when client is not present" do
      before do
        package.stub(:client => nil)
      end

      it { package.should have(1).error_on(:client) }
    end
  end

  describe "#organization_id" do
    before do
      package.stub_chain(:client).and_return(client)
    end

    it { package.organization_id.should eql(organization.id) }

  end

  describe "#sent_for_review" do

    context "no access_token" do
      before do
        package.stub :access_tokens_count => 0
      end

      subject { package.sent_for_review }
      it { should  be_falsey}

    end

    context "with access_token" do
      before do
        package.stub :access_tokens_count => 1
      end

      subject { package.sent_for_review }
      it { should  be_truthy}

    end
  end

end
