require "spec_helper"

describe AccessTokenMailer do
  let(:access_token) { access_tokens(:clients_token) }
  let(:organization) { organizations(:org) }
  let(:client) { clients(:company) }
  let(:package) { packages(:short_package) }
  let(:reviewer) { reviewers(:joe) }
  let(:user) { users(:john) }

  before do
    access_token.stub(:reviewer => reviewer)
    access_token.stub(:package => package)
    package.stub(:client => client)
    @email = AccessTokenMailer.send_link(access_token.id, user.id).deliver_now
  end

  it {
    expect { AccessTokenMailer.send_link(access_token.id, user.id).deliver_now }.to change { ActionMailer::Base.deliveries.count }.by(1)
  }

  it { @email.subject.should eq "#{client.name} | #{package.name}: Arquivos para aprovação" }

  it { @email.encoded.should match(/localhost\/reviews/) }

  it { @email.to.should eq [ reviewer.email ] }
end
