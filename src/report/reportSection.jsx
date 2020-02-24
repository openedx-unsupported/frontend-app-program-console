import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Collapsible } from '@edx/paragon';

import { fetchReports } from './actions';
import { consoleSelector } from '../console/selectors';
import saga from './sagas';
import { configureApiService } from './service';


export class ReportSection extends React.Component {
  componentDidMount() {
    if (this.props.programKey) {
      this.props.fetchReports(this.props.programKey);
    }
  }

  render() {
    if (this.props.reportData[this.props.programKey] &&
      this.props.reportData[this.props.programKey].length > 0) {
      return (
        <Collapsible
          className="shadow"
          title="Download Reports"
          defaultOpen={this.props.isFirstSection}
        >
          <div className="container">
            {
              this.props.reportData[this.props.programKey].map(report => (
                <div key={report.name}><a href={report.downloadUrl}>{report.name}</a></div>
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

export default connect(consoleSelector, { fetchReports })(injectIntl(ReportSection));


export {
  saga,
  configureApiService,
};
