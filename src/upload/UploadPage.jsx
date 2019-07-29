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
              <div className="btn btn-outline-primary">
                <input
                  type="file"
                  className="sr input-overlay-hack"
                  onChange={e => this.handleUploadProgramEnrollments(program.programKey, e)}
                />Upload Program Enrollments
              </div>
              <button
                className="btn btn-outline-primary"
                onClick={() => this.handleDownloadProgramEnrollments(program.programKey)}
              >Download Program Enrollments
              </button>
            </div>
            <div className="btn-group" role="group">
              <div className="btn btn-outline-primary">
                <input
                  type="file"
                  className="sr input-overlay-hack"
                  onChange={e => this.handleUploadCourseEnrollments(program.programKey, e)}
                />Upload Course Enrollments
              </div>
              <button
                className="btn btn-outline-primary"
                onClick={() => this.handleDownloadCourseEnrollments(program.programKey)}
              >Download Course Enrollments
              </button>
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
