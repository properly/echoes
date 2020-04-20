class DeviseMailerPreview < ActionMailer::Preview

  def invite
    user = User.where("invited_by_id IS NOT ?", nil).first
    Devise::Mailer.invitation_instructions(user, "insertRandomTokenHere")
  end

end
