require "spec_helper"

describe AccessToken do
  let(:token) { access_tokens(:clients_token) }

  describe "validations" do
    context "when uuid is not present" do
      before do
        token.stub(:uuid => "")
      end

      it { token.should have(1).error_on(:uuid) }
    end
  end

  describe "uuid generation" do
    before do
      token.uuid = nil
    end

    it { token.uuid.should be nil }

    it {token.valid?; token.uuid.length.should be 22 }

  end

  describe "link" do
    before do
      token.stub(:uuid => "uuid")
    end
    context "without id" do
      it { token.link.should eq "http://localhost/reviews/uuid/posts/"}
    end
    context "with id" do
      it { token.link(2).should eq "http://localhost/reviews/uuid/posts/2"}
    end
  end
end
