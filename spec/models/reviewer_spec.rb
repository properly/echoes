require "spec_helper"

describe Reviewer do
  let(:reviewer) { reviewers(:joe) }
  let(:client) { clients(:company) }

  describe "validations" do
    context "when email is not valid" do
      before do
        reviewer.email = "invalid"
      end

      it { reviewer.should have(1).error_on(:email) }
    end

    context "when email is not unique" do
      subject { Reviewer.new(:email => reviewer.email) }
      it { should have(1).error_on(:email) }
    end

    context "when client is not present" do
      before do
        reviewer.clients = []
      end

      it { reviewer.should have(1).error_on(:clients) }
    end

  end

  describe "#push_client" do
    before do
      reviewer.stub(:clients => [client])
      reviewer.stub(:"<<" => [1, 2])
    end

    context "when client is already included" do
      before do
        reviewer.stub_chain(:clients, :include?).and_return(true)
      end

      it { reviewer.push_client(client).should be_nil }

    end

    context "when client is not included" do
      before do
        reviewer.stub_chain(:clients, :include?).and_return(false)
      end

      it { reviewer.push_client(client).size.should be(2) }
    end
  end

  describe "#role" do
    it { reviewer.role.should eq "reviewer" }
  end
end
