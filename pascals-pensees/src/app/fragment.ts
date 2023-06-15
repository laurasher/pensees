export interface FragmentInterface {
    cluster: number;
    corpus: string;
    fragment_index: number; //0-indexed machine index.
    fragment_number: number; //index from the published book.
    sim_arr: object;
    col: number;
    row: number;
}
