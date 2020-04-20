class ClientAssignmentPreview < ActionMailer::Preview

  def link
    @client = Client.last

    NewClientAssignmentMailer.client_assignment(
      User.last,
      @client,
      @client.organization
    )
  end

end
