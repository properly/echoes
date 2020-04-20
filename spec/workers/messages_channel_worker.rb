require "spec_helper"

describe MessagesChannelWorker do
  let(:fb_post) { posts(:fb_post) }
  let(:package) { packages(:short_package) }

  describe "#perform" do
    before do
      fb_post.stub(:package_id => package.id)
      @pusher_worker = MessagesChannelWorker.new
    end

    it ":update triggers a push" do
      MessagesChannel.should_receive(:broadcast_to).with(
        "organization-1",
        :type => "update--posts/#{fb_post.id}",
        :payload => { "name" => fb_post.name }
      )
      @pusher_worker.perform(:update, fb_post.class.to_s, fb_post.id, :only =>  ["name"])
    end

    it ":new triggers a push" do
      PostSerializer.stub(:new => double("PostSerializer"))
      MessagesChannel.should_receive(:broadcast_to).with(
        "organization-1",
        :type => "new--post",
        :payload => PostSerializer.new(fb_post)
      )
      @pusher_worker.perform(:new, fb_post.class.to_s, fb_post.id)
    end

    it ":destroy triggers a push" do
      MessagesChannel.should_receive(:broadcast_to).with(
        "organization-1",
        :type => "destroy--posts/9999",
        :payload => nil
      )
      @pusher_worker.perform(:destroy, fb_post.class.to_s, 9999, :organization_id => 1)
    end
  end
end
