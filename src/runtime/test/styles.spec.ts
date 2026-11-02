import { styles } from '@platform';

import { appendStyleSourceMap, registerStyle } from '../styles';

describe('style source maps', () => {
  afterEach(() => styles.delete('source-map-test'));

  it('retains the CSS source map when registering a non-constructable style', () => {
    registerStyle('source-map-test', '.button{color:red}', false, 'data:application/json;base64,AAAA');

    expect(styles.get('source-map-test')).toBe(
      '.button{color:red}\n/*# sourceMappingURL=data:application/json;base64,AAAA */',
    );
  });

  it('keeps each external style and its source map separate', () => {
    registerStyle('source-map-test', ['.first{color:red}', '.second{color:blue}'], false, [
      'https://cdn.example.com/first.css.map',
      'https://cdn.example.com/second.css.map',
    ]);

    expect(styles.get('source-map-test')).toEqual([
      '.first{color:red}\n/*# sourceMappingURL=https://cdn.example.com/first.css.map */',
      '.second{color:blue}\n/*# sourceMappingURL=https://cdn.example.com/second.css.map */',
    ]);
  });

  it('flattens imported style entries before registering their source maps', () => {
    registerStyle('source-map-test', ['.imported{color:green}', '.local{color:red}', '.second{color:blue}'], false, [
      'imported.css.map',
      'local.css.map',
      'second.css.map',
    ]);

    expect(styles.get('source-map-test')).toEqual([
      '.imported{color:green}\n/*# sourceMappingURL=imported.css.map */',
      '.local{color:red}\n/*# sourceMappingURL=local.css.map */',
      '.second{color:blue}\n/*# sourceMappingURL=second.css.map */',
    ]);
  });

  it('adds a CSS source-map annotation to runtime style text', () => {
    expect(appendStyleSourceMap('.button{color:red}', 'data:application/json;base64,AAAA')).toBe(
      '.button{color:red}\n/*# sourceMappingURL=data:application/json;base64,AAAA */',
    );
  });

  it('does not add an annotation when CSS source maps are disabled', () => {
    expect(appendStyleSourceMap('.button{color:red}', undefined)).toBe('.button{color:red}');
  });

  it('preserves an existing source-map annotation when no replacement map is provided', () => {
    const style = '.button{color:red}\n/*# sourceMappingURL=styles.css.map */';
    expect(appendStyleSourceMap(style, undefined)).toBe(style);
  });

  it('does not duplicate a source-map annotation during HMR updates', () => {
    const style = '.button{color:red}\n/*# sourceMappingURL=data:application/json;base64,AAAA */';
    expect(appendStyleSourceMap(style, 'data:application/json;base64,BBBB')).toBe(
      '.button{color:red}\n/*# sourceMappingURL=data:application/json;base64,BBBB */',
    );
  });
});
