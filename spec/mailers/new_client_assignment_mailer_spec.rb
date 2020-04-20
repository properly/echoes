require "spec_helper"

describe NewClientAssignmentMailer do
  let(:organization) { organizations(:org) }
  let(:client) { clients(:company) }
  let(:user) { users(:john) }

  before do
    @email = NewClientAssignmentMailer.client_assignment(
      user,
      client,
      organization
    ).deliver_now
  end

  it { ActionMailer::Base.deliveries.length.should be 1 }

  it {
    @email.subject.should eq "Você foi adicionado ao projeto #{client.name} de #{organization.name}"
  }

  it {
    @email.encoded.should match(/localhost\/clients/)
  }

  it {
    @email.to.should eq [ user.email ]

  }
end
