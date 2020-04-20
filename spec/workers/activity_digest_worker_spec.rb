require "spec_helper"

describe ActivityDigestWorker do
  let(:user) { users(:john) }
  let(:user_attributes) { {:email => user.email} }
  let(:worker) { ActivityDigestWorker.new }

  describe "#perform(:id)" do
  end

  context "helper methods" do
    before {
      worker.instance_variable_set(:@owner, user)
    }

    describe "#digest_pending" do
      it "is true if something was sent last hour" do
        allow(user).to receive_message_chain(
          :last_sent_digest, :sent_at
        ).and_return(Time.now - 5.minutes)

        expect(worker.send(:digest_pending)).to be_truthy
      end

      it "is false if nothing was ever sent" do
        allow(user).to receive_message_chain(
          :last_sent_digest, :sent_at
        ).and_return(nil)

        expect(worker.send(:digest_pending)).to be_truthy
      end

      it "is false if nothing was sent last hour" do
        allow(user).to receive_message_chain(
          :last_sent_digest, :sent_at
        ).and_return(Time.now - 2.hours)

        expect(worker.send(:digest_pending)).to be_truthy
      end
    end
  end

end
