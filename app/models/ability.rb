# Echoes - A feedback platform for social marketing.
# Copyright (C) 2020 Properly - dani (at) properly.com.br/ola (at) properly.com.br
#
#     This program is free software: you can redistribute it and/or modify
#     it under the terms of the GNU Affero General Public License as published
#     by the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     This program is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU Affero General Public License for more details.
#
#     You should have received a copy of the GNU Affero General Public License
#     along with this program.  If not, see <https://www.gnu.org/licenses/>.

class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

    if user.superadmin?
      can :manage, :all
    end

    if user.admin?
      can :manage, Organization, :users => { :id => user.id }

      can :invite, User, :organization_id => user.organization_id
      can :update, User, :organization_id => user.organization_id
      can :destroy, User, :organization_id => user.organization_id

      can :destroy, Client, :organization_id => user.organization_id
    end

    if user.member? || user.admin?
      can [:create], Client, :organization_id => user.organization_id

      can [:read, :update], Client,
        :organization_id => user.organization_id,
        :clients_users => {:user_id => user.id}

      # user needs to be in the same organization as the
      # user that is adding the user
      can [:available, :read, :create], ClientsUser,
        :client => {
          :organization_id => user.organization_id
        },
        :user => {
          :organization_id => user.organization_id
        }

      # Owners can't be removed from a client
      can [:update, :destroy], ClientsUser,
        :client => {
          :organization_id => user.organization_id
        },
        :user =>  {
          :owner => false
        }

      can :manage, AccessToken, :package => {
        :client => {
          :organization_id => user.organization_id,
          :users => { :id => user.id }
        }
      }

      can :manage, Comment, :comment_author => user, :revision => {
        :post => {
          :package => {
            :client => {
              :organization_id => user.organization_id,
              :users => {:id => user.id}
            }
          }
        }
      }

      can :read, Comment, :revision => {
        :post => {
          :package => {
            :client => {
              :organization_id => user.organization_id,
              :users => {:id => user.id}
            }
          }
        }
      }

      can :manage, Content, :revision => {
        :post => {
          :package => {
            :client => {
              :organization_id => user.organization_id,
              :users => {:id => user.id}
            }
          }
        }
      }

      can :manage, Package, :client => {
        :organization_id => user.organization_id,
        :users => {:id => user.id}
      }

      can :manage, Post, :package => {
        :client => {
          :organization_id => user.organization_id,
          :users => {:id => user.id}
        }
      }

      can :create, Post, :package => nil

      can :manage, Revision, :post => {
        :package => {
          :client => {
            :organization_id => user.organization_id,
            :users => {:id => user.id}
          }
        }
      }

      # TODO: add a relation table
      #can [:create, :read], Reviewer, :clients => user.organization.clients
      can [:create, :read], Reviewer, :clients => {
        :organization_id => user.organization_id
      }
      can :destroy, Reviewer do |rev|
        (rev.clients.map(&:organization_id).uniq - [user.organization_id]).empty?
      end

      can :read, User, :organization_id => user.organization_id

      can [:create, :update, :destroy], User do |new_user|
        !new_user.organization_id_changed? && user.id == new_user.id
      end

      can :create, Organization, :users => { :id => user.id }

      can :current, Organization

    end

    if user.member?; end

    if user.reviewer?
      # Avoid n+1
      # reviewer doesn't come with all tokens eager loaded, this avoids
      # hitting the query on each check
      access_token_ids = user.access_token_ids

      can :read, AccessToken, :reviewer_id => user.id

      # FIXME: this seems broken, a reviewer that has once been associated with a
      # package from a client will have access to that client using any access token.
      can :read, Client, :packages => {
        :access_tokens => {
          :id => access_token_ids
        }
      }

      can :manage, Comment, Comment do |comment|
        valid_package = common_tokens? user, comment.revision.post.package

        valid_package && (comment.comment_author == user)
      end

      can :read, Comment, :revision => {
        :post => {
          :package => {
            :access_tokens => {
              :id => access_token_ids
            }
          }
        }
      }

      can :read, Content, :revision => {
        :post => {
          :package => {
            :access_tokens => {
              :id => access_token_ids
            }
          }
        }
      }


      can :uuid, Package, :access_tokens => {
        :id => access_token_ids
      }

      can [:read, :update], Post, :package => {
        :access_tokens => {
          :id => access_token_ids
        }
      }

      # NOTE: an index will filter and therefore
      # not raise a 403, just return an empty array
      can :read, Revision, :post => {
        :package => {
          :access_tokens => {
            :id => access_token_ids
          }
        }
      }

      can [:read, :update], Reviewer, :id => user.id

      can :read, User, :organization => {
        :clients => {
          :packages => {
            :access_tokens => {
              :id => access_token_ids
            }
          }
        }
      }

    end


    can :updates, :stream

    # User should not be able to assign itself to other organization
    can :create, User, :organization_id => nil

    can :accept_invitation, User do |new_user|
      !new_user.organization_id_changed?
      !new_user.organization_id_changed? && user.id == new_user.id
    end

    can [:reset_password, :send_reset_password_instructions], User

    can [:create, :destroy, :current], :session

  end

  private

  def common_tokens? user, package
    (user.access_tokens & package.access_tokens).length > 0
  end

end
