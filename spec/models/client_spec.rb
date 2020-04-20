require "spec_helper"

describe Client do
  let(:client) { clients(:company) }
  let(:organization) { organizations(:org) }
  let(:access_token) { access_tokens(:clients_token) }

  describe "validations" do
    context "when name is not present" do
      before do
        client.name = ""
      end

      it { client.should have(1).error_on(:name) }
    end

    context "when organization is not present" do
      before do
        client.stub(:organization => nil)
      end

      it { client.should have(1).error_on(:organization) }
    end
  end

  describe "#access_tokens" do
    it { client.access_tokens.should eq [access_token]}
  end
end
