import { sanitizeHtml } from './sanitize';

describe('sanitizeHtml', () => {
  it('preserves safe tags', async () => {
    const input = '<p>hello <strong>world</strong></p>';
    const output = await sanitizeHtml(input);
    expect(output).toContain('<p>');
    expect(output).toContain('<strong>');
    expect(output).toContain('hello');
    expect(output).toContain('world');
  });

  it('strips script tags', async () => {
    const input = '<p>safe</p><script>alert("xss")</script>';
    const output = await sanitizeHtml(input);
    expect(output).not.toContain('<script>');
    expect(output).not.toContain('alert');
    expect(output).toContain('safe');
  });

  it('strips on* event attributes', async () => {
    const input = '<p onclick="alert(1)">click me</p>';
    const output = await sanitizeHtml(input);
    expect(output).not.toContain('onclick');
    expect(output).toContain('click me');
  });

  it('strips javascript: href', async () => {
    const input = '<a href="javascript:alert(1)">link</a>';
    const output = await sanitizeHtml(input);
    expect(output).not.toContain('javascript:');
  });

  it('preserves safe href', async () => {
    const input = '<a href="https://example.com">link</a>';
    const output = await sanitizeHtml(input);
    expect(output).toContain('href="https://example.com"');
  });

  it('strips iframe tags', async () => {
    const input = '<iframe src="https://evil.com"></iframe>';
    const output = await sanitizeHtml(input);
    expect(output).not.toContain('<iframe');
  });

  it('returns empty string for empty input', async () => {
    const output = await sanitizeHtml('');
    expect(output.trim()).toBe('');
  });
});
