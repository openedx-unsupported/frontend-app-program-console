import { mount, shallow } from 'enzyme';
import { Collapsible } from '@openedx/paragon';
import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider } from 'react-intl';
import { ConsolePage } from './ConsolePage';
import ConnectedReportSection from '../report/reportSection';

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
    const wrapper = mount(consolePageComponent);
    const tree = renderer.create(consolePageComponent);

    expect(tree).toMatchSnapshot();
    expect(wrapper.exists('.alert.alert-warning.show')).toEqual(false);
    expect(wrapper.exists('.alert.alert-danger.show')).toEqual(false);
    wrapper.unmount();
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
    const wrapper = mount(consolePageComponent);
    const tree = renderer.create(consolePageComponent);

    expect(tree).toMatchSnapshot();
    expect(wrapper.exists('.alert.alert-warning.show')).toEqual(true);
    expect(wrapper.exists('.alert.alert-danger.show')).toEqual(false);
    wrapper.unmount();
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
    const wrapper = mount(consolePageComponent);
    const tree = renderer.create(consolePageComponent);

    expect(tree).toMatchSnapshot();
    expect(wrapper.exists('.alert.alert-warning.show')).toEqual(false);
    expect(wrapper.exists('.alert.alert-danger.show')).toEqual(true);
    wrapper.unmount();
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
    const wrapper = mount(consolePageComponent);
    const tree = renderer.create(consolePageComponent).toJSON();

    expect(tree).toMatchSnapshot();
    apiData.forEach((program, idx) => {
      expect(wrapper.find('h2').at(idx).text()).toEqual(program.programTitle);
      expect(wrapper.find(Collapsible).at(idx).prop('defaultOpen')).toEqual(true);
    });

    expect(wrapper.exists('.alert-danger.show')).toEqual(false);
    expect(wrapper.exists('.alert-info.show')).toEqual(false);
    expect(wrapper.exists('.alert-warning.show')).toEqual(false);

    wrapper.unmount();
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
    const wrapper = shallow(consolePageComponent);

    expect(wrapper.find('h2').text()).toEqual(apiData[0].programTitle);

    // we don't expect to see the enrollment section
    expect(wrapper.exists(Collapsible)).toEqual(false);

    expect(wrapper.find(ConnectedReportSection).prop('isFirstSection')).toEqual(true);

    expect(wrapper.exists('.alert-danger')).toEqual(false);
    expect(wrapper.exists('.alert-info')).toEqual(false);
    expect(wrapper.exists('.alert-warning.show')).toEqual(false);

    wrapper.unmount();
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
    const wrapper = shallow(consolePageComponent);

    expect(wrapper.find('h2').text()).toEqual(apiData[0].programTitle);

    const collapsible = wrapper.find(Collapsible);
    expect(collapsible.prop('title')).toEqual('Manage Enrollments');
    expect(collapsible.prop('defaultOpen')).toEqual(true);

    expect(wrapper.find(ConnectedReportSection).prop('isFirstSection')).toEqual(false);

    expect(wrapper.exists('.alert-danger')).toEqual(false);
    expect(wrapper.exists('.alert-info')).toEqual(false);
    expect(wrapper.exists('.alert-warning.show')).toEqual(false);

    wrapper.unmount();
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
    const wrapper = mount(consolePageComponent);
    const tree = renderer.create(consolePageComponent).toJSON();

    expect(tree).toMatchSnapshot();
    expect(wrapper.find('.alert-danger.show .modal-alert').at(0).text()).toEqual('Sorry something went wrong ');
    expect(wrapper.find('.alert-success.show .modal-alert').at(0).text()).toEqual('You did it! ');

    wrapper.unmount();
  });

  it('calls the fetchPrograms function on pageload', () => {
    const mock = jest.fn();

    expect(mock).not.toHaveBeenCalled();

    mount(
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

    const wrapper = mount(
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

    const filterForm = wrapper.find('form');
    filterForm.simulate('submit');
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
    const wrapper = mount(consolePageComponent);
    const tree = renderer.create(consolePageComponent);

    expect(tree).toMatchSnapshot();
    const alert = wrapper.find('[data-testid="filter-alert"]').first();
    expect(alert.text()).toContain('Invalid');
    wrapper.unmount();
  });

  it('calls the correct action with the correct program key on download button clicks', () => {
    const mock = jest.fn();

    const wrapper = mount(
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

    const programADownloadProgramButton = wrapper.find('button.btn.btn-outline-primary').at(0);
    expect(programADownloadProgramButton.text()).toEqual('Download Program Enrollments');
    programADownloadProgramButton.simulate('click');
    expect(mock).toHaveBeenCalledWith('a', false);

    const programADownloadCourseButton = wrapper.find('button.btn.btn-outline-primary').at(1);
    expect(programADownloadCourseButton.text()).toEqual('Download Course Enrollments');
    programADownloadCourseButton.simulate('click');
    expect(mock).toHaveBeenCalledWith('a', true);

    const programBDownloadProgramButton = wrapper.find('button.btn.btn-outline-primary').at(2);
    expect(programBDownloadProgramButton.text()).toEqual('Download Program Enrollments');
    programBDownloadProgramButton.simulate('click');
    expect(mock).toHaveBeenCalledWith('b', false);

    const programBDownloadCourseButton = wrapper.find('button.btn.btn-outline-primary').at(3);
    expect(programBDownloadCourseButton.text()).toEqual('Download Course Enrollments');
    programBDownloadCourseButton.simulate('click');
    expect(mock).toHaveBeenCalledWith('b', true);
  });

  it('calls the correct action with the correct program key onchange of the file inputs', () => {
    const mock = jest.fn();

    const wrapper = mount(
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
    wrapper.find('.input-overlay-hack').at(0).simulate('change', { target: { name: 'pollName', files: [file] } });
    expect(mock).toHaveBeenCalledWith('a', false, file);
    wrapper.find('.input-overlay-hack').at(1).simulate('change', { target: { name: 'pollName', files: [file] } });
    expect(mock).toHaveBeenCalledWith('a', true, file);
    wrapper.find('.input-overlay-hack').at(2).simulate('change', { target: { name: 'pollName', files: [file] } });
    expect(mock).toHaveBeenCalledWith('b', false, file);
    wrapper.find('.input-overlay-hack').at(3).simulate('change', { target: { name: 'pollName', files: [file] } });
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
    const wrapperOne = mount(consolePageComponentOne);
    const programTitleZero = wrapperOne.find('h2').first();
    expect(programTitleZero.text()).toEqual('program 0');
    wrapperOne.unmount();

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
    const wrapperTwo = mount(consolePageComponentTwo);
    const programTitleTen = wrapperTwo.find('h2').first();
    expect(programTitleTen.text()).toEqual('program 10');
    wrapperTwo.unmount();
  });
});
