Echoes::Application.routes.draw do

  devise_for :users

  authenticate :user, lambda { |u| u.superadmin? } do
    require 'sidekiq/web'
    mount Sidekiq::Web => '/api/sidekiq'
  end

  mount ActionCable.server => '/api/cable'

  get :health_check, :controller => "application"

  namespace :api, :defaults => { :format => :json } do
    resources :users do
      post "invite" => "users#invite", :on => :collection
      post "accept_invitation" => "users#accept_invitation", :on => :collection
      put "send_reset_password_instructions" => "users#send_reset_password_instructions", :on => :collection
      put "reset_password" => "users#reset_password", :on => :collection
    end

    get "/sessions/current" => "sessions#current"
    post "/sessions/" => "sessions#create"
    delete "/sessions/" => "sessions#destroy"

    delete "/users/sign_out" => "users#sign_out"

    resources :clients do
      resources :clients_users, :controller => "clients_users" do
        delete "remove" => "clients_users#destroy", :on => :collection
        get "available" => "clients_users#available", :on => :collection
      end
    end

    resources :posts
    resources :access_tokens, :only => [:index, :create]
    resources :revisions
    resources :attachments
    resources :comments
    resources :contents
    resources :translations, :only => [:index]

    resources :packages do
      get "uuid" => "packages#uuid", :on => :collection
    end

    resources :reviewers, :only => [:create, :index] do
      get "uuid" => "reviewers#uuid", :on => :collection
    end

    resources :organizations do
      get "current" => "organizations#current", :on => :collection
    end

    resources :system_metas, :only => [:index]
    get :settings
  end

  # catch all in dev, nginx does the same in production
  if Rails.env.development?
    get "*path",
        :to => proc {|env| [200, {}, [File.open(Rails.root.join('public', 'index.html')).read]] },
        constraints: -> (req) { !(req.fullpath =~ /^\/api\/.*/) }
  end

end
