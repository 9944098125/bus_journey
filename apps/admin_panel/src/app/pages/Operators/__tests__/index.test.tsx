import * as React from 'react';
import * as Module from '../index';

// Mock hooks commonly used in components
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}));

jest.mock('../../slice', () => ({
  useGlobalSlice: jest.fn()
}), { virtual: true });

jest.mock('../slice', () => ({
  useGlobalSlice: jest.fn()
}), { virtual: true });

// Mock redux hooks just in case
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => jest.fn(),
  useStore: () => ({
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  }),
}));

// Mock react-router hooks
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children }: any) => <a>{children}</a>
}));

// Mock leaflet for components that use it
jest.mock('react-leaflet', () => ({
  MapContainer: () => null,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  Polyline: () => null,
  CircleMarker: () => null,
  useMap: () => ({}),
  useMapEvents: () => ({}),
  useMapEvent: () => ({}),
}), { virtual: true });

describe('<Operators />', () => {
  it('should be defined', () => {
    expect(Module).toBeDefined();
  });
});
