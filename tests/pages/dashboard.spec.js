import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Dashboard from '../../src/views/Dashboard';

configure({ adapter: new Adapter() });

describe('<Dashboard /> page', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Dashboard />);
  });

  it('should exist', () => {
    expect(component).toBeDefined();
  });

  it('should have one <h1>', () => {
    expect(component.find('h3')).toHaveLength(1);
  });
});
