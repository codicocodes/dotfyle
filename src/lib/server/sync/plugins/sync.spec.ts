import { describe, it, expect, vi, beforeEach } from 'vitest';

// Only I/O is stubbed: the DB write and the network fetch. The parser and the
// position logic run for real, so this exercises the actual sync behaviour.
const { upsert } = vi.hoisted(() => ({ upsert: vi.fn() }));
vi.mock('$lib/server/prisma/client', () => ({
  prismaClient: { media: { upsert } }
}));

import { PluginSyncer } from './sync';

const README = `
# cool.nvim

A tidy colorscheme.

![banner](./media/banner.png)

## Screenshots

![editor](./media/editor.png)

![telescope](./media/telescope.png)

And the banner once more: ![banner](./media/banner.png)
`;

function syncReadme(readme: string) {
  const plugin = { id: 7, owner: 'me', name: 'cool.nvim', configCount: 0, media: [] };
  // token/repo are unused by the media path beyond the default branch
  return new PluginSyncer('token', plugin as never).syncMedia(readme, {
    default_branch: 'main'
  } as never);
}

const persisted = () => upsert.mock.calls.map((c) => c[0].create);
const row = (frag: string) => persisted().find((m) => m.url.endsWith(frag));

beforeEach(() => {
  upsert.mockReset();
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ headers: { get: () => 'image/png' }, status: 200, statusText: 'OK' }))
  );
});

describe('syncMedia — README image ordering', () => {
  it('stores the first README image as the cover (position 0), the rest in order', async () => {
    await syncReadme(README);

    expect(row('/media/banner.png')?.position).toBe(0);
    expect(row('/media/editor.png')?.position).toBe(1);
    expect(row('/media/telescope.png')?.position).toBe(2);
  });

  it('collapses a repeated image to one row and keeps its first position', async () => {
    await syncReadme(README);

    const banners = persisted().filter((m) => m.url.endsWith('/media/banner.png'));
    expect(banners).toHaveLength(1);
    expect(banners[0].position).toBe(0);
    expect(persisted()).toHaveLength(3);
  });

  it('resolves relative paths against the repo raw URL', async () => {
    await syncReadme(README);

    expect(row('/media/banner.png')?.url).toBe(
      'https://raw.githubusercontent.com/me/cool.nvim/main/media/banner.png'
    );
  });

  it('never writes the thumbnail flag, so a manual cover choice survives re-sync', async () => {
    await syncReadme(README);

    for (const call of upsert.mock.calls) {
      expect(call[0].create).not.toHaveProperty('thumbnail');
      expect(call[0].update).not.toHaveProperty('thumbnail');
    }
  });
});
