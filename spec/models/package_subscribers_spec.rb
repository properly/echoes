require "spec_helper"

describe PackageSubscribers do


  let(:second_user) { create(:user, :email => "second@email.com") }

  let(:comment) { comments(:johns_comment) }

  let(:post) { posts(:fb_post) }

  let(:revision) { create(
    :revision,
    :post => post,
    :user => second_user
  ) }


  let(:reviewer_joe) { reviewers(:joe) }

  let(:joes_access_token) {
    create(
      :access_token,
      :package => post.package,
      :reviewer => reviewer_joe
    )
  }

  let(:reviewer_joes_comment) {
    create(
      :comment,
      :revision => revision,
      :comment_author => reviewer_joe
    )
  }

  let(:reviewer_jane) {
    create(
      :reviewer,
      :clients => [clients(:company)],
      :access_tokens => [access_tokens(:clients_token)],
      :email => "reviewer_jane@email.com"
    )
  }

  let(:janes_access_token) {
    create(
      :access_token,
      :package => post.package,
      :reviewer => reviewer_jane
    )
  }

  let(:other_user) {
    create(
      :user,
      :email => "other@email.com"
    )
  }

  let(:other_comment) {
    create(
      :comment,
      :revision => create(
        :revision,
        :post => posts(:fb_post_2),
        :user => second_user
      ),
      :comment_author => other_user
    )
  }

  let(:janes_comment) {
    create(
      :comment,
      :revision => revisions(:fb_revision),
      :comment_author => reviewer_jane
    )
  }

  before do
    revision.reload # second user
    reviewer_joes_comment.reload #joe
    janes_comment.reload # second reviewer
  end

  describe "#all" do
    before { allow(reviewer_joe.access_tokens).to receive(:where).and_return([joes_access_token]) }

    it { expect(PackageSubscribers.new(post.package_id).all.length).to eq 4 }
    it { expect(PackageSubscribers.new(post.package_id).all.include?(reviewer_joe)).to be_truthy }
    it { expect(PackageSubscribers.new(post.package_id).all.include?(users(:john))).to be_truthy }
    it { expect(PackageSubscribers.new(post.package_id).all.include?(second_user)).to be_truthy }
    it { expect(PackageSubscribers.new(post.package_id).all.include?(reviewer_jane)).to be_truthy }
    it { expect(PackageSubscribers.new(post.package_id).all.include?(other_user)).to be_falsey }

    context "with blacklisted_emails" do
      before { allow(Reviewer).to receive(:where).and_return([reviewer_joe]) }
      it { expect(PackageSubscribers.new(post.package_id).all.length).to eq 3 }
      it { expect(PackageSubscribers.new(post.package_id).all.include?(reviewer_joe)).to be_falsey }
      it { expect(PackageSubscribers.new(post.package_id).all.include?(users(:john))).to be_truthy }
    end

    context "when token has been deleted" do
      before do
        reviewer_jane.access_tokens.destroy_all
      end
      it { expect(PackageSubscribers.new(post.package_id).all.length).to eq 3 }
      it { expect(PackageSubscribers.new(post.package_id).all.include?(reviewer_jane)).to be_falsey }
      it { expect(PackageSubscribers.new(post.package_id).all.include?(reviewer_joe)).to be_truthy }
      it { expect(PackageSubscribers.new(post.package_id).all.include?(users(:john))).to be_truthy }
    end
  end

  describe "#exclude" do
    it { expect(PackageSubscribers.new(post.package_id).exclude(reviewer_jane).all.length).to eq 2 }
    it { expect(PackageSubscribers.new(post.package_id).exclude(reviewer_jane).all.include?(reviewer_jane)).to be_falsey }
    it { expect(PackageSubscribers.new(post.package_id).all.include?(other_user)).to be_falsey }
  end

end
