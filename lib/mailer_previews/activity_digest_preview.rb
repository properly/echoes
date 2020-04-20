class ActivityDigestPreview < ActionMailer::Preview

  def digest_for
    ActivityDigestMailer.digest_for(
      Activity.last.owner
    )
  end

end
