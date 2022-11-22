import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl } from '@edx/frontend-platform/i18n';
import { Collapsible, Alert } from '@edx/paragon';

import { fetchReports } from './actions';
import { reportSelector, storeName } from './selectors';
import reducer from './reducers';
import saga from './sagas';
import { configureApiService } from './service';

export class ReportSection extends React.Component {
  componentDidMount() {
    if (this.props.programKey) {
      this.props.fetchReports(this.props.programKey);
    }
  }

  getDisclaimer = () => (
    <Alert
      variant="info"
      dismissible={false}
      show
    >
      The data contained in these reports reflect enrollments only and are not intended to be used for
      financial reporting or reconciliation.
    </Alert>
  );

  render() {
    if (this.props.reportData[this.props.programKey]
      && this.props.reportData[this.props.programKey].length > 0) {
      return (
        <Collapsible
          className="shadow"
          title="Download Reports"
          defaultOpen={this.props.isFirstSection}
        >
          <div className="container">
            {this.getDisclaimer()}
            {this.props.reportData[this.props.programKey].map(report => (
              <div key={report.name}>
                <a
                  id="console-report"
                  href={report.downloadUrl}
                  onClick={() => sendTrackEvent(
                    'edx.program.console.report.download',
                    {
                      programKey: this.props.programKey,
                      reportName: report.name,
                    },
                  )}
                >
                  {report.name}
                </a>
              </div>
            ))}
          </div>
        </Collapsible>
      );
    }
    return null;
  }
}

ReportSection.propTypes = {
  reportData: PropTypes.shape().isRequired,
  fetchReports: PropTypes.func.isRequired,
  programKey: PropTypes.string.isRequired,
  isFirstSection: PropTypes.bool.isRequired,
};

export default connect(reportSelector, { fetchReports })(injectIntl(ReportSection));

export {
  reducer,
  saga,
  configureApiService,
  storeName,
};
