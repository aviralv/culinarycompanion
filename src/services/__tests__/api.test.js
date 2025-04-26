const { fetchRecipes } = require('../api');

describe('api.js', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ recipes: [] }),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches recipes successfully', async () => {
    const result = await fetchRecipes(['chicken', 'rice']);
    expect(result).toHaveProperty('recipes');
    expect(global.fetch).toHaveBeenCalled();
  });

  it('throws error on failed fetch', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
    await expect(fetchRecipes(['bad'])).rejects.toThrow();
  });
});
