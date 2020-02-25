import { mount } from 'enzyme';
import { Collapsible, StatusAlert } from '@edx/paragon';
import React from 'react';
import renderer from 'react-test-renderer';
import { ReportSection } from './reportSection';

const assertCollapsibleProps = (collapsible) => {
  expect(collapsible.prop('className')).toEqual(expect.stringContaining('shadow'));
  expect(collapsible.prop('title')).toEqual('Download Reports');
};

describe('ReportSection component', () => {
  it('renders with the most basic props passed to it', () => {
    const tree = renderer.create((<ReportSection
      reportData={{}}
      fetchReports={() => { }}
      programKey=""
      isFirstSection
    />)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('correctly passes isFirstSection prop to collapsible component as defaultOpen', () => {
    const reportData = {
      'program-key': [
        {
          name: 'one-report',
          downloadUrl: 'example.com/one-report',
        },
      ],
    };
    [true, false].forEach((isFirstSectionValue) => {
      it(`${isFirstSectionValue}`, () => {
        const reportSectionComponent = (
          <ReportSection
            reportData={reportData}
            fetchReports={() => { }}
            programKey="program-key"
            isFirstSection={isFirstSectionValue}
          />
        );
        const wrapper = mount(reportSectionComponent);
        const tree = renderer.create(reportSectionComponent);

        expect(tree).toMatchSnapshot();
        const collapsible = wrapper.find(Collapsible);
        assertCollapsibleProps(collapsible);
        expect(collapsible.prop('defaultOpen')).toEqual(isFirstSectionValue);
      });
    });
  });

  it('renders contents when program data is passed in', () => {
    const reportData = {
      'program-key': [
        {
          name: 'first-report',
          downloadUrl: 'example.com/first-report',
        },
        {
          name: 'second-report',
          downloadUrl: 'example.com/second-report',
        },
      ],
    };

    const reportSectionComponent = (
      <ReportSection
        reportData={reportData}
        fetchReports={() => { }}
        programKey="program-key"
        isFirstSection
      />
    );

    const wrapper = mount(reportSectionComponent);
    const tree = renderer.create(reportSectionComponent);

    expect(tree).toMatchSnapshot();
    const collapsible = wrapper.find(Collapsible);
    assertCollapsibleProps(collapsible);

    // check contents of the Collapsible body
    expect(collapsible.exists('div.container')).toEqual(true);
    const links = collapsible.find('div.container div a');
    expect(links).toHaveLength(2);
    links.forEach((link, index) => {
      expect(link.prop('href')).toEqual(reportData['program-key'][index].downloadUrl);
      expect(link.text()).toEqual(reportData['program-key'][index].name);
    });

    const statusAlert = collapsible.find('div.container').find(StatusAlert);
    expect(statusAlert.prop('alertType')).toEqual('info');
    expect(statusAlert.prop('dismissible')).toEqual(false);
    expect(statusAlert.prop('dialog')).toEqual('The data contained in these reports reflect enrollments only and are not intended to be used for financial reporting or reconciliation.');
    expect(statusAlert.prop('open')).toEqual(true);
  });

  it('doesn\'t render contents when no program data is passed in', () => {
    const reportSectionComponent = (
      <ReportSection
        reportData={{}}
        fetchReports={() => { }}
        programKey="program-key"
        isFirstSection
      />
    );

    const wrapper = mount(reportSectionComponent);
    const tree = renderer.create(reportSectionComponent);

    expect(tree).toMatchSnapshot();
    const collapsible = wrapper.find(Collapsible);
    expect(collapsible).toHaveLength(0);
  });

  it('doesn\'t render contents when empty program key is passed in', () => {
    const reportSectionComponent = (<ReportSection
      reportData={{}}
      fetchReports={() => { }}
      programKey=""
      isFirstSection
    />);

    const wrapper = mount(reportSectionComponent);
    const tree = renderer.create(reportSectionComponent);

    expect(tree).toMatchSnapshot();
    const collapsible = wrapper.find(Collapsible);
    expect(collapsible).toHaveLength(0);
  });

  it('calls the fetchReports function on load if program key prop is passed in', () => {
    const mock = jest.fn();

    mount(<ReportSection
      reportData={{}}
      fetchReports={mock}
      programKey="program-key"
      isFirstSection
    />);

    expect(mock).toHaveBeenCalled();
  });

  it('doesn\'t call the fetchReports function on load if program key prop is not passed in', () => {
    const mock = jest.fn();

    mount(<ReportSection
      reportData={{}}
      fetchReports={mock}
      programKey=""
      isFirstSection
    />);

    expect(mock).not.toHaveBeenCalled();
  });
});
