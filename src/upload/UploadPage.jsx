import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { StatusAlert } from '@edx/paragon';

import { fetchWritablePrograms, uploadEnrollments, downloadEnrollments, removeBanner } from './actions';
import { uploadSelector } from './selectors';

export class UploadPage extends React.Component {
  componentDidMount() {
    this.props.fetchWritablePrograms();
  }

  handleUploadProgramEnrollments(programKey, e) {
    this.props.uploadEnrollments(programKey, false, e.target.files[0]);
  }

  handleDownloadProgramEnrollments(programKey) {
    this.props.downloadEnrollments(programKey, false);
  }

  handleUploadCourseEnrollments(programKey, e) {
    this.props.uploadEnrollments(programKey, true, e.target.files[0]);
  }

  handleDownloadCourseEnrollments(programKey) {
    this.props.downloadEnrollments(programKey, true);
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
          open={!this.props.authorized}
        />
        {this.props.data.length > 0 && this.props.data.map(program => (
          <div className="container" key={program.programKey}>
            <h2>{program.programTitle}</h2>
            {this.props.programBanners[program.programKey] &&
              !!this.props.programBanners[program.programKey].length &&
              this.props.programBanners[program.programKey].map(banner => (
                <StatusAlert
                  dismissible
                  open
                  key={banner.id}
                  alertType={banner.bannerType}
                  onClose={() => this.props.removeBanner(program.programKey, banner.id)}
                  dialog={(
                    <div className="modal-alert">
                      {`${banner.message} `}
                      {banner.linkMessage && <a href={banner.linkHref} target="_blank" rel="noopener noreferrer">{banner.linkMessage}</a>}
                    </div>
                  )}
                />
            ))}
            <div className="btn-group" role="group">
              <div className="btn open-btn btn-outline-primary">
                    Manage Enrollments
              </div>
            </div>
            <div className="expanded">
              <div className="inner-btn">Upload Program Enrollments</div>
              <div className="inner-btn">Download Program Enrollments</div>
              <div className="inner-btn">Upload Course Enrollments</div>
              <div className="inner-btn">Download Course Enrollments</div>
            </div>
            <div className="btn-group" role="group" style={{'margin-top':'10px'}}>
              <div className="btn my-btn btn-outline-primary">
                  <input
                    type="file"
                    className="sr input-overlay-hack"
                  />Download Reports
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

UploadPage.propTypes = {
  authorized: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    programKey: PropTypes.string,
    programTitle: PropTypes.string,
    programUrl: PropTypes.string,
  })).isRequired,
  fetchWritablePrograms: PropTypes.func.isRequired,
  programBanners: PropTypes.shape().isRequired,
  uploadEnrollments: PropTypes.func.isRequired,
  downloadEnrollments: PropTypes.func.isRequired,
  removeBanner: PropTypes.func.isRequired,
};

export default connect(uploadSelector, {
  fetchWritablePrograms,
  uploadEnrollments,
  downloadEnrollments,
  removeBanner,
})(injectIntl(UploadPage));
