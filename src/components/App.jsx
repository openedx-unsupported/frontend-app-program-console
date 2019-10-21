import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { IntlProvider, injectIntl, intlShape } from 'react-intl';
import { ConnectedRouter } from 'connected-react-router';
import { sendTrackEvent } from '@edx/frontend-analytics';
import SiteHeader from '@edx/frontend-component-site-header';
import SiteFooter from '@edx/frontend-component-footer';
import { getLocale, getMessages } from '@edx/frontend-i18n'; // eslint-disable-line
import {
  faFacebookSquare,
  faTwitterSquare,
  faLinkedin,
  faGooglePlusSquare,
  faRedditSquare,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PageLoading, fetchUserAccount } from '../common';

import HeaderLogo from '../assets/logo.svg';
import UploadPage from '../upload/UploadPage';

import messages from './App.messages';

const FooterLogo = HeaderLogo;

const socialLinks = [
  {
    title: 'Facebook',
    url: 'https://www.facebook.com',
    icon: <FontAwesomeIcon icon={faFacebookSquare} className="social-icon" size="2x" />,
    screenReaderText: 'Like edX on Facebook',
  },
  {
    title: 'Twitter',
    url: 'https://www.twitter.com',
    icon: <FontAwesomeIcon icon={faTwitterSquare} className="social-icon" size="2x" />,
    screenReaderText: 'Follow edX on Twitter',
  },
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com',
    icon: <FontAwesomeIcon icon={faLinkedin} className="social-icon" size="2x" />,
    screenReaderText: 'Follow edX on LinkedIn',
  },
  {
    title: 'Google+',
    url: 'https://plus.google.com',
    icon: <FontAwesomeIcon icon={faGooglePlusSquare} className="social-icon" size="2x" />,
    screenReaderText: 'Follow edX on Google+',
  },
  {
    title: 'Reddit',
    url: 'https://reddit.com',
    icon: <FontAwesomeIcon icon={faRedditSquare} className="social-icon" size="2x" />,
    screenReaderText: 'Subscribe to the edX subreddit',
  },
];


function PageContent({
  ready,
  configuration,
  username,
  avatar,
  intl,
}) {
  if (!ready) {
    return <PageLoading srMessage={intl.formatMessage(messages['app.loading.message'])} />;
  }

  const mainMenu = [
    {
      type: 'item',
      href: `${process.env.MARKETING_SITE_BASE_URL}/course`,
      content: intl.formatMessage(messages['siteheader.links.courses']),
    },
    {
      type: 'item',
      href: `${process.env.MARKETING_SITE_BASE_URL}/course?program=all`,
      content: intl.formatMessage(messages['siteheader.links.programs']),
    },
    {
      type: 'item',
      href: `${process.env.MARKETING_SITE_BASE_URL}/schools-partners`,
      content: intl.formatMessage(messages['siteheader.links.schools']),
    },
  ];
  const userMenu = [
    {
      type: 'item',
      href: `${process.env.LMS_BASE_URL}`,
      content: intl.formatMessage(messages['siteheader.user.menu.dashboard']),
    },
    {
      type: 'item',
      href: `${process.env.LMS_BASE_URL}/u/${username}`,
      content: intl.formatMessage(messages['siteheader.user.menu.profile']),
    },
    {
      type: 'item',
      href: `${process.env.LMS_BASE_URL}/account/settings`,
      content: intl.formatMessage(messages['siteheader.user.menu.account.settings']),
    },
    {
      type: 'item',
      href: process.env.LOGOUT_URL,
      content: intl.formatMessage(messages['siteheader.user.menu.logout']),
    },
  ];
  const loggedOutItems = [
    {
      type: 'item',
      href: `${process.env.LMS_BASE_URL}/login`,
      content: intl.formatMessage(messages['siteheader.user.menu.login']),
    },
    {
      type: 'item',
      href: `${process.env.LMS_BASE_URL}/register`,
      content: intl.formatMessage(messages['siteheader.user.menu.register']),
    },
  ];

  return (
    <div id="app">
      <SiteHeader
        logo={HeaderLogo}
        loggedIn
        username={username}
        avatar={avatar}
        logoAltText={configuration.SITE_NAME}
        logoDestination={configuration.MARKETING_SITE_BASE_URL}
        mainMenu={mainMenu}
        userMenu={userMenu}
        loggedOutItems={loggedOutItems}
      />
      <main>
        <UploadPage />
      </main>
      <SiteFooter
        marketingSiteBaseUrl={configuration.MARKETING_SITE_BASE_URL}
        ariaLabel="Page Footer"
        siteLogo={{
          src: FooterLogo,
          altText: configuration.SITE_NAME,
          ariaLabel: configuration.SITE_NAME,
        }}
        appleAppStore={{
          url: configuration.APPLE_APP_STORE_URL,
          altText: 'Apple App Store',
        }}
        googlePlay={{
          url: configuration.GOOGLE_PLAY_URL,
          altText: 'Google Play',
        }}
        handleAllTrackEvents={sendTrackEvent}
        socialLinks={socialLinks}
        linkSectionOne={{
          title: 'edX',
          linkList: [
            { title: 'About', url: 'https://www.edx.org/about-us' },
            { title: 'edX for Business', url: 'https://business.edx.org/?utm_campaign=edX.org+Referral&utm_medium=Footer&utm_source=edX.org' },
            { title: 'Affiliates', url: 'https://www.edx.org/affiliate-program' },
            { title: 'Open edX', url: configuration.OPEN_SOURCE_URL },
            { title: 'Careers', url: 'https://www.edx.org/careers' },
            { title: 'News', url: 'https://www.edx.org/news-announcements' },
          ],
        }}
        linkSectionTwo={{
          title: 'Legal',
          linkList: [
            { title: 'Terms of Service & Honor Code', url: configuration.TERMS_OF_SERVICE_URL },
            { title: 'Privacy Policy', url: configuration.PRIVACY_POLICY_URL },
            { title: 'Accessibility Policy', url: 'https://www.edx.org/accessibility' },
            { title: 'Trademark Policy', url: 'https://www.edx.org/trademarks' },
            { title: 'Sitemap', url: 'https://www.edx.org/sitemap' },
          ],
        }}
        linkSectionThree={{
          title: 'Connect',
          linkList: [
            { title: 'Blog', url: 'https://www.edx.org/blog' },
            { title: 'Contact Us', url: configuration.CONTACT_URL },
            { title: 'Help Center', url: configuration.SUPPORT_URL },
            { title: 'Media Kit', url: 'https://www.edx.org/media-kit' },
            { title: 'Donate', url: 'https://www.edx.org/donate' },
          ],
        }}
        copyright="© 2012–2019 edX Inc."
        trademark={(
          <React.Fragment>EdX, Open edX, and MicroMasters are registered trademarks of edX Inc. | 深圳市恒宇博科技有限公司 <a href="http://www.beian.miit.gov.cn">粤ICP备17044299号-2</a></React.Fragment>
        )}
      />
    </div>
  );
}

PageContent.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  ready: PropTypes.bool,
  configuration: PropTypes.shape({
    SITE_NAME: PropTypes.string.isRequired,
    MARKETING_SITE_BASE_URL: PropTypes.string.isRequired,
    SUPPORT_URL: PropTypes.string.isRequired,
    CONTACT_URL: PropTypes.string.isRequired,
    OPEN_SOURCE_URL: PropTypes.string.isRequired,
    TERMS_OF_SERVICE_URL: PropTypes.string.isRequired,
    PRIVACY_POLICY_URL: PropTypes.string.isRequired,
    FACEBOOK_URL: PropTypes.string.isRequired,
    TWITTER_URL: PropTypes.string.isRequired,
    LINKED_IN_URL: PropTypes.string.isRequired,
    GOOGLE_PLUS_URL: PropTypes.string.isRequired,
    REDDIT_URL: PropTypes.string.isRequired,
    APPLE_APP_STORE_URL: PropTypes.string.isRequired,
    GOOGLE_PLAY_URL: PropTypes.string.isRequired,
  }).isRequired,
  intl: intlShape.isRequired,
};

PageContent.defaultProps = {
  ready: false,
  avatar: null,
};

const IntlPageContent = injectIntl(PageContent);

class App extends Component {
  componentDidMount() {
    const { username } = this.props;
    this.props.fetchUserAccount(username);
  }

  render() {
    return (
      <IntlProvider locale={getLocale()} messages={getMessages()}>
        <Provider store={this.props.store}>
          <ConnectedRouter history={this.props.history}>
            <IntlPageContent
              ready={this.props.ready}
              configuration={this.props.configuration}
              username={this.props.username}
              avatar={this.props.avatar}
            />
          </ConnectedRouter>
        </Provider>
      </IntlProvider>
    );
  }
}

App.propTypes = {
  fetchUserAccount: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  store: PropTypes.object.isRequired, // eslint-disable-line
  history: PropTypes.object.isRequired, // eslint-disable-line
  ready: PropTypes.bool,
  configuration: PropTypes.shape({
    SITE_NAME: PropTypes.string.isRequired,
    MARKETING_SITE_BASE_URL: PropTypes.string.isRequired,
    SUPPORT_URL: PropTypes.string.isRequired,
    CONTACT_URL: PropTypes.string.isRequired,
    OPEN_SOURCE_URL: PropTypes.string.isRequired,
    TERMS_OF_SERVICE_URL: PropTypes.string.isRequired,
    PRIVACY_POLICY_URL: PropTypes.string.isRequired,
    FACEBOOK_URL: PropTypes.string.isRequired,
    TWITTER_URL: PropTypes.string.isRequired,
    LINKED_IN_URL: PropTypes.string.isRequired,
    GOOGLE_PLUS_URL: PropTypes.string.isRequired,
    REDDIT_URL: PropTypes.string.isRequired,
    APPLE_APP_STORE_URL: PropTypes.string.isRequired,
    GOOGLE_PLAY_URL: PropTypes.string.isRequired,
  }).isRequired,
};

App.defaultProps = {
  ready: false,
  avatar: null,
};

const mapStateToProps = state => ({
  username: state.authentication.username,
  // An error means that we tried to load the user account and failed,
  // which also means we're ready to display something.
  ready: state.userAccount.loaded || state.userAccount.error != null,
  configuration: state.configuration,
  avatar: state.userAccount.profileImage.hasImage
    ? state.userAccount.profileImage.imageUrlMedium
    : null,
});

export default connect(
  mapStateToProps,
  {
    fetchUserAccount,
  },
)(App);
