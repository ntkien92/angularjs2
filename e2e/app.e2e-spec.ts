import { WakumoProjectPage } from './app.po';

describe('wakumo-project App', () => {
  let page: WakumoProjectPage;

  beforeEach(() => {
    page = new WakumoProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
