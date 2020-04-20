FactoryGirl.define do
  preload do
    factory(:org) { create(
      :organization,
    ) }

    factory(:john) { create(
      :user,
      :organization => organizations(:org)
    ) }

    factory(:member) { create(
      :user,
      :owner => false,
      :email => "member@example.com",
      :organization => organizations(:org)
    ) }

    factory(:company) { create(
      :client,
      :organization => organizations(:org),
      :users => []
    ) }

    factory(:company_2) { create(
      :client,
      :organization => organizations(:org),
      :users => []
    ) }

    factory(:fb_post_2) {
      create(
        :post,
        :package => create(
          :package,
          :name => "Post 2",
          :client => clients(:company),
          :user => users(:john)
        )
      )
    }
    factory(:company_2_post) {
      create(
        :post,
        :package => create(
          :package,
          :name => "asdf",
          :client => clients(:company_2),
          :user => users(:member)
        )
      )
    }
    factory(:fb_post) {
      create(
        :post,
        :package => create(
          :package,
          :name => "asdf",
          :client => clients(:company),
          :user => users(:john)
        )
      )
    }

    factory(:short_package) {
      create(
        :package,
        :client => clients(:company),
        :user => users(:john),
        :posts => [posts(:fb_post)]
      )
    }

    factory(:fb_revision) {
      create(
        :revision,
        :user => users(:john),
        :post => posts(:fb_post)
      )
    }

    factory(:johns_comment) { create(
      :comment,
      :revision => revisions(:fb_revision),
      :comment_author => users(:john)
    ) }

    factory(:company_john) {
      create(
        :clients_user,
        :user => users(:john),
        :client => clients(:company)
      )
    }

    factory(:company_member) {
      create(
        :clients_user,
        :user => users(:member),
        :client => clients(:company)
      )
    }

    factory(:fb_content) {
      create(
        :content,
        :revision => revisions(:fb_revision)
      )
    }

    factory(:joe) { create(
      :reviewer,
      :clients => [clients(:company)]
    ) }

    factory(:clients_token) {
      create(
        :access_token,
        :package => packages(:short_package),
        :reviewer => reviewers(:joe)
      )
    }
  end
end
