import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { FragmentInterface } from './fragment';
import { HttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  const pensees: FragmentInterface[] = [
    { cluster: 0, corpus: 'grace and faith', fragment_index: 0, fragment_number: 1, sim_arr: {}, col: 0, row: 0 },
    { cluster: 1, corpus: 'reason and logic', fragment_index: 1, fragment_number: 2, sim_arr: {}, col: 1, row: 0 },
    { cluster: 2, corpus: 'heart and will', fragment_index: 2, fragment_number: 3, sim_arr: {}, col: 2, row: 0 }
  ];

  function createComponent(): AppComponent {
    const http = jasmine.createSpyObj<Pick<HttpClient, 'get'>>('HttpClient', ['get']);
    http.get.and.returnValue(of(pensees));
    return new AppComponent(http as unknown as HttpClient);
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

    expect(app.filteredPenseesList.length).toBe(3);
    app.onDeselectAllClusters();
    app.onClusterToggle(1);

    expect(app.filteredPenseesList.length).toBe(1);
    expect(app.filteredPenseesList[0].cluster).toBe(1);
    expect(app.filteredPenseesList[0].corpus).toContain('reason');
  });

  it('should apply search and cluster filters together in drawer list', () => {
    const app = createComponent();

    app.onDeselectAllClusters();
    app.onClusterToggle(0);
    app.onClusterToggle(1);
    app.searchTerm = 'and';
    app.onSearchChange();

    const clusters = app.filteredPenseesList.map(p => p.cluster);
    expect(clusters).toEqual([0, 1]);
    expect(clusters).not.toContain(2);
  });

  it('should highlight stripe fragment when a text fragment is selected', () => {
    const app = createComponent();
    const pensee = app.filteredPenseesList[1];
    const unselected = app.filteredPenseesList[0];

    app.onPenseeSelect(pensee);
    const style = app.getStripeFragmentStyle(pensee);

    expect(app.selectedFragmentIndex).toBe(pensee.fragment_index);
    expect(app.isStripeFragmentSelected(pensee.fragment_index)).toBeTrue();
    expect(app.isStripeFragmentSelected(unselected.fragment_index)).toBeFalse();
    expect(style['background-color']).toBe(app.clusterColorMap[pensee.cluster]);
  });
});
