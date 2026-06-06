import { media, sizes } from '../media';

describe('media', () => {
  it('should return media query in css', () => {
    const mediaQuery = `${media.small()}{color:red;}`;
    const cssVersion = `@media (min-width:${sizes.small}px){color:red;}`;
    expect(mediaQuery).toMatch(cssVersion);
  });
});
