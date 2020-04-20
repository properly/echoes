require "spec_helper"

describe Organization do
  let(:organization) { organizations(:org) }


  describe "validations" do
    context "when name is not present" do
      before do
        organization.name = ""
      end

      it { organization.should have(1).error_on(:name) }
    end
  end
end
