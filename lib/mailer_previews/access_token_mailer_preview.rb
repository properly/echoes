class AccessTokenMailerPreview < ActionMailer::Preview

  def link
    AccessTokenMailer.send_link(AccessToken.last.id, User.last.id)
  end
end

