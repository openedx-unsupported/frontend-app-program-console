import { mount } from 'enzyme';
import { Collapsible } from '@edx/paragon';
import React from 'react';
import renderer from 'react-test-renderer';
import { UploadPage } from './UploadPage';


describe('UploadPage...', () => {
  it('...renders with the most basic props passed to it', () => {
    const tree = renderer.create((<UploadPage
      authorized
      data={[]}
      downloadEnrollments={() => {}}
      fetchWritablePrograms={() => {}}
      programBanners={{}}
      uploadEnrollments={() => {}}
      removeBanner={() => {}}
    />)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('...renders an error banner if there is not an authorized user', () => {
    const uploadPageComponent = (<UploadPage
      authorized={false}
      data={[]}
      downloadEnrollments={() => {}}
      fetchWritablePrograms={() => {}}
      programBanners={{}}
      uploadEnrollments={() => {}}
      removeBanner={() => {}}
    />);
    const wrapper = mount(uploadPageComponent);
    const tree = renderer.create(uploadPageComponent);

    expect(tree).toMatchSnapshot();
    expect(wrapper.exists('.alert.alert-warning.show')).toEqual(true);
    wrapper.unmount();
  });

  it('...renders programs when there is data passed in', () => {
    const apiData = [{
      programKey: 'a',
      programTitle: 'a masters',
      programUrl: 'https://amasters.com',
    }, {
      programKey: 'b',
      programTitle: 'b masters',
      programUrl: 'https://bmasters.com',
    }];
    const uploadPageComponent = (<UploadPage
      authorized
      data={apiData}
      downloadEnrollments={() => {}}
      fetchWritablePrograms={() => {}}
      programBanners={{}}
      uploadEnrollments={() => {}}
      removeBanner={() => {}}
    />);
    const wrapper = mount(uploadPageComponent);
    const tree = renderer.create(uploadPageComponent).toJSON();


    expect(tree).toMatchSnapshot();
    apiData.forEach((program, idx) => {
      expect(wrapper.find('h2').at(idx).text()).toEqual(program.programTitle);
      expect(wrapper.find(Collapsible).at(idx).prop('defaultOpen')).toEqual(true);
    });

    expect(wrapper.exists('.alert-danger')).toEqual(false);
    expect(wrapper.exists('.alert-info')).toEqual(false);
    expect(wrapper.exists('.alert-warning.show')).toEqual(false);

    wrapper.unmount();
  });

  it('...renders program banners when they are included', () => {
    const apiData = [{
      programKey: 'a',
      programTitle: 'a masters',
      programUrl: 'https://amasters.com',
    }, {
      programKey: 'b',
      programTitle: 'b masters',
      programUrl: 'https://bmasters.com',
    }];

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
    const uploadPageComponent = (<UploadPage
      authorized
      data={apiData}
      downloadEnrollments={() => {}}
      fetchWritablePrograms={() => {}}
      programBanners={programBanners}
      uploadEnrollments={() => {}}
      removeBanner={() => {}}
    />);
    const wrapper = mount(uploadPageComponent);
    const tree = renderer.create(uploadPageComponent).toJSON();

    expect(tree).toMatchSnapshot();
    expect(wrapper.find('.alert-danger .alert-dialog').at(0).text()).toEqual('Sorry something went wrong ');
    expect(wrapper.find('.alert-success .alert-dialog').at(0).text()).toEqual('You did it! ');

    wrapper.unmount();
  });

  it('...calls the fetchWritablePrograms function on pageload', () => {
    const mock = jest.fn();

    expect(mock).not.toHaveBeenCalled();

    mount(<UploadPage
      authorized
      data={[]}
      downloadEnrollments={() => {}}
      fetchWritablePrograms={mock}
      programBanners={{}}
      uploadEnrollments={() => {}}
      removeBanner={() => {}}
    />);

    expect(mock).toHaveBeenCalled();
  });

  it('...calls the correct action with the correct program key on download button clicks', () => {
    const mock = jest.fn();

    const apiData = [{
      programKey: 'a',
      programTitle: 'a masters',
      programUrl: 'https://amasters.com',
    }, {
      programKey: 'b',
      programTitle: 'b masters',
      programUrl: 'https://bmasters.com',
    }];

    const wrapper = mount(<UploadPage
      authorized
      data={apiData}
      downloadEnrollments={mock}
      fetchWritablePrograms={() => {}}
      programBanners={{}}
      uploadEnrollments={() => {}}
      removeBanner={() => {}}
    />);

    const programADownloadProgramButton = wrapper.find('button.btn.btn-primary').at(0);
    expect(programADownloadProgramButton.text()).toEqual('Download Program Enrollments');
    programADownloadProgramButton.simulate('click');
    expect(mock).toHaveBeenCalledWith('a', false);

    const programADownloadCourseButton = wrapper.find('button.btn.btn-primary').at(1);
    expect(programADownloadCourseButton.text()).toEqual('Download Course Enrollments');
    programADownloadCourseButton.simulate('click');
    expect(mock).toHaveBeenCalledWith('a', true);

    const programBDownloadProgramButton = wrapper.find('button.btn.btn-primary').at(2);
    expect(programBDownloadProgramButton.text()).toEqual('Download Program Enrollments');
    programBDownloadProgramButton.simulate('click');
    expect(mock).toHaveBeenCalledWith('b', false);

    const programBDownloadCourseButton = wrapper.find('button.btn.btn-primary').at(3);
    expect(programBDownloadCourseButton.text()).toEqual('Download Course Enrollments');
    programBDownloadCourseButton.simulate('click');
    expect(mock).toHaveBeenCalledWith('b', true);
  });

  it('...calls the correct action with the correct program key onchange of the file inputs', () => {
    const mock = jest.fn();

    const apiData = [{
      programKey: 'a',
      programTitle: 'a masters',
      programUrl: 'https://amasters.com',
    }, {
      programKey: 'b',
      programTitle: 'b masters',
      programUrl: 'https://bmasters.com',
    }];

    const wrapper = mount(<UploadPage
      authorized
      data={apiData}
      downloadEnrollments={() => {}}
      fetchWritablePrograms={() => {}}
      programBanners={{}}
      uploadEnrollments={mock}
      removeBanner={() => {}}
    />);

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
});
