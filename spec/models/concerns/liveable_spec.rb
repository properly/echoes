require "spec_helper"

describe Liveable do
  before do
    class Live; end
    Live.stub(:after_commit)
    Live.stub(:before_destroy)
    Live.stub(:after_destroy)
    Live.any_instance.stub(:[])
  end

  after do
    Object.send(:remove_const, :Live)
  end

  describe "after_commit" do
    context "hooks" do

      it "adds after commit hook" do
        Live.should_receive(:after_commit).with(:new_to_pusher, :on => :create)
        Live.send(:include, Liveable)
      end

      it "adds after touch hook" do
        Live.should_receive(:after_commit).with(:update_to_pusher, :on => :update)
        Live.send(:include, Liveable)
      end

    end
  end

  context "push methods" do
    before do
      Live.any_instance.stub(:id => 1)
      Live.any_instance.stub(:organization_id => 1)
      Live.any_instance.stub(:previous_changes => {
        body: "",
        updated_at: Time.now
      })
      @live = Live.send(:include, Liveable).new
    end

    describe "#destroy_to_pusher" do
      it "push_to_stream calls StreamQueue with organization_id" do
        @live.send :store_id_before_destroy
        MessagesChannelWorker.should_receive(:perform_async).with(:destroy, Live.to_s, 1, :organization_id => 1)
        @live.send(:destroy_to_pusher)
      end
    end

    describe "#new_to_pusher" do
      it "push_to_stream calls StreamQueue with organization_id" do
        MessagesChannelWorker.should_receive(:perform_async).with(:new, Live.to_s, 1)
        @live.send(:new_to_pusher)
      end
    end

    describe "#update_to_pusher" do
      it "push_to_stream calls StreamQueue with organization_id" do
        MessagesChannelWorker.should_receive(:perform_async).with(:update, Live.to_s, 1, :only => [:body, :updated_at])
        @live.send(:update_to_pusher)
      end
    end
  end
end
