import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import * as analytics from '@edx/frontend-platform/analytics';
import { ReportSection } from './reportSection';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

describe('ReportSection component', () => {
  it('renders with the most basic props passed to it', () => {
    const { container: tree } = render(
      <ReportSection
        reportData={{}}
        fetchReports={() => { }}
        programKey=""
        isFirstSection
      />,
    );
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
        render(reportSectionComponent);
        const collapsible = screen.getByRole('button', { name: 'Download Reports' });
        const isExpanded = collapsible.getAttribute('aria-expanded') === 'true';
        expect(isExpanded).toBe(isFirstSectionValue);
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

    const { container, debug } = render(reportSectionComponent);

    debug();

    expect(container).toMatchSnapshot();
    const collapsible = container.querySelector('.pgn_collapsible');
    expect(collapsible).toHaveClass('shadow');
    expect(collapsible).toHaveTextContent('Download Reports');
    expect(collapsible.querySelector('.container')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    links.forEach((link, index) => {
      expect(link).toHaveAttribute('href', reportData['program-key'][index].downloadUrl);
      expect(link).toHaveTextContent(reportData['program-key'][index].name);
    });

    const statusAlert = screen.getByRole('alert');
    expect(statusAlert).toHaveClass('alert-info');
    expect(statusAlert).toHaveTextContent('The data contained in these reports reflect enrollments only and are not intended to be used for financial reporting or reconciliation.');
    expect(statusAlert).toHaveClass('show');
    expect(statusAlert).not.toHaveClass('dismissible');
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

    render(reportSectionComponent);
    const collapsible = screen.queryByRole('button', { name: 'Download Reports' });
    expect(collapsible).not.toBeInTheDocument();
  });

  it('doesn\'t render contents when empty program key is passed in', () => {
    const reportSectionComponent = (
      <ReportSection
        reportData={{}}
        fetchReports={() => { }}
        programKey=""
        isFirstSection
      />
    );

    render(reportSectionComponent);
    const collapsible = screen.queryByRole('button', { name: 'Download Reports' });
    expect(collapsible).not.toBeInTheDocument();
  });

  it('calls the fetchReports function on load if program key prop is passed in', () => {
    const mock = jest.fn();

    render(<ReportSection
      reportData={{}}
      fetchReports={mock}
      programKey="program-key"
      isFirstSection
    />);

    expect(mock).toHaveBeenCalled();
  });

  it('doesn\'t call the fetchReports function on load if program key prop is not passed in', () => {
    const mock = jest.fn();

    render(<ReportSection
      reportData={{}}
      fetchReports={mock}
      programKey=""
      isFirstSection
    />);

    expect(mock).not.toHaveBeenCalled();
  });

  it('calls sendTrackEvent when report download link is clicked', () => {
    const reportData = {
      'program-key': [
        {
          name: 'first-report',
          downloadUrl: 'example.com/first-report',
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

    const { container } = render(reportSectionComponent);
    const link = container.querySelector('#console-report');
    fireEvent.click(link);
    expect(analytics.sendTrackEvent).toHaveBeenCalled();
  });
});
