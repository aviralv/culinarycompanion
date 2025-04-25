module.exports = {
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^swiper/css$': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/css/navigation$': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/css/pagination$': '<rootDir>/__mocks__/styleMock.js',
  },
};
