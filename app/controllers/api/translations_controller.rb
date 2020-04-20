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

module Api
  class TranslationsController < ApiController
    skip_before_action :authenticate_user!
    skip_before_action :require_organization

    # GET /api/translations
    def index
      render :json => translations.to_json
    end

    private
    def locale_params
      params.permit(:lang)
    end

    # @return[Symbol] the requested locale if present, else default locale
    def requested_lang
      locale_params[:lang].to_sym or I18n.locale
    end


    # initializing loads translations into a ruby object
    # reload if in development
    def init_translations
      I18n.reload! if Rails.env.development?
      I18n.backend.send(:init_translations) unless I18n.backend.initialized?
    end

    # @return[Object] translations for requested locale
    def translations
      init_translations
      translations ||= I18n.backend.send(:translations)
      translations[requested_lang].with_indifferent_access
    end

  end
end
