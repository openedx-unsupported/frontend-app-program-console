/* eslint-disable import/no-extraneous-dependencies */
import { fireEvent, render, screen } from '@testing-library/react';
import { shallow } from '@edx/react-unit-test-utils';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { ConsolePage } from './ConsolePage';

let apiData = [];

beforeEach(() => {
  apiData = [{
    programKey: 'a',
    programTitle: 'a masters',
    programUrl: 'https://amasters.com',
    areEnrollmentsWritable: true,
    areReportsReadable: false,
  }, {
    programKey: 'b',
    programTitle: 'b masters',
    programUrl: 'https://bmasters.com',
    areEnrollmentsWritable: true,
    areReportsReadable: false,
  }];
});

describe('ConsolePage', () => {
  it('renders with the most basic props passed to it', () => {
    const consolePageComponent = (
      <IntlProvider locale="en">
        <ConsolePage
          authorized
          data={[]}
          downloadEnrollments={() => {}}
          fetchPrograms={() => {}}
          filterPrograms={() => {}}
          programBanners={{}}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          switchPage={() => {}}
        />
      </IntlProvider>
    );
    const { container } = render(consolePageComponent);

    expect(container).toMatchSnapshot();
    expect(container.querySelector('.alert-warning.show')).toBeNull();
    expect(container.querySelector('.alert-danger.show')).toBeNull();
  });

  it('renders a warning banner if there is not an authorized user', () => {
    const consolePageComponent = (
      <IntlProvider locale="en">
        <ConsolePage
          authorized={false}
          data={[]}
          downloadEnrollments={() => {}}
          fetchPrograms={() => {}}
          filterPrograms={() => {}}
          programBanners={{}}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          switchPage={() => {}}
        />
      </IntlProvider>
    );
    const { container } = render(consolePageComponent);

    expect(container).toMatchSnapshot();
    expect(container.querySelector('.alert-warning.show')).toBeInTheDocument();
    expect(container.querySelector('.alert-danger.show')).toBeNull();
  });

  it('renders an error banner when there was an error loading programs', () => {
    const consolePageComponent = (
      <IntlProvider locale="en">
        <ConsolePage
          authorized={false}
          loadingError="Request failed with HTTP 418"
          data={[]}
          downloadEnrollments={() => {}}
          fetchPrograms={() => {}}
          filterPrograms={() => {}}
          programBanners={{}}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          switchPage={() => {}}
        />
      </IntlProvider>
    );
    const { container } = render(consolePageComponent);

    expect(container).toMatchSnapshot();
    expect(container.querySelector('.alert-warning.show')).toBeNull();
    expect(container.querySelector('.alert-danger.show')).toBeInTheDocument();
  });

  it('renders programs when there is data passed in', () => {
    const consolePageComponent = (
      <IntlProvider locale="en">
        <ConsolePage
          authorized
          data={apiData}
          downloadEnrollments={() => {}}
          fetchPrograms={() => {}}
          filterPrograms={() => {}}
          programBanners={{}}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          switchPage={() => {}}
        />
      </IntlProvider>
    );
    const { container } = render(consolePageComponent);

    expect(container).toMatchSnapshot();
    apiData.forEach((program, idx) => {
      expect(screen.getByText(program.programTitle)).toBeInTheDocument();
      expect(container.querySelectorAll('.pgn_collapsible')[idx]).toHaveClass('is-open');
    });

    expect(container.querySelector('.alert-danger.show')).toBeNull();
    expect(container.querySelector('.alert-info.show')).toBeNull();
    expect(container.querySelector('.alert-warning.show')).toBeNull();
  });

  it('passes isFirstSection=true to report section when there is no enrollment section', () => {
    apiData = [{
      programKey: 'a',
      programTitle: 'a masters',
      programUrl: 'https://amasters.com',
      areEnrollmentsWritable: false,
      areReportsReadable: true,
    }];
    const consolePageComponent = (
      <ConsolePage
        authorized
        data={apiData}
        downloadEnrollments={() => {}}
        fetchPrograms={() => {}}
        filterPrograms={() => {}}
        programBanners={{}}
        uploadEnrollments={() => {}}
        removeBanner={() => {}}
        switchPage={() => {}}
      />
    );

    // shallow render ConsolePage to avoid fully rendering the ConnectedReportSection,
    // which requires a Redux store
    const { instance } = shallow(consolePageComponent);

    expect(instance.findByType('h2')[0].el.children[0]).toEqual(apiData[0].programTitle);

    // we don't expect to see the enrollment section
    expect(instance.findByTestId('collapsible')).toEqual([]);

    expect(instance.findByTestId('report-section')[0].props.isFirstSection).toEqual(true);

    expect(instance.findByTestId('alert-danger')[0].props.show).toEqual(false);
    expect(instance.findByTestId('alert-info')).toEqual([]);
    expect(instance.findByTestId('alert-warning')[0].props.show).toEqual(false);
  });

  it('passes isFirstSection=false to report section when there is an enrollment section', () => {
    apiData = [{
      programKey: 'a',
      programTitle: 'a masters',
      programUrl: 'https://amasters.com',
      areEnrollmentsWritable: true,
      areReportsReadable: true,
    }];
    const consolePageComponent = (
      <ConsolePage
        authorized
        data={apiData}
        downloadEnrollments={() => {}}
        fetchPrograms={() => {}}
        filterPrograms={() => {}}
        programBanners={{}}
        uploadEnrollments={() => {}}
        removeBanner={() => {}}
        switchPage={() => {}}
      />
    );

    // shallow render ConsolePage to avoid fully rendering the ConnectedReportSection,
    // which requires a Redux store
    const { instance } = shallow(consolePageComponent);

    expect(instance.findByType('h2')[0].el.children[0]).toEqual(apiData[0].programTitle);

    const collapsible = instance.findByTestId('collapsible');
    expect(collapsible[0].props.title).toEqual('Manage Enrollments');
    expect(collapsible[0].props.defaultOpen).toEqual(true);

    expect(instance.findByTestId('report-section')[0].props.isFirstSection).toEqual(false);

    expect(instance.findByTestId('alert-danger')[0].props.show).toEqual(false);
    expect(instance.findByTestId('alert-info')).toEqual([]);
    expect(instance.findByTestId('alert-warning')[0].props.show).toEqual(false);
  });

  it('renders program banners when they are included', () => {
    const programBanners = {
      a: [{
        id: `a${Date.now()}`,
        bannerType: 'danger',
        message: 'Sorry something went wrong',
      }],
      b: [{
        id: `b${Date.now()}`,
        bannerType: 'success',
        message: 'You did it!',
      }],
    };
    const consolePageComponent = (
      <IntlProvider locale="en">
        <ConsolePage
          authorized
          data={apiData}
          downloadEnrollments={() => {}}
          fetchPrograms={() => {}}
          filterPrograms={() => {}}
          programBanners={programBanners}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          switchPage={() => {}}
        />
      </IntlProvider>
    );
    const { container } = render(consolePageComponent);

    expect(container).toMatchSnapshot();
    expect(container.querySelector('.alert-danger.show')).toHaveTextContent('Sorry something went wrong ');
    expect(container.querySelector('.alert-success.show')).toHaveTextContent('You did it! ');
  });

  it('calls the fetchPrograms function on pageload', () => {
    const mock = jest.fn();

    expect(mock).not.toHaveBeenCalled();

    render(
      <IntlProvider locale="en">
        <ConsolePage
          authorized
          data={[]}
          downloadEnrollments={() => {}}
          fetchPrograms={mock}
          filterPrograms={() => {}}
          programBanners={{}}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          switchPage={() => {}}
        />
      </IntlProvider>,
    );

    expect(mock).toHaveBeenCalled();
  });

  it('calls the filterPrograms function on form submit', () => {
    const mock = jest.fn();

    expect(mock).not.toHaveBeenCalled();

    const { container } = render(
      <IntlProvider locale="en">
        <ConsolePage
          authorized
          data={apiData}
          downloadEnrollments={() => {}}
          fetchPrograms={() => {}}
          filterPrograms={mock}
          programBanners={{}}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          switchPage={() => {}}
        />
      </IntlProvider>,
    );

    const filterForm = container.querySelector('form');
    fireEvent.submit(filterForm);
    expect(mock).toHaveBeenCalled();
  });

  it('renders error when filter returns no programs', () => {
    const consolePageComponent = (
      <IntlProvider locale="en">
        <ConsolePage
          authorized
          data={apiData}
          downloadEnrollments={() => {}}
          fetchPrograms={() => {}}
          filterPrograms={() => {}}
          filterError
          programBanners={{}}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          switchPage={() => {}}
        />
      </IntlProvider>
    );
    const { container: tree } = render(consolePageComponent);

    expect(tree).toMatchSnapshot();
    const alert = screen.getByTestId('error-alert');
    expect(alert).toHaveTextContent('Invalid');
  });

  it('calls the correct action with the correct program key on download button clicks', () => {
    const mock = jest.fn();

    const { container } = render(
      <IntlProvider locale="en">
        <ConsolePage
          authorized
          data={apiData}
          downloadEnrollments={mock}
          fetchPrograms={() => {}}
          filterPrograms={() => {}}
          programBanners={{}}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          switchPage={() => {}}
        />
      </IntlProvider>,
    );

    const programADownloadProgramButton = container.querySelectorAll('button.btn.btn-outline-primary')[0];
    expect(programADownloadProgramButton).toHaveTextContent('Download Program Enrollments');
    fireEvent.click(programADownloadProgramButton);
    expect(mock).toHaveBeenCalledWith('a', false);

    const programADownloadCourseButton = container.querySelectorAll('button.btn.btn-outline-primary')[1];
    expect(programADownloadCourseButton).toHaveTextContent('Download Course Enrollments');
    fireEvent.click(programADownloadCourseButton);
    expect(mock).toHaveBeenCalledWith('a', true);

    const programBDownloadProgramButton = container.querySelectorAll('button.btn.btn-outline-primary')[2];
    expect(programBDownloadProgramButton).toHaveTextContent('Download Program Enrollments');
    fireEvent.click(programBDownloadProgramButton);
    expect(mock).toHaveBeenCalledWith('b', false);

    const programBDownloadCourseButton = container.querySelectorAll('button.btn.btn-outline-primary')[3];
    expect(programBDownloadCourseButton).toHaveTextContent('Download Course Enrollments');
    fireEvent.click(programBDownloadCourseButton);
    expect(mock).toHaveBeenCalledWith('b', true);
  });

  it('calls the correct action with the correct program key onchange of the file inputs', () => {
    const mock = jest.fn();

    const { container } = render(
      <IntlProvider locale="en">
        <ConsolePage
          authorized
          data={apiData}
          downloadEnrollments={() => {}}
          fetchPrograms={() => {}}
          filterPrograms={() => {}}
          programBanners={{}}
          uploadEnrollments={mock}
          removeBanner={() => {}}
          switchPage={() => {}}
        />
      </IntlProvider>,
    );

    const file = new File([], 'test');

    expect(mock).not.toHaveBeenCalled();
    const fileInputs = container.querySelectorAll('.input-overlay-hack');

    fireEvent.change(fileInputs[0], { target: { files: [file] } });
    expect(mock).toHaveBeenCalledWith('a', false, file);

    fireEvent.change(fileInputs[1], { target: { files: [file] } });
    expect(mock).toHaveBeenCalledWith('a', true, file);

    fireEvent.change(fileInputs[2], { target: { files: [file] } });
    expect(mock).toHaveBeenCalledWith('b', false, file);

    fireEvent.change(fileInputs[3], { target: { files: [file] } });
    expect(mock).toHaveBeenCalledWith('b', true, file);
  });

  it('renders the correct programs on page switch', () => {
    const testData = [];
    for (let i = 0; i < 11; i += 1) {
      testData.push({
        programKey: `${i}`,
        programTitle: `program ${i}`,
        programUrl: `https://program${i}.com`,
        areEnrollmentsWritable: true,
        areReportsReadable: false,
      });
    }

    const consolePageComponentOne = (
      <IntlProvider locale="en">
        <ConsolePage
          authorized
          data={testData}
          downloadEnrollments={() => {}}
          fetchPrograms={() => {}}
          filterPrograms={() => {}}
          programBanners={{}}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          currentPage={1}
          switchPage={() => {}}
        />
      </IntlProvider>
    );
    const wrapperOne = render(consolePageComponentOne);
    const programTitleZero = wrapperOne.container.querySelector('h2');
    expect(programTitleZero).toHaveTextContent('program 0');

    const consolePageComponentTwo = (
      <IntlProvider locale="en">
        <ConsolePage
          authorized
          data={testData}
          downloadEnrollments={() => {}}
          fetchPrograms={() => {}}
          filterPrograms={() => {}}
          programBanners={{}}
          uploadEnrollments={() => {}}
          removeBanner={() => {}}
          currentPage={2}
          switchPage={() => {}}
        />
      </IntlProvider>
    );
    const wrapperTwo = render(consolePageComponentTwo);
    const programTitleTen = wrapperTwo.container.querySelector('h2');
    expect(programTitleTen).toHaveTextContent('program 10');
  });
});
