class PostStatusMailerPreview < ActionMailer::Preview

  def post_status
    @post = Post.last
    @post.status_changer = User.last
    @post.status_changed_at = DateTime.now
    @post.status = "approved"
    PostStatusMailer.post_status(
      User.last,
      @post,
      @post.package
    )
  end

  def post_status_revoked
    @post = Post.last
    @post.status_changer = User.last
    @post.status_changed_at = DateTime.now
    @post.status = nil
    PostStatusMailer.post_status(
      User.last,
      @post,
      @post.package
    )
  end

end
