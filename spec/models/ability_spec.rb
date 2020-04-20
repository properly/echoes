require "cancan/matchers"
require "spec_helper"

describe "User abilities" do
  let(:user) { users(:john) }
  let(:other_user) { create(
    :user,
    :organization => user.organization,
    :email => "something@test.se"
  ) }
  let(:ability) { Ability.new(user) }

  let(:reviewer) { reviewers(:joe) }
  let(:reviewer_ability){ Ability.new(reviewer) }

  let(:other_organization) { create(
    :organization,
  ) }
  let(:comment) { comments(:johns_comment)}

  let(:post) { posts(:fb_post) }
  let(:post_2) { posts(:company_2_post) }
  let(:revision) { revisions(:fb_revision) }

  let(:content) { contents(:fb_content) }
  let(:client) { post.package.client }

  let(:other_client) { create(
    :client,
    :organization => other_organization
  ) }

  let(:clients_user) { clients_users(:company_john) }

  subject { ability }

  before do
    clients_user.stub(:client => client)
  end

  context "superadmin" do
    before do
      user.email = "admin@email.test"
    end

    describe "all" do
      it { should be_able_to :manage, :all}
    end
  end

  context "admin" do
    before do
      allow(user).to receive(:admin?).and_return(true)
      allow(user).to receive(:member?).and_return(false)
    end

    it { should_not be_able_to :manage, :all }

    describe "user" do
      context "other user" do
        before do
          other_user.stub(:organization_id => other_organization.id)
        end

        it { should_not be_able_to :create, User.new(:organization_id => other_organization.id) }
        it { should_not be_able_to :manage, other_user }
      end

      context "in organization" do
        it { should be_able_to :invite, User.new(:organization_id => user.organization_id) }
        it { should be_able_to :update, user }
        it { should be_able_to :destroy, user }
      end

      context "trying to assign to other organization" do
        before do
          user.organization_id = other_organization.id
        end
        it { should_not be_able_to :manage, user }
      end
    end


    describe "organization" do
      it { should be_able_to :manage, user.organization }

      it { should_not be_able_to :create, other_organization }
      it { should_not be_able_to :read, other_organization }
      it { should_not be_able_to :update, other_organization }
      it { should_not be_able_to :destroy, other_organization }
    end

    describe "client" do
      it { should be_able_to :destroy, client }

      it { should_not be_able_to :destroy, other_organization.clients.first }
    end

    describe "post" do
      context "other organizations post" do
        before do
          post.package.client.stub(:organization_id => other_organization.id)
        end
        it { should_not be_able_to :manage, post}
      end

      context "organizations post" do
        it { should be_able_to :manage, post}
      end
    end

  end

  context "member" do
    before do
      user.stub(:admin? => false)
      user.stub(:member? => true)
    end

    describe "access_token" do
      context "own organization" do
        it { should be_able_to :create, AccessToken.new(:package => post.package) }
        it { should be_able_to :read, AccessToken.new(:package => post.package) }
        it { should be_able_to :update, AccessToken.new(:package => post.package) }
        it { should be_able_to :destroy, AccessToken.new(:package => post.package) }
      end

      context "not assigned to package" do
        it { should_not be_able_to :create, AccessToken.new(:package => post_2.package) }
        it { should_not be_able_to :read, AccessToken.new(:package => post_2.package) }
        it { should_not be_able_to :update, AccessToken.new(:package => post_2.package) }
        it { should_not be_able_to :destroy, AccessToken.new(:package => post_2.package) }
      end

      context "other organization" do
        before do
          post.package.client.stub(:organization_id => other_organization.id)
        end

        it { should_not be_able_to :create, AccessToken.new(:package => post.package) }
        it { should_not be_able_to :read, AccessToken.new(:package => post.package) }
        it { should_not be_able_to :update, AccessToken.new(:package => post.package) }
        it { should_not be_able_to :destroy, AccessToken.new(:package => post.package) }
      end

    end

    describe "organization" do
      context "own organization" do
        it { should be_able_to :create, user.organization }
        it { should_not be_able_to :read, user.organization }
        it { should_not be_able_to :update, user.organization }
        it { should_not be_able_to :destroy, user.organization }
      end

      context "other organization" do
        it { should_not be_able_to :create, other_organization }
        it { should_not be_able_to :read, other_organization }
        it { should_not be_able_to :update, other_organization }
        it { should_not be_able_to :destroy, other_organization }
      end
    end

    describe "clients_user" do
      context "in organization" do
        before do
          clients_user.user.stub(:owner => false)
        end

        it { should be_able_to :create, ClientsUser.new(:user => other_user, :client => client) }
        it { should be_able_to :update, clients_user }
        it { should be_able_to :destroy, clients_user }
        it { should_not be_able_to :create, ClientsUser.new(:user => other_user, :client => other_client) }
      end
      context "for owner in organization" do
        before do
          other_user.stub(:organization_id => other_organization.id)
        end

        it { should_not be_able_to :create, ClientsUser.new(:user => other_user, :client => client) }
        it { should be_able_to :read, clients_user }
        it { should_not be_able_to :manage, clients_user }
        it { should_not be_able_to :create, ClientsUser.new(:user => other_user, :client => other_client) }
      end
    end

    describe "comment" do
      context "in other organization" do
        before do
          revision.post.package.client.stub_chain(:organization_id).and_return(other_organization.id)
          post.stub(:revisions => [revision])
        end

        it { should_not be_able_to :create, Comment.new(:comment_author => reviewer, :revision=> post.revisions.last ) }
        it { should_not be_able_to :read, Comment.new(:comment_author => reviewer, :revision=> post.revisions.last ) }
        it { should_not be_able_to :update, Comment.new(:comment_author => reviewer, :revision=> post.revisions.last ) }
        it { should_not be_able_to :destroy, Comment.new(:comment_author => reviewer, :revision=> post.revisions.last ) }

        it { should_not be_able_to :manage, Comment.new(:comment_author => user, :revision=> post.revisions.last ) }
        it { should_not be_able_to :create, Comment.new(:comment_author => user, :revision=> post.revisions.last ) }
      end

      context "in organization" do
        before do
          revision.stub_chain(:user, :organization_id).and_return(user.organization_id)
          post.stub(:revisions => [revision])
        end

        it { should be_able_to :create, Comment.new(:comment_author => user, :revision=> post.revisions.last ) }
        it { should be_able_to :read, Comment.new(:comment_author => user, :revision=> post.revisions.last ) }
        it { should be_able_to :update, Comment.new(:comment_author => user, :revision=> post.revisions.last ) }
        it { should be_able_to :destroy, Comment.new(:comment_author => user, :revision=> post.revisions.last ) }

        it { should be_able_to :read, comment }
      end

      context "in project not assigned to" do
        before do
          revision.post.package.client.stub_chain(:users).and_return([])
          revision.post.package.client.stub_chain(:organization_id).and_return(user.organization_id)
          post.stub(:revisions => [revision])
        end

        it { should_not be_able_to :create, Comment.new(:comment_author => reviewer, :revision=> post.revisions.last ) }
        it { should_not be_able_to :read, Comment.new(:comment_author => reviewer, :revision=> post.revisions.last ) }
        it { should_not be_able_to :update, Comment.new(:comment_author => reviewer, :revision=> post.revisions.last ) }
        it { should_not be_able_to :destroy, Comment.new(:comment_author => reviewer, :revision=> post.revisions.last ) }

        it { should_not be_able_to :manage, Comment.new(:comment_author => user, :revision=> post.revisions.last ) }
        it { should_not be_able_to :create, Comment.new(:comment_author => user, :revision=> post.revisions.last ) }
      end

    end

    describe "content" do
      context "in other organization" do
        before do
          revision.stub_chain(:post, :package, :client, :organization_id).and_return(other_organization.id)
          content.stub(:revision => revision)
        end

        it { should_not be_able_to :create, content }
        it { should_not be_able_to :read, content }
        it { should_not be_able_to :update, content }
        it { should_not be_able_to :destroy, content }
      end

      context "in organization" do
        before do
          revision.stub_chain(:post, :package, :client, :organization_id).and_return(user.organization_id)
          revision.post.package.stub_chain(:client, :users).and_return([user])
          content.stub(:revision => revision)
        end

        it { should be_able_to :manage, content }
      end

      context "in project not assigned to" do
        before do
          revision.post.package.client.stub_chain(:users).and_return([])
          revision.stub_chain(:user, :organization_id).and_return(user.organization_id)
          content.stub(:revision => revision)
        end

        it { should_not be_able_to :create, content }
        it { should_not be_able_to :read, content }
        it { should_not be_able_to :update, content }
        it { should_not be_able_to :destroy, content }
      end
    end

    describe "revision" do
      context "in organization" do
        before do
          revision.post.package.stub_chain(:client, :organization_id).and_return(user.organization_id)
          revision.post.package.stub_chain(:client, :users).and_return([user])
        end

        it { should be_able_to :manage, revision }
      end

      context "in other organization" do
        before do
          revision.stub_chain(:post, :package, :client, :organization_id).and_return(other_organization.id)
        end

        it { should_not be_able_to :create, revision }
        it { should_not be_able_to :read, revision }
        it { should_not be_able_to :update, revision }
        it { should_not be_able_to :destroy, revision }
      end

      context "in project not assigned to" do
        before do
          revision.post.package.client.stub_chain(:users).and_return([])
          revision.stub_chain(:user, :organization_id).and_return(user.organization_id)
        end

        it { should_not be_able_to :create, revision }
        it { should_not be_able_to :read, revision }
        it { should_not be_able_to :update, revision }
        it { should_not be_able_to :destroy, revision }
      end
    end

    describe "post" do
      context "in other organization" do
        before do
          post.package.client.stub(:organization_id => other_organization.id)
        end

        it { should_not be_able_to :create, post }
        it { should_not be_able_to :read, post }
        it { should_not be_able_to :update, post }
        it { should_not be_able_to :destroy, post }
      end

      context "in organization" do
        it { should be_able_to :manage, post }
        it { should be_able_to :create, post }
        it { should be_able_to :read, post }
        it { should be_able_to :update, post }
        it { should be_able_to :destroy, post }
      end
    end

    describe "client" do
      context "in other organization" do
        before do
          client.stub(:organization_id => other_organization.id)
        end

        it { should_not be_able_to :create, client }
        it { should_not be_able_to :read, client }
        it { should_not be_able_to :update, client }
        it { should_not be_able_to :destroy, client }
      end

      context "in organization with permission" do
        it { should be_able_to :create, client }
        it { should be_able_to :read, client }
        it { should be_able_to :update, client }
        it { should_not be_able_to :destroy, client }
      end

      context "without permission" do
        before do
          client.stub(:clients_users => [])
        end

        it { should be_able_to :create, client }
        it { should_not be_able_to :read, client }
        it { should_not be_able_to :update, client }
        it { should_not be_able_to :destroy, client }
      end
    end

    describe "package" do
      context "in other organization" do
        before do
          post.package.client.stub(:organization_id => other_organization.id)
        end

        it { should_not be_able_to :create, post.package }
        it { should_not be_able_to :read, post.package }
        it { should_not be_able_to :update, post.package }
        it { should_not be_able_to :destroy, post.package }
      end

      context "in organization" do
        it { should be_able_to :create, post.package }
        it { should be_able_to :read, post.package }
        it { should be_able_to :update, post.package }
        it { should be_able_to :destroy, post.package }
      end
    end

    describe "user" do
      context "other user" do
        it { should be_able_to :create, User.new }
        it { should be_able_to :read, other_user }
        it { should_not be_able_to :update, other_user }
        it { should_not be_able_to :destroy, other_user }
        it { should_not be_able_to :invite, User.new }
      end

      context "in organization" do
        it { should be_able_to :create, user }
        it { should be_able_to :read, user }
        it { should be_able_to :update, user }
        it { should be_able_to :destroy, user }
        it { should_not be_able_to :invite, User.new }
      end

      context "in other organization" do
        before do
          other_user.stub(:organization_id => other_organization.id)
        end

        it { should_not be_able_to :create, User.new(:organization_id => 22) }
        it { should_not be_able_to :invite, User.new(:organization_id => 22) }
        it { should_not be_able_to :read, other_user }
        it { should_not be_able_to :update, other_user }
        it { should_not be_able_to :destroy, other_user }
      end
    end

    describe "reviewer" do

      it { should be_able_to :create, Reviewer.new(:email => "v@al.id", :clients => [client]) }
      it { should be_able_to :read, Reviewer.new(:email => "v@al.id", :clients => [client]) }
      it { should_not be_able_to :update, Reviewer.new(:email => "v@al.id", :clients => [client]) }

      context "when reviewer belongs to other organizations" do
        before do
          other_client.stub(:organization_id => 7)
        end
        it { should_not be_able_to :destroy, Reviewer.new(:email => "v@al.id", :clients => [client, other_client]) }
      end

      context "when reviewer only belongs to own organizations" do
        it { should be_able_to :destroy, Reviewer.new(:email => "v@al.id", :clients => [client]) }
      end

    end
  end


  context "reviewer" do
    subject { reviewer_ability }

    describe "access_token" do
      context "reviewers own token" do
        it { should_not be_able_to :create, reviewer.access_tokens.last }
        it { should_not be_able_to :update, reviewer.access_tokens.last }
        it { should be_able_to :read, reviewer.access_tokens.last }
        it { should_not be_able_to :destroy, reviewer.access_tokens.last }
      end

      context "other token" do
        before do
          reviewer.access_tokens.last.stub(:reviewer => Reviewer.new)
        end

        it { should_not be_able_to :create, Reviewer.new(:email => "v@al.id", :clients => [client]) }
        it { should_not be_able_to :update, Reviewer.new(:email => "v@al.id", :clients => [client]) }
        it { should_not be_able_to :read, Reviewer.new(:email => "v@al.id", :clients => [client]) }
        it { should_not be_able_to :destroy, Reviewer.new(:email => "v@al.id", :clients => [client]) }
      end
    end

    describe "client" do

      context "without token related" do
        before do
          client.packages.map { |pkg| pkg.stub(:access_tokens => []) }
        end
        it { should_not be_able_to :create, client }
        it { should_not be_able_to :update, client }
        it { should_not be_able_to :read, client }
        it { should_not be_able_to :destroy, client }
      end

      context "with token related" do
        it { should_not be_able_to :create, client }
        it { should_not be_able_to :update, client }
        it { should be_able_to :read, client }
        it { should_not be_able_to :destroy, client }
      end

    end

    describe "comment"do
      context "with no access to package" do
        before do
          post.package.stub(:access_tokens => [])
          revision.stub(:post => post)
        end

        it { should_not be_able_to :create, Comment.new(:comment_author => reviewer, :revision=> revision ) }
        it { should_not be_able_to :read, Comment.new(:comment_author => reviewer, :revision=> revision ) }
        it { should_not be_able_to :update, Comment.new(:comment_author => reviewer, :revision=> revision ) }
        it { should_not be_able_to :destroy, Comment.new(:comment_author => reviewer, :revision=> revision ) }
      end

      context "with access to package" do
        before do
          revision.stub(:post => post)
        end

        it { should be_able_to :create, Comment.new(:comment_author => reviewer, :revision=> revision ) }
        it { should be_able_to :read, Comment.new(:comment_author => reviewer, :revision=> revision ) }
        it { should be_able_to :update, Comment.new(:comment_author => reviewer, :revision=> revision ) }
        it { should be_able_to :destroy, Comment.new(:comment_author => reviewer, :revision=> revision ) }
      end

    end

    describe "content" do
      context "in package with correct access token" do
        before do
          content.revision.stub(:post => post)
        end

        it { should_not be_able_to :create, content }
        it { should be_able_to :read, content }
        it { should_not be_able_to :update, content }
        it { should_not be_able_to :destroy, content }
      end

      context "in package without matching access token" do
        before do
          content.revision.stub(:post => post)
          post.package.stub(:access_tokens => [])
        end

        it { should_not be_able_to :create, content }
        it { should_not be_able_to :read, content }
        it { should_not be_able_to :update, content }
        it { should_not be_able_to :destroy, content }
      end
    end

    describe "organization" do
      it { should_not be_able_to :create, Organization.new }
      it { should_not be_able_to :read, other_organization }
      it { should_not be_able_to :update, other_organization }
      it { should_not be_able_to :destroy, other_organization }
    end

    describe "package" do
      it { should_not be_able_to :create, post.package }
      it { should_not be_able_to :read, post.package }
      it { should_not be_able_to :update, post.package }
      it { should_not be_able_to :destroy, post.package }
      it { should be_able_to :uuid, post.package }
    end

    describe "post" do
      context "with matching access token" do
        it { should_not be_able_to :create, post }
        it { should be_able_to :read, post }
        it { should be_able_to :update, post } # TODO: harder attribute checking
        it { should_not be_able_to :destroy, post }
      end

      context "with no matching access token" do
        before do
          post.package.stub(:access_tokens => [])
        end
        it { should_not be_able_to :create, post }
        it { should_not be_able_to :read, post }
        it { should_not be_able_to :update, post }
        it { should_not be_able_to :destroy, post }
      end
    end

    describe "reviewer" do
      context "self" do
        it { should_not be_able_to :create, reviewer }
        it { should be_able_to :read, reviewer }
        it { should be_able_to :update, reviewer }
        it { should_not be_able_to :destroy, reviewer }
      end

      context "other" do
        before do
          reviewer.stub(:id => 999)
        end
        it { should_not be_able_to :create, reviewer }
        it { should be_able_to :read, reviewer }
        it { should be_able_to :update, reviewer }
        it { should_not be_able_to :destroy, reviewer }
      end
    end

    describe "revision" do
      before do
        revision.stub(:post => post)
      end
      context "with matching access token" do
        it { should_not be_able_to :create, revision }
        it { should be_able_to :read, revision }
        it { should be_able_to :index, revision }
        it { should_not be_able_to :update, revision }
        it { should_not be_able_to :destroy, revision }
      end

      context "without matching access token" do
        before do
          post.package.stub(:access_tokens => [])
        end
        it { should_not be_able_to :create, revision }
        it { should_not be_able_to :read, revision }
        it { should_not be_able_to :update, revision }
        it { should_not be_able_to :destroy, revision }
      end
    end

    describe "user" do
      it { should be_able_to :create, User.new }
      it { should be_able_to :read, user }
      it { should_not be_able_to :update, user }
      it { should_not be_able_to :destroy, user }
    end

  end

  context "guest" do
    subject { Ability.new User.new }

    it { should_not be_able_to :manage, :all }
    it { should_not be_able_to :read, comment }
    it { should_not be_able_to :read, Post.new }
    it { should_not be_able_to :read, Revision.new }
    it { should_not be_able_to :read, Content.new }
    it { should_not be_able_to :read, Client.new }
    it { should_not be_able_to :read, Organization.new }
    it { should_not be_able_to :read, User.new }
    it { should_not be_able_to :read, AccessToken.new }
    it { should_not be_able_to :read, Reviewer.new }
    it { should_not be_able_to :read, Comment.new }
    it { should be_able_to :reset_password, User.new }
    it { should be_able_to :send_reset_password_instructions, User.new }

    context "malicious user" do
      before do
        user.organization_id = 432
      end

      it { should_not be_able_to :accept_invitation, user }
    end
  end

end
