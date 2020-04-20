require "spec_helper"

describe Post do
  let(:post) { posts(:fb_post) }
  let(:post_2) { posts(:fb_post_2) }
  let(:organization) { organizations(:org) }
  let(:client) { clients(:company) }
  let(:user) { users(:john)}
  let(:reviewer) { reviewers(:joe)}
  let(:new_post) { Post.new({
    :name => "My post",
    :scheduled_at => DateTime.now + 3.days
  }) }

  describe "validations" do
    context "when name is not present" do
      before do
        new_post.name = ""
      end

      it { new_post.should have(1).error_on(:name) }
    end

    context "when scheduled_at is not valid" do
      before do
        new_post.scheduled_at = "invalid"
      end

      it { new_post.should have(2).error_on(:scheduled_at) }
    end

    context "when scheduled_at is blank" do
      before do
        new_post.scheduled_at = ""
      end

      it { new_post.should have(2).error_on(:scheduled_at) }
    end

    context "when status is blank" do
      before { new_post.status = nil}
      subject { new_post }
      it { should have(:no).error_on(:status) }
    end

    context "when status is valid" do
      before { new_post.status = "published" }
      subject { new_post }
      it { should have(:no).error_on(:status) }
    end

    context "when status is invalid" do
      before { new_post.status = "invalid" }
      subject { new_post}
      it { should have(1).error_on(:status) }
    end

  end

  describe "#organization_id" do
    before do
      post.stub_chain(:package, :client).and_return(client)
    end

    it { post.organization_id.should eql(organization.id) }

  end

  describe "link" do
    before do
      reviewer.access_tokens.stub_chain(:where, :last).and_return(
        reviewer.access_tokens.first
      )
    end
    it { post.link(User.last).should match(/clients/) }
    it { post.link(reviewer).should match(/review/) }
  end

  describe "#change_status" do
    it { new_post.status_changed_at.should be_nil }

    context "when status changed by reviewer" do
      before do
        DateTime.stub(:now => "2014-09-11T16:29:26-03:00")
        post.status = nil
        post.status_changer = reviewer
        post.valid?
      end

      it { post.status_changed_at.should eq "2014-09-11T16:29:26-03:00" }

      it { post.status_changer.should eq reviewer }
    end

    context "when status changed by user" do
      before do
        PostStatusWorker.stub(:perform_async)
        DateTime.stub(:now => "2014-09-11T16:29:26-03:00")
        post.status_changer = user
        post.status = nil
        post.valid?
      end

      it { post.status_changed_at.should eq "2014-09-11T16:29:26-03:00" }

      it { post.status_changer.should eq user }

      describe "from any non approved to any non approved" do
        before do
          post.update_attributes(:status => nil)
          post.status = "adjusted"
        end

        it { expect(PostStatusWorker).to_not receive(:perform_async); post.save! }
      end

      describe "from any to approved" do
        before do
          post.update_attributes(:status => nil)
          post.status = "approved"
        end

        it { expect(PostStatusWorker).to receive(:perform_async); post.save! }
      end

      describe "from approved to any" do
        before do
          post.update_attributes(:status => "approved")
          post.status = "adjusted"
        end

        it { expect(PostStatusWorker).to receive(:perform_async); post.save! }
      end
    end
  end

  describe "#change_status" do
    context "when status changed by user" do
      before do
        PostStatusWorker.stub(:perform_async)
        post.status_changer = user
      end

      it { expect(PostStatusWorker).to_not receive(:perform_async); post.save!}
    end

    context "when status changed by system" do
      before do
        PostStatusWorker.stub(:perform_async)
        DateTime.stub(:now => "2014-09-11T16:29:26-03:00")
        post.status = nil
        post.status_changer = nil
      end

      it { expect(PostStatusWorker).not_to receive(:perform_async).with(post.id); post.save!}
    end

    context "when status changed by user" do
      before do
        PostStatusWorker.stub(:perform_async)
        DateTime.stub(:now => "2014-09-11T16:29:26-03:00")
        post.update_attributes(:status => "approved")
        post.status = nil
        post.status_changer = user
      end

      it { expect(PostStatusWorker).to receive(:perform_async).with(post.id); post.save!}
    end
  end

  describe "#previous" do

    context "when post has no siblings" do
      before do
        Post.any_instance.stub_chain(:package, :posts).and_return([post])
      end

      it { post.previous.should eql(nil) }

      it { post_2.previous.should eql(nil) }
    end

    context "when package has no posts (delete)" do
      before do
        Post.any_instance.stub_chain(:package, :posts).and_return([])
      end

      it { post.previous.should eql(nil) }

      it { post_2.previous.should eql(nil) }
    end

    context "when post has a sibling" do
      before do
        Post.any_instance.stub_chain(:package, :posts).and_return([post, post_2])
      end

      it { post.previous.should eql(nil) }

      it { post_2.previous.should eql(post) }
    end
  end


  describe "#next" do
    context "when navigating" do
      before do
        allow_any_instance_of(Post).to receive_message_chain(:package, :posts) { [post, post_2] }
      end

      it { post.next.should eql(post_2) }

      it { post_2.next.should eql(nil) }
    end
    context "when package has no posts (delete last post)" do
      before do
        Post.any_instance.stub_chain(:package, :posts).and_return([])
      end

      it { post.next.should eql(nil) }

      it { post_2.next.should eql(nil) }
    end

    context "when post has no siblings" do
      before do
        Post.any_instance.stub_chain(:package, :posts).and_return([post])
      end

      it { post.next.should eql(nil) }

      it { post_2.next.should eql(nil) }
    end
  end

  describe "#all_subscribers" do
    it do
      expect_any_instance_of(PackageSubscribers).to receive(:exclude).at_least(:once).and_call_original
      post.all_subscribers
    end

    it do
      expect_any_instance_of(PackageSubscribers).to receive(:all)
      post.all_subscribers
    end
  end

  describe "#has_reviewer_comments_on_last_revision" do
    it "returns a boolean" do
      expect(post.send(:has_reviewer_comments_on_last_revision)).to be_falsey
    end
  end

  describe "#set_attributes" do
    before do
      post.status = "approved"
    end

    context "last revision has reviewer comments" do
      before do
        post.stub(:has_reviewer_comments_on_last_revision => true)
        post.set_attributes(:status => "")
      end
      subject { post.status }

      it { should eq "adjustment_pending" }
    end

    context "last revision has reviewer comments" do
      before do
        post.stub(:has_reviewer_comments_on_last_revision => false)
        post.revisions.stub(:count => 2)
        post.set_attributes(:status => "")
      end
      subject { post.status }

      it { should eq "adjusted" }
    end


    context "single revision when no reviewer comments present" do
      before do
        post.stub(:has_reviewer_comments_on_last_revision => false)
        post.revisions.stub(:count => 1)
        post.set_attributes(:status => "")
      end
      subject { post.status }

      it { should eq "" }
    end

    context "approving" do
      before do
        post.status=""
        post.stub(:has_reviewer_comments_on_last_revision => false)
        post.revisions.stub(:count => 1)
        post.set_attributes("status" => "approved")
      end
      subject { post.status }

      it { should eq "approved" }
    end

  end

end
