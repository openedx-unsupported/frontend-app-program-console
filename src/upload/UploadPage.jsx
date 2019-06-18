import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { StatusAlert } from '@edx/paragon';

import { fetchWritablePrograms } from './actions';
import { uploadSelector } from './selectors';

class UploadPage extends React.Component {
  componentDidMount() {
    this.props.fetchWritablePrograms();
  }
  render() {
    return (
      <div className="container py-5 align-items-start">
        <h1>Program Manager</h1>
        <StatusAlert
          dismissible={false}
          dialog={(
            <p>
              It appears you do not have proper permissions to access this application.
              Please reach out to <a href="mailto:partner-support@edx.org">partner-support@edx.org</a> requesting access to the Registrar service.
            </p>
          )}
          open={this.props.data.length === 0}
        />
        {this.props.data.length > 0 && this.props.data.map(program => (
          <div className="container" key={program.program_key}>
            <h2>{program.program_title}</h2>
            <div className="btn-group" role="group">
              <button className="btn btn-outline-primary">Upload Program Enrollments</button>
              <button className="btn btn-outline-primary">Upload Course Enrollments</button>
              <button className="btn btn-outline-primary">Download Program Enrollments</button>
              <button className="btn btn-outline-primary">Download Course Enrollments</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

UploadPage.propTypes = {
  fetchWritablePrograms: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    program_key: PropTypes.string,
    program_title: PropTypes.string,
    program_url: PropTypes.string,
  })).isRequired,
};

export default connect(uploadSelector, {
  fetchWritablePrograms,
})(injectIntl(UploadPage));
