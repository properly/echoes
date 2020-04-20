require "spec_helper"

describe Api::AccessTokensController do
  let(:user) { users(:john) }
  let(:reviewer) { reviewers(:joe) }
  let(:token) { access_tokens(:clients_token) }

  before do
    sign_in user
  end

  describe "#create" do
    context "when valid" do
      before do
        AccessTokenMailer.stub_chain(:send_link, :deliver_now)
        allow(AccessToken).to receive(:new).and_return(token)
        allow(token).to receive(:save) do
          token.valid? && token.run_callbacks(:save)
        end

        post :create,
             :params => {
               :package_id => token.package_id,
               :reviewer_id => reviewer.id
             }
      end

      it { expect(AccessTokenMailer).to have_received(:send_link) }

      it { expect(response).to be_success }

      it { expect(response.body).to eq(AccessTokenSerializer.new(token).to_json) }
    end

    context "when invalid" do
      before do
        allow_any_instance_of(AccessToken).to receive(:valid?).and_return(false)

        post :create,
             :params => {
               :package_id => token.package_id
             }
      end

      it { expect(response.status).to be 422 }

      it { expect(response.body).to eq(token.errors.full_messages.to_json) }
    end

  end

  describe "#index" do
    before do
      allow_any_instance_of(AccessToken).to receive(:reviewer).and_return(reviewer)
      get :index,
          :params => {
            :package_id => token.package_id
          }
    end

    it { expect(response.body).to eq(ActiveModel::ArraySerializer.new(token.package.access_tokens).to_json) }
  end

end
