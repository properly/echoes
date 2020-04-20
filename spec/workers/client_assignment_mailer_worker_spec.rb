require "spec_helper"

describe ClientAssignmentMailerWorker do
  let(:user) { users(:john) }
  let(:client) { clients(:company) }
  let(:organization) { organizations(:org) }
  let(:assignment_mailer_double) { double(NewClientAssignmentMailer) }

  before do
    Client.stub_chain(:includes, :find).and_return(client)
    client.stub(:organization => organization)

    @assignment_worker = ClientAssignmentMailerWorker.new
  end

  describe "#perform" do
    it "finds user" do
      NewClientAssignmentMailer.should_receive(:client_assignment).with(
        user,
        client,
        organization
      ).and_return(assignment_mailer_double)
      assignment_mailer_double.should_receive(:deliver_now)
      @assignment_worker.perform(client.id, user.id)
    end
  end
end
