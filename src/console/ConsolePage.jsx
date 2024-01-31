import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from '@edx/frontend-platform/i18n';
import {
  Collapsible,
  Pagination,
  SearchField,
  Alert,
} from '@edx/paragon';

import {
  fetchPrograms,
  filterPrograms,
  uploadEnrollments,
  downloadEnrollments,
  removeBanner,
  switchPage,
} from './actions';
import { consoleSelector } from './selectors';
import ConnectedReportSection from '../report/reportSection';

export class ConsolePage extends React.Component {
  componentDidMount() {
    this.props.fetchPrograms();
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

  handleCurrentPrograms() {
    const startIndex = (this.props.currentPage - 1) * this.props.pageSize;
    const endIndex = Math.min(startIndex + this.props.pageSize, this.props.data.length);
    return this.props.data.slice(startIndex, endIndex);
  }

  handlePageSelect(pageNumber) {
    this.props.switchPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleFilter(value) {
    this.props.filterPrograms(value);
    this.props.switchPage(1);
  }

  renderEnrollmentsCollapsible(program) {
    const rowClasses = 'enrollment-row d-flex align-items-stretch flex-wrap';
    const buttonClasses = 'btn btn-outline-primary d-flex justify-content-center align-items-center h-100 w-100';
    return (
      <Collapsible
        title="Manage Enrollments"
        defaultOpen
        data-testid="collapsible"
      >
        <div className="container p-0">
          <div className={`${rowClasses} mt-2`}>
            <div className="col-md mb-2">
              <div className={buttonClasses}>
                <input
                  type="file"
                  className="sr input-overlay-hack"
                  onChange={e => this.handleUploadProgramEnrollments(program.programKey, e)}
                />Upload Program Enrollments
              </div>
            </div>
            <div className="col-md mb-2">
              <button
                type="button"
                className={buttonClasses}
                onClick={() => this.handleDownloadProgramEnrollments(program.programKey)}
              >Download Program Enrollments
              </button>
            </div>
          </div>
          <div className={rowClasses}>
            <div className="col-md mb-2">
              <div className={buttonClasses}>
                <input
                  type="file"
                  className="sr input-overlay-hack"
                  onChange={e => this.handleUploadCourseEnrollments(program.programKey, e)}
                />Upload Course Enrollments
              </div>
            </div>
            <div className="col-md mb-2">
              <button
                type="button"
                className={buttonClasses}
                onClick={() => this.handleDownloadCourseEnrollments(program.programKey)}
              >Download Course Enrollments
              </button>
            </div>
          </div>
        </div>
      </Collapsible>
    );
  }

  render() {
    return (
      <div className="container half-width-element py-5 align-items-start">
        <h1>Program Console</h1>
        <Alert
          variant="danger"
          dismissible={false}
          show={!!this.props.loadingError}
          data-testid="alert-danger"
        >
          <div>
            <p>
              An error was encountered while loading your program list: <em>{`${this.props.loadingError}`}</em>
            </p>
            <p>
              Please try waiting a moment and then refreshing the page.
              If the issue persists, please reach out to <a href="mailto:partner-support@edx.org">partner-support@edx.org</a>.
            </p>
          </div>
        </Alert>
        <Alert
          dismissible={false}
          show={!this.props.authorized && !this.props.loadingError}
          variant="warning"
          data-testid="alert-warning"
        >
          <p>
            It appears you do not have proper permissions to access this application.
            Please reach out to <a href="mailto:partner-support@edx.org">partner-support@edx.org</a> requesting access to the Registrar service.
          </p>
        </Alert>
        {this.props.data.length > 0 && (
          <div>
            <SearchField
              className="mt-3"
              onSubmit={(value) => this.handleFilter(value)}
              onClear={() => this.handleFilter('')}
              placeholder="Filter by Program Title"
            />
            <Alert
              className="mt-2"
              variant="danger"
              dismissible
              show={!!this.props.filterError}
              data-testid="error-alert"
            >
              <p>Invalid program title.</p>
            </Alert>
            <Pagination
              className="mt-4"
              paginationLabel="pagination navigation"
              pageCount={Math.ceil(this.props.data.length / this.props.pageSize)}
              currentPage={this.props.currentPage}
              onPageSelect={pageNumber => this.handlePageSelect(pageNumber)}
            />
            {this.handleCurrentPrograms().map(program => (
              <div className="container mb-4" key={program.programKey}>
                <h2>{program.programTitle}</h2>
                {this.props.programBanners[program.programKey]
                  && !!this.props.programBanners[program.programKey].length
                  && this.props.programBanners[program.programKey].map(banner => (
                    <Alert
                      dismissible
                      show
                      key={banner.id}
                      variant={banner.bannerType}
                      onClose={() => this.props.removeBanner(program.programKey, banner.id)}
                      data-testid="alert-info"
                    >
                      <div className="modal-alert">
                        {`${banner.message} `}
                        {banner.linkMessage && <a href={banner.linkHref} target="_blank" rel="noopener noreferrer">{banner.linkMessage}</a>}
                      </div>
                    </Alert>
                  ))}
                {program.areEnrollmentsWritable && this.renderEnrollmentsCollapsible(program)}
                {program.areReportsReadable
                  && (
                    <ConnectedReportSection
                      programKey={program.programKey}
                      isFirstSection={!program.areEnrollmentsWritable}
                      data-testid="report-section"
                    />
                  )}
              </div>
            ))}
            <Pagination
              paginationLabel="pagination navigation"
              pageCount={Math.ceil(this.props.data.length / this.props.pageSize)}
              currentPage={this.props.currentPage}
              onPageSelect={pageNumber => this.handlePageSelect(pageNumber)}
            />
          </div>
        )}
      </div>
    );
  }
}

ConsolePage.propTypes = {
  authorized: PropTypes.bool.isRequired,
  loadingError: PropTypes.string,
  filterError: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    programKey: PropTypes.string,
    programTitle: PropTypes.string,
    programUrl: PropTypes.string,
    areEnrollmentsWritable: PropTypes.bool,
    areReportsReadable: PropTypes.bool,
  })).isRequired,
  fetchPrograms: PropTypes.func.isRequired,
  filterPrograms: PropTypes.func.isRequired,
  programBanners: PropTypes.shape().isRequired,
  uploadEnrollments: PropTypes.func.isRequired,
  downloadEnrollments: PropTypes.func.isRequired,
  removeBanner: PropTypes.func.isRequired,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  switchPage: PropTypes.func.isRequired,
};

ConsolePage.defaultProps = {
  loadingError: null,
  filterError: false,
  currentPage: 1,
  pageSize: 10,
};

export default connect(consoleSelector, {
  fetchPrograms,
  filterPrograms,
  uploadEnrollments,
  downloadEnrollments,
  removeBanner,
  switchPage,
})(injectIntl(ConsolePage));
