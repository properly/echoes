require "spec_helper"

describe ActivityOwnerable do
  before do
    class Owner; end
    allow(Owner).to receive(:has_many)
    allow(Owner).to receive(:scope)
  end

  after do
    Object.send(:remove_const, :Owner)
  end

  context "relations" do
    it {
      expect(Owner).to receive(:has_many).with(:activities, { as: :subject })
      Owner.send(:include, ActivitySubjectable).new
    }
  end

  context "scopes" do
    it {
      expect(Owner).to receive(:scope).with(:with_pending_activities, an_instance_of(Proc))
      Owner.send(:include, ActivitySubjectable).new
    }
  end

  context "methods" do
    let(:user) { Owner.send(:include, ActivitySubjectable).new }


    describe "#latest_delivered_notification" do
      it "receives scopes" do
        expect(user).to receive_message_chain(:activities, :where, :not, :order, :limit, :last)
        user.send(:latest_delivered_notification)
      end
    end
  end
end
