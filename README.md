# frontend-app-program-console

# Purpose

A micro-frontend for administering edX program membership through the Registrar API.

Uses the [Registrar Service](https://github.com/openedx/registrar/) as a data/AuthZ backend and [LMS](https://github.com/openedx/edx-platform) as an AuthN backend.

# Getting Started

## Prerequisites

The `devstack`_ is currently recommended as a development environment for your
new MFE.  If you start it with ``make dev.up.lms`` that should give you
everything you need as a companion to this frontend.

Note that it is also possible to use `Tutor`_ to develop an MFE.  You can refer
to the `relevant tutor-mfe documentation`_ to get started using it.

.. _Devstack: https://github.com/openedx/devstack

.. _Tutor: https://github.com/overhangio/tutor

.. _relevant tutor-mfe documentation: https://github.com/overhangio/tutor-mfe#mfe-development

## Cloning and Startup

1. Clone your new repo:

  ``git clone https://github.com/openedx/frontend-app-program-console.git``

2. Install npm dependencies:

  ``cd frontend-app-program-console && npm install``

3. Start the dev server:

  ``npm start``

The dev server is running at `http://localhost:1976 <http://localhost:1976>`_.


## Contributing

Contributions are very welcome.  Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.

## Getting Help

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_.  Because this is a
frontend repository, the best place to discuss it would be in the `#wg-frontend
channel`_.

For anything non-trivial, the best path is to open an issue in this repository
with as many details about the issue you are facing as you can provide.

https://github.com/openedx/frontend-app-program-console/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _#wg-frontend channel: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/community/connect

## License

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

## The Open edX Code of Conduct

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

## Reporting Security Issues

Please do not report security issues in public. Please email security@openedx.org.

