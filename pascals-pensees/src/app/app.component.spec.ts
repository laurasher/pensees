import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { FragmentInterface } from './fragment';

describe('AppComponent', () => {
  const pensees: FragmentInterface[] = [
    { cluster: 0, corpus: 'grace and faith', fragment_index: 0, fragment_number: 1, sim_arr: {}, col: 0, row: 0 },
    { cluster: 1, corpus: 'reason and logic', fragment_index: 1, fragment_number: 2, sim_arr: {}, col: 1, row: 0 },
    { cluster: 2, corpus: 'heart and will', fragment_index: 2, fragment_number: 3, sim_arr: {}, col: 2, row: 0 }
  ];

  function createComponent(): AppComponent {
    const http = { get: () => of(pensees) } as any;
    return new AppComponent(http);
  }

  it('should create the app', () => {
    const app = createComponent();
    expect(app).toBeTruthy();
  });

  it(`should have the expected title`, () => {
    const app = createComponent();
    expect(app.title).toEqual("Pascal's Pensées");
  });

  it('should filter drawer list by selected clusters', () => {
    const app = createComponent();

    app.onDeselectAllClusters();
    app.onClusterToggle(1);

    expect(app.filteredPenseesList.length).toBe(1);
    expect(app.filteredPenseesList[0].cluster).toBe(1);
    expect(app.filteredPenseesList[0].corpus).toContain('reason');
  });

  it('should apply search and cluster filters together in drawer list', () => {
    const app = createComponent();

    app.searchTerm = 'and';
    app.onSearchChange();
    app.onClusterToggle(2);

    const clusters = app.filteredPenseesList.map(p => p.cluster);
    expect(clusters).toEqual([0, 1]);
    expect(clusters).not.toContain(2);
  });
});
