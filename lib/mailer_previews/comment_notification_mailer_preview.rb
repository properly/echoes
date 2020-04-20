class CommentNotificationPreview < ActionMailer::Preview

  def link
    @comment = Comment.last
    NewCommentMailer.comment_notification(
      User.last,
      @comment,
      @comment.revision,
      @comment.revision.post,
      @comment.revision.post.package,
      @comment.revision.post.package.client.organization
    )
  end

end
