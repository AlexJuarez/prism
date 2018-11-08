cloLtiService.$inject = ['$q', 'appSettings', 'courseService', 'envSettings', 'sessionProvider'];

function cloLtiService($q, appSettings, courseService, envSettings, sessionProvider) {
    let epubcfi;

    /**
     * See http://www.imsglobal.org/LTI/v1p1p1/ltiIMGv1p1p1.html for details on how these are used.
     */
    const ltiDefault = {
        'lti_version': 'LTI-1p0',
        'lti_message_type': 'basic-lti-launch-request',
        // Required: Used to lookup user in firebaseDb
        'roles': 'Instructor',                                                          // Required: User role.  'instructor','learner'
        'tool_consumer_info_product_family_code':   appSettings.application.code,       // Passed through to caliper
        'tool_consumer_info_version':               appSettings.application.version,    // Passed through to caliper
        'context_label': 'clo',                     // Required: 'clo', 'preview', 'mix'
        'context_type': 'digital',                  // Required: 'digital', 'print'. Behind the scenes, controls the stylesheet used
        'context_id' : '12345'
    };


    /**
     * Given the asset assetId, submit to clo api and grab the clo url
     * @param asset
     * @returns {*}
     */
    function getEpubURL(asset) {
        let shortName,
            chapterId,
            assetIdParts;

        if (asset.assetId) {
            // After adding to a course
            epubcfi = courseService.displayOptions(asset).get('ngc', 'epubcfi');
            assetIdParts = asset.assetId.split('-');

            if (epubcfi) { // ebook chapter
                shortName = assetIdParts[0];
            } else {
                shortName = assetIdParts[0];

                if (assetIdParts[1]) {
                    chapterId = assetIdParts[1];
                }
            }
        } else {
            // From Bento search modal
            epubcfi = asset.epubcfi;

            if (epubcfi) { // ebook chapter
                shortName = asset.bookId;
            } else {
                assetIdParts = asset.id.split('-');

                shortName = assetIdParts[0];

                if (assetIdParts[1]) {
                    chapterId = assetIdParts[1];
                }
            }
        }

        return courseService.getEpubUrl(shortName, chapterId);
    }

    /**
     * Given the assetId and the asset, submit the LTI request and return the url
     * Asset could be either a Course asset reference or a Bento search result
     * Context id or (context id and custom instance id) need to match to persist player data
     * @param assetId
     * @param asset
     * @returns {*}
     */
    function getUrlFromUuid(assetId, asset) {
        const selectedCourse = courseService.getSelectedCourseContainer();
        const session = sessionProvider.getSession();
        let courseTheme;

        return $q.resolve()
            .then(() => {
                if (selectedCourse.themeUuid) {
                    return courseService.theme.getTheme(selectedCourse.themeUuid)
                        .then((theme) => {
                            courseTheme = theme;
                        });
                }

                return $q.resolve();
            })
            .then(() => {
                return getEpubURL(asset);
            })
            .then((epubObj) => {
                const authUrl = epubObj.authUrl;

                // TODO Use asset instance modal service when this service is upgraded to Angular 2+ format instead of this duplicate logic
                let customInstanceId = selectedCourse.id + '-' + asset.id;
                if (asset.assetInstanceId) {
                    customInstanceId = selectedCourse.id + '-' + asset.assetInstanceId;
                }

                let ltiPayload = <any>{
                    ...ltiDefault,
                    'lis_outcome_service_url': 'https://someoutcomeservice.com/outcomes',

                    // Passed through to caliper
                    'tool_consumer_instance_guid': session.User.organizationDomain,
                    'tool_consumer_instance_description': session.User.organizationDescription,
                    'lis_person_name_full': session.User.firstname + ' ' + session.User.lastname,
                    'lis_person_name_family': session.User.lastname,
                    'lis_person_name_given': session.User.firstname,
                    'lis_person_contact_email_primary': session.User.email,
                    'lis_person_sourcedid': session.User.organizationDomain + ':' + session.User.id,
                    'user_id': session.User.id,

                    // Added for new CLO launch url
                    'custom_content_type': 'epub',
                    'custom_epub_url': epubObj.url + '/',
                    'custom_instance_id': customInstanceId,
                    'custom_title_override': asset.title || asset.name,
                    'resource_link_id': asset.assetId || asset.id,
                    'resource_link_title': asset.title || asset.name,
                    'resource_link_description': asset.title || asset.name,

                    // Launch leveled text
                    'custom_display_levels': 'on_level,below_level,approaching_level,above_level,english_language_development',
                    'custom_level_default': 'on_level',

                    'context_id': asset.assetId || asset.id,
                };

                if (courseTheme && !courseTheme.isDefaultTheme) {
                    ltiPayload = {
                        ...ltiPayload,
                        'launch_presentation_css_url': courseTheme.url + sessionProvider.getTokenAsParam(),
                    };
                }

                // Launch a chapter of an eBook asset
                if (epubcfi) {
                    angular.extend(ltiPayload, {
                        'custom_cfi': epubcfi
                    });
                }

                return getPlayerUrlFromLti(ltiPayload, authUrl);
            });
    }

    function getPlayerUrlFromLti(parameters, authUrl) {
        const configuration = {
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            'withCredentials': true,
            'transformRequest': function (postData) {
                return Object.keys(postData)
                    .map(function (key) {
                        const value = postData[key];
                        if (undefined !== value) {
                            return encodeURIComponent(key) + '=' + encodeURIComponent(value);
                        }
                    })
                    .filter(function (value) {
                        return undefined !== value;
                    })
                    .join('&');
            }
        };
        return courseService.signCloLti(parameters)
            .then(function(response) {
                return this.http.post(envSettings.clo.playerApi + '/lti', response, configuration);
            })
            .then(function (response) {
                const epubUrls = {
                    'url': response.data['launch_player_url'],
                    'authUrl': authUrl
                };
                return epubUrls;
            });
    }

    return {
        getUrlFromUuid: getUrlFromUuid,
    };

}
export default cloLtiService;
