import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Collapsible, StatusAlert } from '@edx/paragon';

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

  getCollapsibleBody = () => (
    <div className="container">
      <StatusAlert
        alertType="info"
        dialog="The data contained in this report reflect enrollments only and are not intended to be used for financial reporting or reconciliation."
        dismissible={false}
        open
      />
      {
        this.props.reportData[this.props.programKey].map(report => (
          <div key={report.name}><a href={report.downloadUrl}>{report.name}</a></div>
        ))}
    </div>
  );

  render() {
    if (this.props.reportData[this.props.programKey] &&
      this.props.reportData[this.props.programKey].length > 0) {
      return (
        <Collapsible
          className="shadow"
          title="Download Reports"
          defaultOpen={this.props.isFirstSection}
        >
          {this.getCollapsibleBody()}
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
