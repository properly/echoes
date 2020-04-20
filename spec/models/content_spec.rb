require "spec_helper"

describe Content do
  let(:content) { contents(:fb_content) }

  describe "validations" do
    context "when revision is not present" do
      before do
        content.stub(:revision => nil)
      end

      it { content.should have(1).error_on(:revision) }
    end

    context "when target is not present" do
      before do
        content.target = ""
      end

      it { content.should have(1).error_on(:target) }
    end
  end

  describe "#organization_id" do
    before do
      content.stub_chain(:revision, :organization_id).and_return(1)
    end

    it { content.organization_id.should eq 1 }
  end

end
