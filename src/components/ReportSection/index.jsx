import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Collapsible, StatusAlert } from '@edx/paragon';

import { fetchReports } from '../../report/actions';
import { reportSelector } from '../../report/selectors';


export class ReportSection extends React.Component {
  componentDidMount() {
    if (this.props.programKey) {
      this.props.fetchReports(this.props.programKey);
    }
  }

  render() {
    return (
      <Collapsible
          className="shadow"
          title="Download Reports"
          defaultOpen>
          <div className="container">
          {this.props.reportData[this.props.programKey] && this.props.reportData[this.props.programKey].map(report => (
            <a href={report.downloadUrl}>{report.name}</a>
          ))}
          </div>
        </Collapsible>
      );
    }
}

ReportSection.propTypes = {
  reportData: PropTypes.shape().isRequired,
  fetchReports: PropTypes.func.isRequired,
  programKey: PropTypes.string.isRequired,
};

const ConnectedReportSection = connect(reportSelector, {
  fetchReports,
})(injectIntl(ReportSection));

export default ConnectedReportSection;
