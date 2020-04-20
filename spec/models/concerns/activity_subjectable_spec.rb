require "spec_helper"

describe ActivitySubjectable do
  before do
    class Subject; end
    allow(Subject).to receive(:has_many)
    allow(Subject).to receive(:scope)
  end

  after do
    Object.send(:remove_const, :Subject)
  end

  context "relations" do
    it {
      expect(Subject).to receive(:has_many).with(:activities, { as: :subject })
      Subject.send(:include, ActivitySubjectable).new
    }
  end

  context "scopes" do
    it {
      expect(Subject).to receive(:scope).with(:with_pending_activities, an_instance_of(Proc))
      Subject.send(:include, ActivitySubjectable).new
    }
  end

  context "methods" do
    let(:user) { Subject.send(:include, ActivitySubjectable).new }


    describe "#latest_delivered_notification" do
      it "receives scopes" do
        expect(user).to receive_message_chain(:activities, :where, :not, :order, :limit, :last)
        user.send(:latest_delivered_notification)
      end
    end
  end
end
