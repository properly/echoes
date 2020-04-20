/*
 *
 *  Echoes - A feedback platform for social marketing.
 *  Copyright (C) 2020 Properly - dani (at) properly.com.br/ola (at) properly.com.br
 *
 *       This program is free software: you can redistribute it and/or modify
 *       it under the terms of the GNU Affero General Public License as published
 *       by the Free Software Foundation, either version 3 of the License, or
 *       (at your option) any later version.
 *
 *       This program is distributed in the hope that it will be useful,
 *       but WITHOUT ANY WARRANTY; without even the implied warranty of
 *       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *       GNU Affero General Public License for more details.
 *
 *       You should have received a copy of the GNU Affero General Public License
 *       along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import "./styles/main.scss";

import "angular";
import "json3/lib/json3.js";
import "angular-resource/angular-resource.js";
import "angular-cookies";
import "angular-sanitize/angular-sanitize.js";
import "angular-animate/angular-animate.js";
import "angular-touch";
import "angular-route/angular-route.js";
import "moment";
import "moment/locale/pt-br.js";
import "angular-carousel/dist/angular-carousel.js";
import "angular-carousel/dist/angular-carousel.css";
import "angular-bootstrap/ui-bootstrap-tpls.js";
import "ng-file-upload";
import "angular-i18n/angular-locale_pt-br.js";

import "angular-route";
import "angular-translate";
import "angular-translate-loader-url/angular-translate-loader-url.js";
import "angular-translate-handler-log/angular-translate-handler-log.js";
import "moment";

import "./scripts/app.js";
import "./scripts/services/rails-interpolation.js";
import "./scripts/modules/error-catcher.js";
import "./local_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js";
import "./scripts/decorators/live-resource.js";
import "./scripts/controllers/main.js";
import "./scripts/controllers/clients/show.js";
import "./scripts/controllers/clients/index.js";
import "./scripts/controllers/clients/manage.js";
import "./scripts/controllers/shared/removal-confirmation.js";
import "./scripts/controllers/clients/new.js";
import "./scripts/controllers/sessions/new.js";
import "./scripts/controllers/sessions/password.js";
import "./scripts/controllers/packages/show.js";
import "./scripts/controllers/packages/new.js";
import "./scripts/controllers/posts/show.js";
import "./scripts/controllers/posts/new.js";
import "./scripts/controllers/access-tokens/new.js";
import "./scripts/controllers/reviews/packages/show.js";
import "./scripts/controllers/reviews/posts/show.js";
import "./scripts/controllers/organizations/new.js";
import "./scripts/controllers/revisions/new.js";
import "./scripts/controllers/profile/edit.js";
import "./scripts/controllers/profile/modal/name.js";
import "./scripts/controllers/shared/header.js";
import "./scripts/controllers/invitations/new.js";
import "./scripts/controllers/invitations/accept.js";
import "./scripts/controllers/shared/comments.js";
import "./scripts/controllers/shared/calendar-filters.js";
import "./scripts/controllers/admin/users/index.js";
import "./scripts/directives/posts-calendar.js";
import "./scripts/directives/file-upload.js";
import "./scripts/directives/flash-messages.js";
import "./scripts/directives/active-link.js";
import "./scripts/directives/focus-on.js";
import "./scripts/directives/manageable.js";
import "./scripts/directives/revision/revision-directive-controller.js";
import "./scripts/directives/revision/revision-directive.js";
import "./scripts/directives/uploader/uploader-controller.js";
import "./scripts/directives/uploader/uploader-directive.js";
import "./scripts/directives/toggle-navigation.js";
import "./scripts/directives/timepicker.js";
import "./scripts/directives/scheduled-at.js";
import "./scripts/services/comment.js";
import "./scripts/services/action-cable.js";
import "./scripts/services/user.js";
import "./scripts/services/package.js";
import "./scripts/services/client.js";
import "./scripts/services/post.js";
import "./scripts/services/access-token.js";
import "./scripts/services/post.js";
import "./scripts/services/revision.js";
import "./scripts/services/stream.js";
import "./scripts/services/session.js";
import "./scripts/services/current-user.js";
import "./scripts/services/content.js";
import "./scripts/services/organization.js";
import "./scripts/services/reviewer.js";
import "./scripts/services/rails-interpolation.js";
import "./scripts/services/flash.js";
import "./scripts/services/target.js";
import "./scripts/services/uuid.js";
import "./scripts/services/good-greeting.js";
import "./scripts/services/system-meta.js";
import "./scripts/services/brazilian-states.js";
import "./scripts/services/related-resource.js";
import "./scripts/services/breakpoint.js";
import "./scripts/filters/slugify.js";
import "./scripts/filters/timeago.js";
import "./scripts/filters/t.js";
import "./scripts/filters/credit-card.js";
import "./scripts/filters/creditcard-mask.js";
import "./scripts/directives/numeric.js";
import "./scripts/directives/raw-html.js";
import "./scripts/controllers/revisions/index.js";
import "./scripts/controllers/revisions/show.js";
import "./scripts/controllers/revisions/edit.js";
import "./scripts/controllers/posts/edit.js";
import "./scripts/directives/client-picker-directive.js";
import "./scripts/directives/package-picker-directive.js";
import "./scripts/directives/datefield-directive.js";
import "./scripts/directives/post-form-directive.js";
import "./scripts/directives/client-user-assign.js";
import "./scripts/directives/invite-user-form.js";
import "./scripts/directives/scroll-state.js";
import "./scripts/services/events-indexer.js";
