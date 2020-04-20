require "spec_helper"

describe Api::ReviewersController do
  let(:client) { clients(:company) }
  let(:reviewer) { reviewers(:joe) }
  let(:user) { users(:john) }
  let(:token) { access_tokens(:clients_token) }

  before do
    sign_in user
    allow(Client).to receive(:find).and_return(client)
  end

  describe "#create" do
    before do
      # allow(Reviewer).to receive_message_chain("where.first_or_initialize") { reviewer }
    end

    context "when valid" do
      before do
        reviewer.stub(:save => reviewer.valid?)

        post :create,
             :params => {
               :client_id => client.id,
               :email => "joe+reviewers-controller-create@example.org"
             }
      end

      it { expect(response).to be_success }

      it { expect(reviewer.clients.count).to eql(1) }

      it { expect(JSON.parse(response.body)['email']).to eq("joe+reviewers-controller-create@example.org") }
    end

    context "when client is not already there" do
      before do
        allow(reviewer).to receive(:save).and_return(reviewer.valid?)
        allow(reviewer).to receive_message_chain("client_ids.include?").and_return(false)

        post :create,
             :params => {
               :client_id => client.id,
               :email => "joe+reviewers-controller-create@example.org"
             }
      end

      it { expect(response).to be_success }

      it { expect(reviewer.clients.count).to eql(1) }
    end

    context "when invalid" do
      before do
        reviewer.email = ""
        reviewer.valid?

        post :create,
             :params => {
               :client_id => client.id,
               :email => ""
             }
      end

      it { expect(response.status).to be 422 }

      it { expect(response.body).to eq(reviewer.errors.full_messages.to_json) }
    end

  end

end
